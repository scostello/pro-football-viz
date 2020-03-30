module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './packages/*/tsconfig.json'],
  },
  plugins: [
    '@typescript-eslint',
    'jest'
  ],
  extends: [
    'airbnb-typescript/base',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:jest/recommended',
  ],
  rules: {
    'no-restricted-syntax': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'no-underscore-dangle': 'off',
    'max-classes-per-file': 'off'
  }
};
