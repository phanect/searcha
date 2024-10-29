import { lazy } from "react";
import { number } from "yup";
import Numeric10Box from "mdi-material-ui/Numeric10Box";
import { FieldType } from "../../constants/fields";

import Settings from "./ScoreSettings";
import type { IFieldConfig } from "../../types";
const Component = lazy(
  () => import("./ScoreComponent")
);

export const ScoreConfig: IFieldConfig = {
  type: FieldType.score,
  name: "Score",
  group: "input",
  icon: <Numeric10Box />,
  dataType: "number",
  defaultValue: undefined,
  component: Component,
  settings: Settings,
  validation: () => number(),
};
export default ScoreConfig;
