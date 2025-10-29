/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-warning-comments': [
      'error',
      {
        terms: ['@FIXME'],
        location: 'anywhere',
      },
    ],
    'no-restricted-syntax': [
      'error',
      {
        selector:
          'JSXAttribute[name.name="className"][value.type="Literal"][value.value=/^[^ ]*$/] ' +
          ':not(JSXAttribute[value.type="JSXExpressionContainer"])',
        message:
          'Прямое использование строковых литералов в className запрещено. Используйте CSS-модули: className={styles.myClass}',
      },
      {
        selector: 'JSXAttribute[name.name="className"] > Literal[value.value=/ /]',
        message:
          'Использование строк с пробелами (составных классов) в className запрещено. Используйте только CSS-модули.',
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
