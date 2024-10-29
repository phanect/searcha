import { lazy } from "react";
import { string } from "yup";
import OrderBoolDescending from "mdi-material-ui/OrderBoolDescending";
import { FieldType } from "../../constants/fields";

import Settings from "./SingleSelectSettings";
import type { IFieldConfig } from "../../types";
const Component = lazy(
  () =>
    import(
      "./SingleSelectComponent"
    )
);

export const SingleSelectConfig: IFieldConfig = {
  type: FieldType.singleSelect,
  name: "Single Select",
  group: "input",
  icon: <OrderBoolDescending />,
  dataType: "string",
  defaultValue: "",
  component: Component as any,
  settings: Settings,
  validation: () => string().trim(),
};
export default SingleSelectConfig;
