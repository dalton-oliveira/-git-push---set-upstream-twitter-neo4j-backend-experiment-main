/** @type {import('eslint').Linter.Config} */
module.exports = {
  globals: { NodeJS: false },
  parserOptions: { project: ['tsconfig.json', 'tsconfig.dev.json'] },
  extends: [
    'eslint:recommended',
    'plugin:eslint-comments/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:node/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/base',
    'plugin:jest/recommended',
  ],
  settings: {
    'import/parsers': { '@typescript-eslint/parser': ['.ts', '.js'] },
    'import/resolver': { typescript: { project: 'tsconfig.json' } },
  },
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    'no-console': 'off',
    'no-unused-vars': 'off',
    'no-process-exit': 'off',
    'no-async-promise-executor': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    '@typescript-eslint/no-floating-promises': 'error',
    'eslint-comments/no-unused-disable': 'error',
    'node/no-missing-import': 'off',
    'node/no-unpublished-import': ['error', { allowModules: ['zed'] }],
    'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules', 'dynamicImport'] }],
    'jest/no-conditional-expect': 'off',
  },
  overrides: [
    {
      files: ['**/*.{spec}.{ts,js}'],
      rules: {
        'func-names': 'off',
      },
    },
  ],
}
