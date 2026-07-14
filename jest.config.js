module.exports = {
  rootDir: "src",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(j|t)sx?$": "babel-jest",
  },
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/*.test.{ts,tsx}",
    "!types/**",
    "!**/styles.tsx",
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 50,
      functions: 80,
      lines: 80,
    },
  },
  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy",
    "\\.(png|jpe?g|gif|svg|webp)$": "<rootDir>/__mocks__/fileMock.js",
    "single-spa-react/parcel": "single-spa-react/lib/cjs/parcel.cjs",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
};
