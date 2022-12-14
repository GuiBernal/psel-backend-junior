module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/knexfile.ts", "/node_modules/", "/src/infra/migrations/", "/tests/"],
  coverageReporters: ["lcov", "text"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  globals: {
    "ts-jest": {
      diagnostics: false,
      isolatedModules: true,
    },
  },
  modulePaths: ["<rootDir>/src/"],
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts?(x)"],
};
