const core = require('@actions/core')
const github = require('@actions/github')

async function run () {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
    const TAG_NAME = core.getInput('version')
    const octokit = github.getOctokit(GITHUB_TOKEN)

    const context = github.context ?? {}
    console.log({
        owner: context.payload.repository?.owner?.login,
        repo: context.payload.repository?.name,
        branch: context.ref,
        tag_name: TAG_NAME
    })
}

void run()
