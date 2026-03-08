import CheckboxMarked from "mdi-material-ui/CheckboxMarked";
import { lazy } from "react";
import { boolean } from "yup";
import { FieldType } from "../../constants/fields";
import type { IFieldConfig } from "../../types";

const Component = lazy(
  () =>
    import("./CheckboxComponent")
);

export const CheckboxConfig: IFieldConfig = {
  type: FieldType.checkbox,
  name: "Checkbox",
  group: "input",
  icon: <CheckboxMarked />,
  dataType: "boolean",
  defaultValue: false,
  component: Component,
  settings: [],
  validation: (config) => {
    let schema = boolean();

    if (config.required === true) {
      schema = schema.oneOf([ true ], "Please tick the box");
    }

    return schema;
  },
};
export default CheckboxConfig;
