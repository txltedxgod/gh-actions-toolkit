import { CommitMessage } from './semver';

export function generateChangelog(version: string, commits: CommitMessage[]): string {
  const date = new Date().toISOString().split('T')[0];
  let changelog = `## [${version}] - ${date}\n\n`;

  const features: string[] = [];
  const fixes: string[] = [];
  const others: string[] = [];

  for (const c of commits) {
    const firstLine = c.message.split('\n')[0].trim();
    const shortSha = c.sha.substring(0, 7);

    if (firstLine.startsWith('feat')) {
      features.push(`- ${firstLine} (${shortSha})`);
    } else if (firstLine.startsWith('fix')) {
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
