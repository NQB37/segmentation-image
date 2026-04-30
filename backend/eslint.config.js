import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    ignores: ['node_modules/', 'coverage/', 'logs/'],
  },
  pluginJs.configs.recommended,
  {
    languageOptions: { globals: { ...globals.node, ...globals.es2020 } },
  },
];
