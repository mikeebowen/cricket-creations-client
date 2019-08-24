module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true,
    browser: true,
    qunit: true,
    jquery: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/essential'],
  globals: {
    expect: true,
    window: true,
    document: true,
    Backbone: true,
    Marionette: true,
    ga: true,
    Handlebars: true,
    steal: true,
    System: true,
    App: true,
    _: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
    },
  },
  rules: {
    'array-bracket-newline': ['error', 'consistent'],
    'comma-dangle': ['warn', 'always-multiline'],
    'eol-last': ['error', 'always'],
    indent: ['error', 2, {MemberExpression: 2, SwitchCase: 2}],
    'max-len': ['warn', 140, {ignoreUrls: true, ignoreStrings: true, ignoreComments: true}],
    'newline-per-chained-call': ['error', {ignoreChainWithDepth: 3}],
    'no-console': ['warn', {allow: ['warn', 'error']}],
    'no-extra-boolean-cast': 'warn',
    'no-multiple-empty-lines': [2, {max: 2, maxEOF: 1}],
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        ignoreRestSiblings: false,
        args: 'none',
      },
    ],
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          consistent: true,
          multiline: true,
        },
        ObjectPattern: {
          consistent: true,
          multiline: true,
        },
        ImportDeclaration: {
          consistent: true,
          multiline: true,
        },
        ExportDeclaration: {
          consistent: true,
          multiline: true,
        },
      },
    ],
    'object-curly-spacing': ['error', 'never'],
    'object-property-newline': ['error', {allowAllPropertiesOnSameLine: true}],
    'object-shorthand': ['error', 'always'],
    'prefer-const': ['error', {destructuring: 'any', ignoreReadBeforeAssign: false}],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    strict: 2,
  },
  plugins: ['standard', 'promise'],
};
