/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        isolatedModules: true
      }
    ]
  },
  transformIgnorePatterns: ["node_modules/(?!(chalk)/)"],
  moduleFileExtensions: ["ts", "js", "json", "tsx", "jsx", "node"],
  moduleNameMapper: {
    "^#ansi-styles$": "ansi-styles/index.js",
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^chalk$": "<rootDir>/tests/mocks/chalk.ts",
    "^node-fetch$": "<rootDir>/tests/mocks/node-fetch.ts",
    "^firebase-admin/app$": "<rootDir>/tests/mocks/firebase-admin-app.ts",
    "^firebase-admin/auth$": "<rootDir>/tests/mocks/firebase-admin-auth.ts"
  },
  setupFiles: ["<rootDir>/tests/setup-env.ts"],
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
