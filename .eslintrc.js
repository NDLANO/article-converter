module.exports = {
  extends: "ndla",
  env: {
    node: true
  },
  rules: {
    "max-len": [2, 200, 2, {
      ignoreUrls: true,
      ignoreComments: false
    }],
  }
};
