import * as core from '@actions/core'

export class Config {
  githubToken: string
  tagName: string

  private static instance: Config | null = null

  constructor() {
    this.githubToken = core.getInput('github-token', { required: true })
    this.tagName = core.getInput('tag-name') || 'v1.0.0'
  }

  static inputs(): Config {
    if (!Config.instance) {
      Config.instance = new Config()
    }
    return new Config()
  }
}
