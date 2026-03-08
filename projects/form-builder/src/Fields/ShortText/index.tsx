import FormTextbox from "mdi-material-ui/FormTextbox";
import { lazy } from "react";

import Settings from "./ShortTextSettings";
import validation from "./ShortTextValidation";
import { FieldType } from "../../constants/fields";
import type { IFieldConfig } from "../../types";
const Component = lazy(
  () =>
    import("./ShortTextComponent")
);

export const ShortTextConfig: IFieldConfig = {
  type: FieldType.shortText,
  name: "Short Text",
  group: "input",
  icon: <FormTextbox />,
  dataType: "string",
  defaultValue: "",
  component: Component,
  settings: Settings,
  validation,
};
export default ShortTextConfig;
