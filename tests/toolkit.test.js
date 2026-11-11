'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { determineBumpType, calculateNextVersion } = require('../dist/semver.js');
const { generateChangelog } = require('../dist/changelog.js');

test('determineBumpType does not trigger major on unrelated exclamation marks', () => {
  const bump = determineBumpType([
    { message: 'docs: wait!: clarify usage example', sha: '1111111aaaaaaa' },
    { message: 'chore: everything works!: yay', sha: '2222222bbbbbbb' },
    { message: 'fix(parser): handle edge case', sha: '3333333ccccccc' },
  ]);
  assert.equal(bump, 'patch');
});

test('determineBumpType detects conventional breaking change syntax and footers', () => {
  assert.equal(
    determineBumpType([
      { message: 'fix: tiny', sha: 'aaaaaaa' },
      { message: 'feat(api)!: drop deprecated v1 routes', sha: 'bbbbbbb' },
    ]),
    'major',
  );

  assert.equal(
    determineBumpType([
      { message: 'feat: redesign auth\n\nBREAKING CHANGE: token format changed', sha: 'ccccccc' },
    ]),
    'major',
  );

  assert.equal(
    determineBumpType([
      { message: 'feat(cli): add json flag', sha: 'ddddddd' },
      { message: 'fix: minor bug', sha: 'eeeeeee' },
    ]),
    'minor',
  );
});

test('calculateNextVersion handles valid, v-prefixed, invalid, and none bumps', () => {
  assert.equal(calculateNextVersion('1.2.3', 'major'), '2.0.0');
  assert.equal(calculateNextVersion('v1.2.3', 'minor'), '1.3.0');
  assert.equal(calculateNextVersion('1.2.3', 'none'), '1.2.3');
  assert.equal(calculateNextVersion('not-a-semver', 'patch'), '0.1.1');
});

test('generateChangelog groups scoped conventional commits and ignores blank lines', () => {
  const md = generateChangelog(
    'v1.3.0',
    [
      { message: 'feat(auth)!: require PKCE flow', sha: 'abcdef1234567890' },
      { message: 'fix(cache): avoid stale read', sha: '1234567890abcdef' },
      { message: 'chore: update workflows', sha: '9876543210fedcba' },
    ],
    '2026-11-11',
  );

  assert.match(md, /## \[v1\.3\.0\] - 2026-11-11/);
  assert.match(md, /### 🚀 Features\n- feat\(auth\)!: require PKCE flow \(abcdef1\)/);
  assert.match(md, /### 🐛 Bug Fixes\n- fix\(cache\): avoid stale read \(1234567\)/);
  assert.match(md, /### 🔧 Maintenance & Refactoring\n- chore: update workflows \(9876543\)/);
});
