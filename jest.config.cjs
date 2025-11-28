/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
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
