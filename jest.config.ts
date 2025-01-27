import { Config } from "jest";

const config: Config = {
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
  moduleFileExtensions: ["ts", "js", "json"],
  moduleNameMapper: {
    "^#ansi-styles$": "ansi-styles/index.js",
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  testMatch: ["**/*.test.ts"],
  globals: {
    "ts-jest": {
      isolatedModules: true
    }
  },
  clearMocks: true
};

export default config;
