import js from "@eslint/js";
import globals from "globals";
import tslint from "typescript-eslint";
import eslintReact from "eslint-plugin-react";
import prettierPlugin from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default tslint.config(
  js.configs.recommended,
  ...tslint.configs.strict,
  ...tslint.configs.stylistic,
  {
    plugins: {
      "@typescript-eslint": tslint.plugin,
      react: eslintReact,
      prettier: prettierPlugin
    }
  },
  {
    ignores: [
      "node_modules",
      "dist",
      "build",
      "coverage",
      "public",
      "eslint.config.js",
      "jest.config.ts"
    ]
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2024
      },
      parserOptions: {
        project: ["tsconfig.json"]
      }
    }
  },
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    rules: {
      "require-jsdoc": "off",
      "valid-jsdoc": "off",
      indent: ["error", 2],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
      "no-unused-vars": [
        "error",
        { vars: "all", args: "none", ignoreRestSiblings: true }
      ],
      curly: ["error", "multi-line"],
      eqeqeq: ["error", "always"],
      "comma-dangle": ["error", "never"],
      "max-len": [
        "error",
        {
          code: 80,
          ignoreUrls: true,
          ignoreComments: true,
          ignoreTrailingComments: true
        }
      ],
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "arrow-parens": ["error", "always"],
      "prettier/prettier": "error"
    }
  }
);
