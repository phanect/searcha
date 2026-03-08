import EyeOff from "mdi-material-ui/EyeOff";
import { lazy } from "react";
import Settings from "./HiddenSettings";
import { FieldType } from "../../constants/fields";

import type { IFieldConfig } from "../../types";
const Component = lazy(
  () => import("./HiddenComponent")
);

export const HiddenConfig: IFieldConfig = {
  type: FieldType.hidden,
  name: "Hidden",
  group: "input",
  icon: <EyeOff />,
  dataType: "string",
  defaultValue: "",
  component: Component,
  settings: Settings,
};
export default HiddenConfig;
