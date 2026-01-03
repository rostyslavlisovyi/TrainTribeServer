/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  testTimeout: 30000,
  transformIgnorePatterns: ["/node_modules/(?!(chalk|ansi-styles)/)"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          module: "ESNext",
          moduleResolution: "node16",
          esModuleInterop: true
        }
      }
    ]
  },
  moduleFileExtensions: ["ts", "js", "json", "tsx", "jsx", "node"],
  moduleNameMapper: {
    "^chalk$": "<rootDir>/tests/mocks/chalk.ts",
    "^node-fetch$": "<rootDir>/tests/mocks/node-fetch.ts",
    "^file-type$": "<rootDir>/tests/mocks/file-type.ts",
    "^#ansi-styles$": "ansi-styles/index.js",
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  testMatch: ["**/*.test.ts"],
  clearMocks: true,
  passWithNoTests: true
};

module.exports = config;
