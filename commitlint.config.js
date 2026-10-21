export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'init',
        'feat',
        'fix',
        'refactor',
        'docs',
        'style',
        'test',
        'perf',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
  },
};
