import * as core from '@actions/core'
import * as github from '@actions/github'

export function getLastMergedBranch(): string {
  const token = core.getInput('github-token', { required: true })
  const octokit = github.getOctokit(token)
  const { owner, repo } = github.context.repo

  try {
    // Brug sync-lignende tilgang ved at blokere eksekveringen med `.then().catch()`
    let lastMergedBranch = ''

    octokit.rest.pulls
      .list({
        owner,
        repo,
        state: 'closed',
        sort: 'updated',
        direction: 'desc',
        per_page: 10
      })
      .then((response) => {
        core.info(response.data.length.toString())
        // @ts-expect-error - merged_at is not defined in the type definition
        core.info(response.data[0].merged_at.toString())

        const lastMergedPR = response.data.find((pr) => pr.merged_at !== null)

        if (!lastMergedPR) {
          throw new Error('No merged pull request found.')
        }
        core.info(lastMergedPR.head.toString())
        core.info(lastMergedPR.head.ref.toString())
        lastMergedBranch = lastMergedPR.head.ref
      })
      .catch((error) => {
        throw new Error(`Error fetching last merged branch: ${error.message}`)
      })

    if (!lastMergedBranch) {
      throw new Error('Failed to determine last merged branch.')
    }

    return lastMergedBranch
  } catch (error) {
    throw new Error(`Unexpected error: ${error}`)
  }
}
