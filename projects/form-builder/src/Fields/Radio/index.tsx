import RadioboxMarked from "mdi-material-ui/RadioboxMarked";
import { lazy } from "react";
import { string } from "yup";
import Settings from "./RadioSettings";
import { FieldType } from "../../constants/fields";

import type { IFieldConfig } from "../../types";
const Component = lazy(
  () => import("./RadioComponent")
);

export const RadioConfig: IFieldConfig = {
  type: FieldType.radio,
  name: "Radio",
  group: "input",
  icon: <RadioboxMarked />,
  dataType: "string",
  defaultValue: "",
  component: Component as any,
  settings: Settings,
  validation: () => string().trim(),
};
export default RadioConfig;
