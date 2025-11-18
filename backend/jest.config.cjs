module.exports = {
  testEnvironment: "node",
  transform: {},
  setupFiles: ["./tests/setup.js"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1.js"
  },
  testMatch: ["**/tests/**/*.test.js"]
};