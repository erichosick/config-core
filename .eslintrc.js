module.exports = {
  env: {
    browser: true,
    es2021: true,
    mocha: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'], // To stop the import location error
      },
    },
  },
  extends: ['airbnb-base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-return-await': 'off', // code readability is better when await is shown with return.
    'import/extensions': [
      'error',
      'ignorePackages', // to deal with Missing file extension
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
};
