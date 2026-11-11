import { CommitMessage } from './semver';

const FEAT_RE = /^feat(?:ure)?(?:\([^)\r\n]+\))?!?:/i;
const FIX_RE = /^fix(?:\([^)\r\n]+\))?!?:/i;

export function generateChangelog(
  version: string,
  commits: CommitMessage[],
  date: string = new Date().toISOString().split('T')[0],
): string {
  let changelog = `## [${version}] - ${date}\n\n`;

  const features: string[] = [];
  const fixes: string[] = [];
  const others: string[] = [];

  for (const c of commits) {
    const firstLine = (c.message || '').split(/\r?\n/)[0].trim();
    if (!firstLine) continue;
    const shortSha = (c.sha || '').trim().substring(0, 7) || 'unknown';

    if (FEAT_RE.test(firstLine)) {
      features.push(`- ${firstLine} (${shortSha})`);
    } else if (FIX_RE.test(firstLine)) {
      fixes.push(`- ${firstLine} (${shortSha})`);
    } else {
      others.push(`- ${firstLine} (${shortSha})`);
    }
  }

  if (features.length > 0) {
    changelog += `### 🚀 Features\n${features.join('\n')}\n\n`;
  }
  if (fixes.length > 0) {
    changelog += `### 🐛 Bug Fixes\n${fixes.join('\n')}\n\n`;
  }
  if (others.length > 0) {
    changelog += `### 🔧 Maintenance & Refactoring\n${others.join('\n')}\n\n`;
  }

  return changelog;
}
