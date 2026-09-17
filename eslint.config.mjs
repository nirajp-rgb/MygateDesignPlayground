import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      '.parity/**',
      'dist/**',
      'outputs/**',
      'storybook-static/**',
      'mobile/**',
      'storybook/node_modules/**',
      'storybook/storybook-static/**'
    ]
  },
  {
    files: ['**/*.{ts,tsx,js,mjs}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules
    }
  },
  {
    files: ['App.tsx', 'src/components/**/*.{ts,tsx}', 'src/patterns/**/*.{ts,tsx}', 'src/screens/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
          message: 'Do not hardcode hex colors in app UI files. Use token/theme exports.'
        }
      ]
    }
  }
];
