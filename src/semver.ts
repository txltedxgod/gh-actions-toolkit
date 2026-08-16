import semver from 'semver';

export type BumpType = 'major' | 'minor' | 'patch' | 'none';

export interface CommitMessage {
  message: string;
  sha: string;
}

export function determineBumpType(commits: CommitMessage[]): BumpType {
  let bump: BumpType = 'none';

  for (const c of commits) {
    const msg = c.message.toLowerCase();

    if (msg.includes('breaking change') || msg.includes('!:') || msg.startsWith('major:')) {
      return 'major'; // Highest priority
    }

    if (msg.startsWith('feat:') || msg.startsWith('feat(') || msg.startsWith('feature:')) {
      bump = 'minor';
    } else if (
      (msg.startsWith('fix:') || msg.startsWith('fix(') || msg.startsWith('perf:') || msg.startsWith('refactor:')) &&
      bump !== 'minor'
    ) {
      bump = 'patch';
    }
  }

  return bump;
}

export function calculateNextVersion(currentVersion: string, bump: BumpType): string {
  const valid = semver.valid(currentVersion) || '0.1.0';
  if (bump === 'none') {
    return valid;
  }
  return semver.inc(valid, bump) || valid;
}
