import type { Options } from "tsup";

const options: Options = {
  entry: [ "src/index.tsx" ],

  platform: "browser",
  format: "esm",

  dts: true,
  sourcemap: true,

  treeshake: false,
  minify: false,
  clean: true,
};

export default options;
