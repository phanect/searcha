import { frontendLib } from "@phanect/configs/tsup";
import type { Options } from "tsup";

const options: Options = {
  ...frontendLib,
  entry: [ "src/index.ts" ],
  platform: "browser",
};

export default options;
