import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

export default tseslint.config([
  globalIgnores(['dist', 'public', '.astro', 'node_modules']),
  {
    files: ['**/*.{ts,mjs,js}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
  },
]);
