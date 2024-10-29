import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import type { IDisplayCellProps } from "@src/components/fields/types";

export default function UpdatedAt({ column, value }: IDisplayCellProps) {
  if (!value) {
    return null;
  }
  const dateLabel = format(
    value.toDate ? value.toDate() : value,
    column.config?.format || DATE_TIME_FORMAT
  );

  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>{dateLabel}</span>
  );
}
