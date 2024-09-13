const core = require('@actions/core')
const github = require('@actions/github')

async function run () {
    try {
        const GITHUB_TOKEN = process.env.GH_TOKEN
        const TAG_NAME = core.getInput('version')

        console.log(typeof GITHUB_TOKEN, GITHUB_TOKEN.length)
        console.log(process.env)

        if (!GITHUB_TOKEN) {
            throw new Error('GITHUB_TOKEN is not set.')
        }

        // const octokit = github.getOctokit(GITHUB_TOKEN)

        const context = github.context ?? {}
        console.log({
            owner: context.payload.repository?.owner?.login,
            repo: context.payload.repository?.name,
            branch: context.ref,
            tag_name: TAG_NAME
        })
    } catch (error) {
        core.setFailed(error.message)
    }
}

void run()
