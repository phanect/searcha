import Palette from "mdi-material-ui/Palette";
import { lazy } from "react";
import { object } from "yup";
import Settings from "./ColorSettings";
import { FieldType } from "../../constants/fields";

import type { IFieldConfig } from "../../types";
const Component = lazy(
  () => import("./ColorComponent")
);

export const ColorConfig: IFieldConfig = {
  type: FieldType.color,
  name: "Color",
  group: "input",
  icon: <Palette />,
  dataType: "Record<string, any>",
  defaultValue: null,
  component: Component,
  settings: Settings,
  validation: () => object().nullable(),
};
export default ColorConfig;
