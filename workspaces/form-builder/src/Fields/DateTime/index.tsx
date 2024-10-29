import { lazy } from "react";
import { date } from "yup";
import CalendarClock from "mdi-material-ui/CalendarClock";
import { FieldType } from "../../constants/fields";
import type { IFieldConfig } from "../../types";

const Component = lazy(
  () =>
    import("./DateTimeComponent")
);

export const DateTimeConfig: IFieldConfig = {
  type: FieldType.dateTime,
  name: "Time & Date",
  group: "input",
  icon: <CalendarClock />,
  dataType: "Date | null",
  defaultValue: null,
  component: Component as any,
  settings: [],
  validation: () => date()
    .typeError("Please enter a valid date")
    .nullable(),
};
export default DateTimeConfig;
