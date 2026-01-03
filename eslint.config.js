import js from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import eslintReact from "eslint-plugin-react";
import globals from "globals";
import path from "path";
import tslint from "typescript-eslint";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
      "jest.config.cjs",
      "migrate-mongo-config.js",
      ".vercel"
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
        project: ["tsconfig.eslint.json"],
        tsconfigRootDir: __dirname
      }
    }
  },
  {
    files: ["tests/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: null
      }
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-useless-constructor": "off",
      "@typescript-eslint/no-require-imports": "off",
      "prefer-const": "off"
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
          code: 90,
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
  },
  {
    files: ["instrument.js"],
    languageOptions: {
      parserOptions: {
        project: null
      }
    }
  }
);
