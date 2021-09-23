module.exports = {
  testRegex: '.*src.*/__tests__/.*-test.(js|jsx)$',
  setupFiles: ['./src/__tests__/_initTestEnv.js'],
  testEnvironment: 'node',
  snapshotSerializers: ['@emotion/jest/serializer'],
};
