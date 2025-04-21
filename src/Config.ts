import * as core from '@actions/core'

export class Config {
  githubToken: string
  tagName: string
  versionStrategy: VersionStrategy

  private static instance: Config | null = null

  constructor() {
    this.githubToken = core.getInput('github-token', { required: true })
    this.tagName = core.getInput('tag-name') || 'v1.0.0'
    this.versionStrategy = this.getVersionStrategy()
  }

  getVersionStrategy(): VersionStrategy {
    const input = core
      .getInput('version-strategy', { required: true })
      .toLowerCase()

    if (!Object.values(VersionStrategy).includes(input as VersionStrategy)) {
      throw new Error(
        `Invalid version-strategy: "${input}". Allowed values: ${Object.values(VersionStrategy).join(', ')}`
      )
    }

    return input as VersionStrategy
  }

  static inputs(): Config {
    if (!Config.instance) {
      Config.instance = new Config()
    }
    return new Config()
  }
}

export enum VersionStrategy {
  SemVer = 'semver',
  Number = 'number',
  Timestamp = 'timestamp'
}
