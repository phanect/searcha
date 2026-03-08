import OrderBoolAscendingVariant from "mdi-material-ui/OrderBoolAscendingVariant";
import { lazy } from "react";
import { array, string } from "yup";

import Settings from "./MultiSelectSettings";
import { FieldType } from "../../constants/fields";

import type { IFieldConfig } from "../../types";
const Component = lazy(
  () =>
    import(
      "./MultiSelectComponent"
    )
);

export const MultiSelectConfig: IFieldConfig = {
  type: FieldType.multiSelect,
  name: "Multi Select",
  group: "input",
  icon: <OrderBoolAscendingVariant />,
  dataType: "string[]",
  defaultValue: [],
  component: Component as any,
  settings: Settings,
  validation: (config) => {
    let schema = array(string().trim())
      .ensure()
      .compact();

    if (config.required === true) {
      schema = schema.min(1, "Please make at least one selection");
    }

    if (typeof config.max === "number") {
      schema = schema.max(config.max, `Please make at most ${ config.max } selections`);
    }

    return schema;
  },
};
export default MultiSelectConfig;
