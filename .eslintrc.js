module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base'
    // 'airbnb-typescript'
    // 'plugin:@typescript-eslint/recommended',
    // 'prettier/@typescript-eslint',
    // 'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/naming-convention': ['off',
      {
        'selector': ['variable', 'classProperty'],
        'format': ['camelCase'],
        'filter': { 'regex': '(__meta|_id|_doc)', 'match': true },
      },
    ],
    'no-underscore-dangle': ['error', { 'allow': ['__meta', '_id', '_doc'] }],
    'no-restricted-syntax': ['off', {
      'selector': 'ForOfStatement[await=true]',
      'message': 'Todo: Required by EventStoreDB, Check for a better solution.'
    }],
    'max-len': ['error', { 'code': 120, 'tabWidth': 2 }],
    'comma-dangle': [2, 'always-multiline']
  },
};
