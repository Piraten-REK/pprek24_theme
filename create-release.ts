import core from '@actions/core'
import github from '@actions/github'

async function run () {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
    const TAG_NAME = core.getInput('version')
    const octokit = github.getOctokit(GITHUB_TOKEN)

    octokit.rest.repos.createRelease

    const context = github.context ?? {}
    console.log({
        owner: context.payload.repository!.owner!.login,
        repo: context.payload.repository!.name,
        branch: context.ref,
        tag_name: TAG_NAME
    })
}

void run()
