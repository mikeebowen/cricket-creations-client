module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true,
    browser: true,
  },

  extends: ['eslint:recommended', 'plugin:vue/recommended'],

  globals: {
    expect: true,
    window: true,
    document: true,
  },

  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
    },
  },

  plugins: ['standard', 'promise'],

  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
  rules: {
    'array-bracket-newline': ['error', 'consistent'],
    'comma-dangle': ['warn', 'always-multiline'],
    'eol-last': ['error', 'always'],
    indent: ['error', 2, { MemberExpression: 1, SwitchCase: 1 }],
    'max-len': ['warn', 140, { ignoreUrls: true, ignoreStrings: true, ignoreComments: true }],
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 3 }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-extra-boolean-cast': 'warn',
    'no-multiple-empty-lines': [2, { max: 2, maxEOF: 1 }],
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
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
    'object-shorthand': ['error', 'always'],
    'prefer-const': ['error', { destructuring: 'any', ignoreReadBeforeAssign: false }],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    strict: 2,
    'no-plusplus': 0,
  },
}
