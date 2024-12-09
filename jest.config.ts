import type {Config} from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/*.test.ts'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  clearMocks: true,
  coverageProvider: "v8",
};

export default config;
