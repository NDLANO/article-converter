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
  plugins: [
    "babel"
  ],
  rules: {
    "max-len": [2, 200, 2, {
      ignoreUrls: true,
      ignoreComments: false
    }],

    "react/forbid-prop-types": 0,
    'react/jsx-filename-extension': [0, { extensions: [".js", ".jsx"] }],
    'import/no-extraneous-dependencies':
      ['error', {'devDependencies': true}],
    'react/prop-types': [ 2, {'ignore': ['children','className'] }],
    'import/prefer-default-export': 0
  }
};
