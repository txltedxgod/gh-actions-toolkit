import * as core from '@actions/core';
import * as github from '@actions/github';
import { determineBumpType, calculateNextVersion } from './semver';
import { generateChangelog } from './changelog';

async function run(): Promise<void> {
  try {
    const token = core.getInput('github-token', { required: true });
    const defaultBump = (core.getInput('default-bump') || 'patch') as any;
    const tagPrefix = core.getInput('tag-prefix') || 'v';

    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;

    // Fetch latest release tag
    let latestTag = '0.1.0';
    try {
      const { data: release } = await octokit.rest.repos.getLatestRelease({ owner, repo });
      latestTag = release.tag_name.replace(tagPrefix, '');
    } catch {
      core.info('No existing release found, starting with v0.1.0');
    }

    // Get recent commits
    const { data: commitsData } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: 30,
    });

    const commits = commitsData.map(c => ({
      message: c.commit.message,
      sha: c.sha,
    }));

    const bump = determineBumpType(commits);
    const effectiveBump = bump === 'none' ? defaultBump : bump;
    const nextVersion = calculateNextVersion(latestTag, effectiveBump);
    const newTag = `${tagPrefix}${nextVersion}`;
    const changelog = generateChangelog(newTag, commits);

    core.setOutput('version', nextVersion);
    core.setOutput('tag', newTag);
    core.setOutput('changelog', changelog);

    core.info(`Calculated Next Version: ${newTag} (Bump: ${effectiveBump})`);
  } catch (error: any) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
