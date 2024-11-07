import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default [
  {
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
      "max-len": ["error", { code: 80 }],
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "no-console": "off",
      "arrow-parens": ["error", "always"],
      "react/jsx-first-prop-new-line": ["error", "multiline"],
      "react/jsx-max-props-per-line": ["error", { maximum: 1 }],
      "react/jsx-closing-bracket-location": ["error", "line-aligned"]
    }
  },
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  {
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      sourceType: "module"
    }
  },
  {
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended
];
