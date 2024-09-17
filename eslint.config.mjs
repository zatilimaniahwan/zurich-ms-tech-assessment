import globals from "globals";
import pluginJs from "@eslint/js";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin";
import tsEslintParser from "@typescript-eslint/parser";

const tsEslintConfig = {
  languageOptions: {
    parser: tsEslintParser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    globals: globals.browser,
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
};

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      "@typescript-eslint": tsEslintPlugin,
    },
    ...pluginJs.configs.recommended,
    ...tsEslintConfig,
  },
];
