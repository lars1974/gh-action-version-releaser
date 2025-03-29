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

export async function getLatestTag(): Promise<string> {
  try {
    const { owner, repo } = github.context.repo

    const response = await getOctokit().rest.repos.listTags({
      owner,
      repo,
      per_page: 1 // Vi behøver kun det nyeste tag
    })

    if (response.data.length === 0) {
      createTag('v0.0.0')
      return 'v0.0.0' // Opretter et tag hvis der ikke er nogen
    }

    return response.data[0].name // Returnerer det nyeste tag
  } catch (error) {
    throw new Error(
      `Error fetching latest tag: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

export async function createTag(tagName: string): Promise<void> {
  const { owner, repo } = github.context.repo

  // 1️⃣ Opret et nyt annotated tag
  const tagResponse = await getOctokit().rest.git.createTag({
    owner,
    repo,
    tag: tagName,
    message: `Release ${tagName}`,
    object: github.context.sha,
    type: 'commit' // Kan også være 'tree' eller 'blob'
  })

  const tagSha = tagResponse.data.sha

  // 2️⃣ Opret en ny reference i GitHub (`refs/tags/<tag-name>`)
  await getOctokit().rest.git.createRef({
    owner,
    repo,
    ref: `refs/tags/${tagName}`,
    sha: tagSha
  })

  console.log(`✅ Successfully created tag: ${tagName}`)
}

function getOctokit() {
  const token = core.getInput('github-token', { required: true })
  return github.getOctokit(token)
}
