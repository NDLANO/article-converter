module.exports = {
  parser: "babel-eslint",
  extends: "airbnb",
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  env: {
    node: true
  },
  plugins: [
    "babel"
  ],
  rules: {
    "max-len": [2, 200, 2, {
      ignoreUrls: true,
      ignoreComments: false
    }],

    // generator-star-spacing breaks linting in codebases that use async/await syntax
    // See https://github.com/eslint/eslint/issues/6528
    // enable babel/generator-star-spacing instead.
    'generator-star-spacing': 0,
    'babel/generator-star-spacing': [2, { 'before': false, 'after': true }],


    'react/jsx-filename-extension': [0, { extensions: [".js", ".jsx"] }],
    'import/no-extraneous-dependencies':
      ['error', {'devDependencies': true}],
    'react/prop-types': [ 2, {'ignore': ['children','className'] }],
    'import/prefer-default-export': 0
  }
};
