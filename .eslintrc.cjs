/* eslint-env node */
module.exports = {
  env: { browser: true, es2020: true },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:react-hooks/recommended"],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "simple-import-sort", "react-refresh", "prettier"],
  root: true,
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "prettier/prettier": "error",
  },
}
