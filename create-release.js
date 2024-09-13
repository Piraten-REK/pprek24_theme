const core = require('@actions/core')
const github = require('@actions/github')
const os = require('os')

const CHANGELOG_PATH = 'CHANGELOG.md'

const UNRELEASED_SECTION = [
    '## [Unreleased]',
    '',
    '### Added',
    '### Changed',
    '### Deprecated',
    '### Removed',
    '### Fixed',
    '### Security'
]

/**
 * @param {string} currentChangelog
 * @param {string} version
 * @returns {[string, string]} Tuple of new changelog, and current changeset
 */
function updateChangelog (currentChangelog, version) {
    const changeLog = currentChangelog.split(/\r?\n/)

    const startIdx = changeLog.indexOf('## [Unreleased]')
    /** @type {number | undefined} */
    let endIdx = changeLog
        .slice(startIdx + 1)
        .findIndex(it => /^##(?!#)/.test(it))
    if (endIdx >= 0) {
        endIdx += startIdx + 1
    } else {
        endIdx = undefined
    }

    const changes = changeLog.slice(startIdx, endIdx)

    /** @type {Map<string, Array<string>>} */
    const changeSets = new Map();

    /** @type {string} */
    let currentChangeSet = '';
    let start = 1;
    for (let idx = 1, line = changes[1]; idx < changes.length; line = changes[++idx]) {
        const heading = line.match(/^###\s*([^#].*)/)

        if (heading == null) {
            continue
        }

        if (start < idx - 1) {
            const set = changes
                .slice(start, idx)
                .filter(line => line.trim() !== '' && !/^###(?!#)/.test(line))

            if (set.length > 0) {
                changeSets.set(currentChangeSet, set)
            }
        }

        currentChangeSet = heading[1]
        start = idx
    }

    const input = [`## [${version.slice(1)}] – ${new Date().toISOString().split('T')[0]}`, '']

    for (const [changeSet, lines] of changeSets.entries()) {
        input.push(`### ${changeSet}`, ...lines, '')
    }

    const newChangeLog = Array.from(changeLog)
    newChangeLog.splice(
        startIdx,
        endIdx - startIdx,
        ...UNRELEASED_SECTION, '', '',
        ...input, ''
    )

    return [newChangeLog.join('\n'), input.join('\n')]
}

/**
 * @typedef {object} GetContent
 * @property {number} status
 * @property {string} url
 * @property {Record<string, string>} headers
 * @property {object} data
 * @property {string} data.name
 * @property {string} data.path
 * @property {string} data.sha
 * @property {number} data.size
 * @property {string} data.url
 * @property {string} data.html_url
 * @property {string} data.git_url
 * @property {string} data.download_url
 * @property {'file'} data.type
 * @property {string} data.content
 * @property {BufferEncoding} data.encoding
 * @property {object} data._links
 * @property {string} data._links.self
 * @property {string} data._links.git
 * @property {string} data._links.html
 */

async function run () {
    try {
        const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
        const version = core.getInput('version')

        if (!GITHUB_TOKEN) {
            throw new Error('GITHUB_TOKEN is not set.')
        }

        const preRelease = core.getBooleanInput('preRelease')
        const makeLatest = core.getBooleanInput('makeLatest')

        const octokit = github.getOctokit(GITHUB_TOKEN)

        const context = github.context ?? {}

        const owner = context.payload.repository?.owner?.login
        const repo = context.payload.repository?.name

        if (owner == null || repo == null) {
            throw new Error('Something went wrong')
        }

        // Get CHANGELOG

        /** @type {GetContent} */
        const changeLog = await octokit.rest.repos.getContent({
            owner,
            repo,
            ref: context.ref,
            path: CHANGELOG_PATH
        })

        const changeLogString = Buffer.from(changeLog.data.content, changeLog.data.encoding).toString('utf8')

        const [newChangelog, changes] =  updateChangelog(changeLogString, TAG_NAME)

        // Update CHANGELOG

        const updateChangelogResponse = await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: CHANGELOG_PATH,
            message: `prepare release ${version}`,
            content: Buffer.from(newChangelog, 'utf8').toString('base64'),
            sha: changeLog.data.sha,
            branch: context.ref
        })

        console.log('CHANGELOG updated: ', updateChangelogResponse.data.html_url)

        // Create release
        const response = await octokit.rest.repos.createRelease({
            owner,
            repo,
            tag_name: version,
            target_commitish: context.ref,
            name: `Version ${version.slice(1)}`,
            body: changes,
            draft: false,
            prerelease: preRelease,
            make_latest: makeLatest
        })

        console.log('Release created successfully:', response.data.html_url)
    } catch (error) {
        core.setFailed(error.message)
    }
}

void run()
