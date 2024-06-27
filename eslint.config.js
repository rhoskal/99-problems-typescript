import eslintTsParser from "@typescript-eslint/parser";
import pluginPrettier from "eslint-plugin-prettier";
import globals from "globals";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: eslintTsParser,
    },
    plugins: {
      pluginPrettier,
    },
  },
  {
    files: ["**/*.{js,ts,mjs,mts}"],
    rules: {
      "no-unused-vars": ["error", { args: "all", argsIgnorePattern: "^_" }],
      "no-undef": "error",
    },
  },
];
