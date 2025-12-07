/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  transformIgnorePatterns: ["/node_modules/(?!(chalk|ansi-styles)/)"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        isolatedModules: true
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
  globals: {
    "ts-jest": {
      isolatedModules: true,
      tsconfig: {
        module: "Node16",
        moduleResolution: "node16",
        esModuleInterop: true
      }
    }
  },
  clearMocks: true,
  passWithNoTests: true
};

module.exports = config;
