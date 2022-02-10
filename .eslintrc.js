const path = require('path')

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-typescript'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: path.resolve(__dirname, './tsconfig.json'),
  },
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  rules: {
    'max-len': ['error', 250],
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/no-unused-vars': [1],
    'no-async-promise-executor': [1],
    'no-bitwise': 'off',
    'arrow-body-style': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
    'no-lone-blocks': 'off',
    'no-lonely-if': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/media-has-caption': 'off',
    'react/state-in-constructor': 'off',
    'react/sort-comp': 'off',
    'class-methods-use-this': 'off',
    'react-hooks/rules-of-hooks': 'error', // 检查 Hook 的规则
    'react-hooks/exhaustive-deps': 'warn', // 检查 effect 的依赖
    'prefer-destructuring': 'off',
  },
}
