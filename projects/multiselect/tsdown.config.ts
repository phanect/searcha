import { defineConfig } from "tsdown";

const options = defineConfig({
  entry: [ "src/index.tsx" ],

  platform: "neutral",

  dts: true,
  sourcemap: true,

  treeshake: false,
  minify: false,
  clean: true,
});

export default options;
