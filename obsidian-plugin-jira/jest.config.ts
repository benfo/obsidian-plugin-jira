/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
module.exports = {
  // Automatically clear mock calls, instances and results before every test
  clearMocks: true,

  // The paths to modules that run some code to configure or set up the testing environment before each test
  // setupFiles: ["<rootDir>/tests/setupTests.ts"],

  // The test environment that will be used for testing
  testEnvironment: "jsdom",
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!nanostores)"],
};
