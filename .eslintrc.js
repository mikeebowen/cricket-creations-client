module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
  ],
  rules: {
    'eol-last': [ 'error', 'always' ],
    'indent': [ 'error', 2, { 'MemberExpression': 1, 'SwitchCase': 1 } ],
    'linebreak-style': [ 'error', 'unix' ],
    'max-len': [ 'error', 140, { 'ignoreUrls': true, 'ignoreStrings': true, 'ignoreComments': true } ],
    'newline-per-chained-call': [ 'error', { 'ignoreChainWithDepth': 2 } ],
    'no-console': [ 'warn', { 'allow': [ 'warn', 'error' ] } ],
    'no-multiple-empty-lines': [ 2, { 'max': 2, 'maxEOF': 1 } ],
    'no-unused-vars': [ 'error', { 'vars': 'all', 'args': 'after-used', 'ignoreRestSiblings': false } ],
    'prefer-const': [ 'error', { 'destructuring': 'any', 'ignoreReadBeforeAssign': false } ],
    'quotes': [ 'error', 'single' ],
    'semi': [ 'error', 'always' ],
    'strict': 2,
    'comma-dangle': [ 'error', 'always-multiline' ],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
