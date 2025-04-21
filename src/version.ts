import * as semver from 'semver'
import { ReleaseType } from 'semver'

export class Version {
  isSemanticVersion(version: string): boolean {
    return semver.valid(version) !== null
  }

  isTimestamp(value: string): boolean {
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/
    return isoRegex.test(value)
  }

  nextSemver(version: string, releaseType: ReleaseType): string {
    const next = semver.inc(version, releaseType)
    if (next === null) {
      throw new Error(`Invalid release type: ${releaseType}`)
    } else return next
  }

  getCleanSemVer(version: string): string | undefined {
    return semver.coerce(version)?.toString()
  }

  parseReleaseType(input: string): MyReleaseType | null {
    const match = input.match(/^releaseType:\s*(MAJOR|MINOR|PATCH)$/i)

    return match ? (match[1].toUpperCase() as MyReleaseType) : null
  }
}

export enum MyReleaseType {
  MAJOR = 'MAJOR',
  MINOR = 'MINOR',
  PATCH = 'PATCH'
}
