import { core, nodejs } from "@phanect/lint";
import { react } from "@phanect/lint-react";

/** @type { import("eslint").Linter.Config[] } */
export default [
  {
    // tmp
    ignores: [
      "**", // Temporarily disable ESLint to show only TypeScript errors on VSCode
    ],
  },
  ...core,
  ...nodejs,
  ...react,

  {
    // Do not add `files: [ "*" ],` here.

    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: [ "**/*" ],
    settings: {
      react: {
        version: "18",
      },
    },

    rules: {
      // FIXME Temporarily allow relaxed type checking. Enable this rule again later.
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
    },
  },
];
