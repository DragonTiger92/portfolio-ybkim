import css from "@eslint/css";
import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import globals from "globals";
import tseslint from "typescript-eslint";

const nestedControlFlowNodeTypes = [
  "IfStatement",
  "ForStatement",
  "ForInStatement",
  "ForOfStatement",
  "WhileStatement",
  "DoWhileStatement",
  "SwitchStatement",
  "TryStatement",
  "CatchClause",
];

const cleanCodePlugin = {
  rules: {
    "warn-depth-two": {
      meta: {
        type: "suggestion",
        docs: {
          description: "Warn when control-flow nesting reaches depth 2.",
        },
        schema: [],
        messages: {
          avoidDepthTwo:
            "Control-flow nesting depth is 2. Prefer guard clauses, early returns, or extracting a small function.",
        },
      },
      create(context) {
        const depthStack = [0];

        function enterFunction() {
          depthStack.push(0);
        }

        function exitFunction() {
          depthStack.pop();
        }

        function enterNestedControlFlow(node) {
          const currentIndex = depthStack.length - 1;

          depthStack[currentIndex] += 1;

          if (depthStack[currentIndex] !== 2) {
            return;
          }

          context.report({
            node,
            messageId: "avoidDepthTwo",
          });
        }

        function exitNestedControlFlow() {
          const currentIndex = depthStack.length - 1;

          depthStack[currentIndex] -= 1;
        }

        const visitors = {
          FunctionDeclaration: enterFunction,
          "FunctionDeclaration:exit": exitFunction,
          FunctionExpression: enterFunction,
          "FunctionExpression:exit": exitFunction,
          ArrowFunctionExpression: enterFunction,
          "ArrowFunctionExpression:exit": exitFunction,
        };

        for (const nodeType of nestedControlFlowNodeTypes) {
          visitors[nodeType] = enterNestedControlFlow;
          visitors[`${nodeType}:exit`] = exitNestedControlFlow;
        }

        return visitors;
      },
    },
  },
};

export default defineConfig([
  {
    ignores: [
      "dist/**",
      "build/**",
      "coverage/**",
      "node_modules/**",
      ".astro/**",
      "playwright-report/**",
      "test-results/**",
      "tmp/**",
      ".contexts/**",
      "**/.terraform/**",
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: "warn",
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js, "clean-code": cleanCodePlugin },
    extends: ["js/recommended"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      curly: ["error", "all"],
      eqeqeq: ["error", "always"],
      "no-alert": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-duplicate-imports": "error",
      "no-nested-ternary": "error",
      "no-var": "error",
      "object-shorthand": ["error", "always"],
      "prefer-const": "error",
      "prefer-template": "error",
      "clean-code/warn-depth-two": "warn",
      complexity: ["warn", 8],
      "max-depth": ["error", 2],
      "max-lines": ["warn", { max: 250, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": ["warn", { max: 80, skipBlankLines: true, skipComments: true }],
      "max-params": ["warn", 3],
    },
  },
  {
    files: ["src/**/*.{js,mjs,ts,mts}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["*.config.{js,mjs,ts,mts}", "eslint.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["scripts/**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["tests/**/*.{js,mjs,ts,mts}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ["**/*.{ts,mts,cts}"],
    extends: [tseslint.configs.strict, tseslint.configs.stylistic],
    rules: {
      "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: ["tsconfig*.json", "jsconfig*.json"],
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.jsonc"],
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"],
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
    rules: {
      // Design tokens are defined in tokens.css; this rule does not resolve
      // custom properties across separate stylesheets.
      "css/no-invalid-properties": "off",
      "css/prefer-logical-properties": "warn",
      "css/relative-font-units": "warn",
      "css/use-layers": "warn",
    },
  },
  eslintConfigPrettier,
]);
