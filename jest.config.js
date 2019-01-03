module.exports = {
  testRegex: '/__tests__/.*-test.(js|jsx)$',
  setupFiles: ['./src/__tests__/_initTestEnv.js'],
  testEnvironment: 'node',
  snapshotSerializers: ['jest-emotion/serializer'],
};
