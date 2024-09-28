import { defineConfig } from "tsdown";

const options = defineConfig({
  entry: [ "src/useMemoValue.ts" ],

  platform: "neutral",

  dts: true,
  sourcemap: true,

  treeshake: false,
  minify: false,
  clean: true,
});

export default options;
