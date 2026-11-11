import semver from 'semver';

export type BumpType = 'major' | 'minor' | 'patch' | 'none';

export interface CommitMessage {
  message: string;
  sha: string;
}

const BREAKING_HEADER_RE = /^[a-z][a-z0-9_-]*(?:\([^)\r\n]+\))?!:/i;
const BREAKING_FOOTER_RE = /(?:^|\r?\n)BREAKING[- ]CHANGE:\s/i;
const MINOR_HEADER_RE = /^feat(?:ure)?(?:\([^)\r\n]+\))?:/i;
const PATCH_HEADER_RE = /^(?:fix|perf|refactor)(?:\([^)\r\n]+\))?:/i;

export function determineBumpType(commits: CommitMessage[]): BumpType {
  let bump: BumpType = 'none';

  for (const c of commits) {
    const raw = (c.message || '').trim();
    const firstLine = raw.split(/\r?\n/)[0].trim();

    if (
      BREAKING_HEADER_RE.test(firstLine) ||
      BREAKING_FOOTER_RE.test(raw) ||
      /^major:/i.test(firstLine)
    ) {
      return 'major'; // Highest priority
    }

    if (MINOR_HEADER_RE.test(firstLine)) {
      bump = 'minor';
    } else if (PATCH_HEADER_RE.test(firstLine) && bump !== 'minor') {
      bump = 'patch';
    }
  }

  return bump;
}

export function calculateNextVersion(currentVersion: string, bump: BumpType): string {
  const valid = semver.valid(currentVersion) || semver.clean(currentVersion) || '0.1.0';
  if (bump === 'none') {
    return valid;
  }
  return semver.inc(valid, bump) || valid;
}
