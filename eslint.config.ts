import { core, nodejs } from "@phanect/lint";
import { react } from "@phanect/lint-react";
import type { Linter } from "eslint";

const configs: Linter.Config[] = [
  {
    ignores: [
      "./**/dist/**",
    ],
  },

  ...core,
  ...nodejs,
  ...react,

  {
    // Do not add `files: [ "*" ],` here.

    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: "19",
      },
    },

    rules: {
      // FIXME Temporarily allow relaxed type checking. Enable this rule again later.
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
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
