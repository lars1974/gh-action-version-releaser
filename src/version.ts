import * as semver from 'semver'

export function isSemanticVersion(version: string): boolean {
  return semver.valid(version) !== null
}

export function isTimestamp(value: string): boolean {
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/
  return isoRegex.test(value)
}

export function getCleanSemVer(version: string): string | undefined {
  return semver.coerce(version)?.toString()
}
