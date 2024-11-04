import { core, nodejs } from "@phanect/lint";
import { react } from "@phanect/lint-react";

/** @type { import("eslint").Linter.Config[] } */
export default [
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
  },
];
