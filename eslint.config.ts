import { core, nodejs, unbundled } from "@phanect/lint";
import { react } from "@phanect/lint-react";
import type { Linter } from "eslint";

const configs: Linter.Config[] = [
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
  {
    files: [ "**/*.{js,mjs,jsx,ts,tsx}"],
    rules: {
      "no-restricted-imports": [ "error", {
        "patterns": [{
          "group": [
            "lodash",
            "lodash/*"
          ],
          "message": "Use lodash-es instead",
        }],
      }],
    }
  }
];

export default configs;
