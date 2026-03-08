import pluginBabel from "@rollup/plugin-babel";
import { defineConfig } from "tsdown";

const options = defineConfig({
  entry: [ "src/index.ts" ],

  platform: "neutral",
  // format: "esm",
  plugins: [
    pluginBabel({
      babelHelpers: "bundled",
      parserOpts: {
        sourceType: "module",
        plugins: [ "jsx", "typescript" ],
      },
      plugins: [ "babel-plugin-react-compiler" ],
      extensions: [ ".js", ".jsx", ".ts", ".tsx" ],
    }),
  ],

  dts: true,
  sourcemap: true,

  treeshake: false,
  minify: false,
  clean: true,
});

export default options;
