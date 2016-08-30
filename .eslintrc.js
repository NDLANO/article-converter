module.exports = {
  extends: "airbnb",
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  env: {
    node: true
  },
  rules: {
    "max-len": [2, 200, 2, {
      ignoreUrls: true,
      ignoreComments: false
    }],
    'react/jsx-filename-extension': [0, { extensions: [".js", ".jsx"] }],
    'import/no-extraneous-dependencies':
      ['error', {'devDependencies': true}],
    'react/prop-types': [ 2, {'ignore': ['children','className'] }],
    'import/prefer-default-export': 0
  }
};
