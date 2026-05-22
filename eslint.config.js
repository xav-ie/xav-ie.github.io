import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import unicorn from 'eslint-plugin-unicorn';
import { configs as astroConfigs } from 'eslint-plugin-astro';
import { configs as regexpConfigs } from 'eslint-plugin-regexp';
import * as importX from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import sonarjs from 'eslint-plugin-sonarjs';
import n from 'eslint-plugin-n';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'public', '.astro', 'node_modules']),
  {
    files: ['**/*.{ts,mts,cts,mjs,js}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      unicorn.configs.recommended,
      regexpConfigs['flat/recommended'],
      importX.flatConfigs.recommended,
      sonarjs.configs.recommended,
      n.configs['flat/recommended-module'],
    ],
    settings: {
      'import-x/extensions': ['.ts', '.mts', '.cts', '.js', '.mjs', '.cjs'],
      'import-x/external-module-folders': [
        'node_modules',
        'node_modules/@types',
      ],
      'import-x/parsers': {
        '@typescript-eslint/parser': ['.ts', '.mts', '.cts'],
      },
      // Node 22+ has stable fetch, Response, and other Web-compatible APIs.
      n: { version: '>=22.0.0' },
    },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // node: builtins, virtual modules (astro:*, astro/config), and relative
      // TS paths are all validated by tsc — skip them here.
      'import-x/no-unresolved': [
        'error',
        { ignore: ['^node:', '^astro', String.raw`^\.`] },
      ],
      // TypeScript's own type checker makes no-undef redundant for TS files,
      // and it produces false positives for TS-only global types (e.g. NodeListOf).
      'no-undef': 'off',
      // Virtual modules (astro:content, astro:assets, …) are unresolvable by
      // the plugin but already validated by tsc + import-x/no-unresolved.
      'import-x/order': 'error',
      'n/no-missing-import': 'off',
      // Scripts are invoked via `pnpm run`, not as direct executables.
      'n/hashbang': 'off',
    },
  },
  {
    ...jsxA11y.flatConfigs.recommended,
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      // <ul role="list"> on list-style:none elements is the intentional
      // Safari/VoiceOver fix — removing the role would break screen reader UX.
      'jsx-a11y/no-redundant-roles': 'off',
    },
  },
  ...astroConfigs['flat/recommended'],
  // astro flat/recommended sets up astro-eslint-parser but omits the TS sub-parser;
  // TypeScript in frontmatter and <script> blocks both need it set explicitly.
  {
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
    rules: {
      // set:html content is invisible to the plugin — false positive.
      'jsx-a11y/heading-has-content': 'off',
      // Astro uses HTML `for`, not JSX `htmlFor`.
      'jsx-a11y/label-has-associated-control': 'off',
      // <script> blocks run in the browser — browser globals (localStorage,
      // navigator, …) are valid here, not Node.js builtins.
      'n/no-unsupported-features/node-builtins': 'off',
    },
  },
  {
    // Virtual TS blocks produced by astro-eslint-parser for <script> tags.
    files: ['**/*.astro/*.ts', '*.astro/*.ts'],
    languageOptions: { parser: tseslint.parser },
    rules: {
      'n/no-unsupported-features/node-builtins': 'off',
    },
  },
  {
    // CLI scripts legitimately exit with a status code.
    files: ['scripts/**'],
    rules: {
      'n/no-process-exit': 'off',
      'unicorn/no-process-exit': 'off',
    },
  },
]);
