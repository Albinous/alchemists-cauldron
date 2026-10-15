import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export default defineConfig([
  globalIgnores(['dist']),
  js.configs.recommended,
  tseslint.configs.strict,
  eslintPluginUnicorn.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      'no-console': 'error',
      'prefer-const': 'error',
      eqeqeq: 'error',
    },
  },
  {
    files: ['*.config.{js,ts}'],
    rules: {
      'unicorn/no-top-level-side-effects': 'off',
    },
  },
  eslintConfigPrettier,
]);
