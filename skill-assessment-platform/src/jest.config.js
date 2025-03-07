/** @type {import('jest').Config} */
module.exports = {
    // Transform ES modules including lucide-react
    transformIgnorePatterns: [
      "/node_modules/(?!lucide-react)/"
    ],
    // Set test environment
    testEnvironment: "jsdom",
    // Allow importing ESM modules
    transform: {
      "^.+\\.[t|j]sx?$": "babel-jest"
    },
    // Handle ESM modules
    extensionsToTreatAsEsm: [".jsx", ".js", ".ts", ".tsx"],
    // Ensure Jest can handle CSS modules and other assets
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js"
    }
  };