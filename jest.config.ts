import { Config } from "@jest/types";

export default (): Config.InitialOptions => {
  return {
    verbose: true,
    preset: "ts-jest/presets/js-with-ts",
    testEnvironment: "node",
    moduleFileExtensions: ["ts", "js"],
    transformIgnorePatterns: ["/node_modules/"],
    passWithNoTests: true,
  };
};
