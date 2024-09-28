import { frontendLib } from "@phanect/configs/tsup";
import type { Options } from "tsup";

const options: Options = {
  ...frontendLib,
  entry: [ "src/useMemoValue.ts" ],
  platform: "browser",
};

export default options;
