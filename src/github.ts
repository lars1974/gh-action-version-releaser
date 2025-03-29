import * as core from '@actions/core'
import * as github from '@actions/github'

export async function getLastMergedBranch(): Promise<string> {
  const { owner, repo } = github.context.repo

  const response = await getOctokit().rest.pulls.list({
    owner,
    repo,
    state: 'closed',
    sort: 'updated',
    direction: 'desc',
    per_page: 20 // Henter de seneste 20 PR'er for at finde en der er merged
  })

  const mergedPR = response.data.find((pr) => pr.merged_at !== null)
  if (!mergedPR) {
    throw new Error('No merged pull requests found.')
  }
  return mergedPR.head.ref
}

function getOctokit() {
  const token = core.getInput('github-token', { required: true })
  return github.getOctokit(token)
}
