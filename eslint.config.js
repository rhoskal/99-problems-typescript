import eslintTsParser from "@typescript-eslint/parser";

export default [
  {
    languageOptions: {
      parser: eslintTsParser,
    },
    plugins: {},
  },
  {
    files: ["**/*.{js,ts,mjs,mts}"],
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
    },
  },
];
