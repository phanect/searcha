import { lazy } from "react";
import { date } from "yup";
import Calendar from "mdi-material-ui/Calendar";
import { FieldType } from "../../constants/fields";
import type { IFieldConfig } from "../../types";

const Component = lazy(
  () => import("./DateComponent")
);

export const DateConfig: IFieldConfig = {
  type: FieldType.date,
  name: "Date",
  group: "input",
  icon: <Calendar />,
  dataType: "Date | null",
  defaultValue: null,
  component: Component as any,
  settings: [],
  validation: () => date()
    .typeError("Please enter a valid date")
    .nullable(),
};
export default DateConfig;
