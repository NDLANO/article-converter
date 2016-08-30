module.exports = {
  extends: "airbnb",
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    "max-len": [2, 200, 2, {
      ignoreUrls: true,
      ignoreComments: false
    }],
    'react/jsx-filename-extension': [0, { extensions: [".js", ".jsx"] }],
    'react/prop-types': [ 2, {'ignore': ['children','className'] }],
    "comma-dangle": 0,
    'import/prefer-default-export': 0,
    "object-curly-spacing": 0
  }
};
