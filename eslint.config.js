import js from '@eslint/js'
import tseslint from "@typescript-eslint/eslint-plugin";
import tsp from "@typescript-eslint/parser";
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsp,
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      "indent": ["error", 2],
    },
  },
]
