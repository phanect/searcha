import { defineConfig } from "tsdown";

const options = defineConfig({
  entry: [ "src/index.ts" ],

  platform: "neutral",

  dts: true,
  sourcemap: true,

  treeshake: false,
  minify: false,
  clean: true,
});

export default options;
