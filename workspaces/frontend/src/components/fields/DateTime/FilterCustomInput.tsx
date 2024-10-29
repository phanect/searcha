import DateInput from "@src/components/fields/Date/SideDrawerField";
import DateTimeInput from "./SideDrawerField";
import type { IFilterCustomInputProps } from "@src/components/fields/types";

export default function FilterCustomInput({
  onChange,
  operator,
  ...props
}: IFilterCustomInputProps) {
  if (operator && operator.startsWith("date-")) {
    return <DateInput {...(props as any)} onChange={onChange} />;
  }

  return <DateTimeInput {...(props as any)} onChange={onChange} />;
}
