# gh-actions-toolkit

> Custom **GitHub Action** in TypeScript for automated Semantic Versioning (SemVer) calculation, changelog generation, and release tagging from conventional commits.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org)
[![GitHub Actions](https://img.shields.io/badge/GitHub-Action-2088FF?style=flat-square&logo=githubactions)](https://github.com/features/actions)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

`#github-actions` `#ci-cd` `#semver` `#changelog` `#release-automation` `#typescript` `#devops`

---

## How It Works

1. Analyzes recent Git commits since the last release tag.
2. Detects conventional commit keywords (`feat:` -> minor, `fix:` -> patch, `BREAKING CHANGE` -> major).
3. Computes the next semantic version number and generates a markdown changelog.
4. Provides outputs (`steps.version.outputs.tag`, `steps.version.outputs.changelog`) for subsequent build and release steps.

## Usage in Workflows

```yaml
name: Release

on:
  push:
    branches: [ main ]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Calculate Version & Changelog
        id: semver
        uses: txltedxgod/gh-actions-toolkit@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          tag-prefix: "v"
          default-bump: "patch"

      - name: Print Version
        run: |
          echo "Next Version: ${{ steps.semver.outputs.tag }}"
          echo "${{ steps.semver.outputs.changelog }}"
```
