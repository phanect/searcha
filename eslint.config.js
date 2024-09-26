import { core, nodejs, unbundled } from "@phanect/lint";
import { react } from "@phanect/lint-react";

/** @type { import("eslint").Linter.Config[] } */
export default [
  ...core,
  ...nodejs,
  ...unbundled,
  ...react,

  {
    // Do not add `files: [ "*" ],` here.

    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
