import { getDurationString } from "./utils";
import type { IDisplayCellProps } from "@src/components/fields/types";

export default function Duration({ value }: IDisplayCellProps) {
  if (
    !value?.start
    || !("toDate" in value.start)
    || !value.end
    || !("toDate" in value.end)
  ) {
    return null;
  }

  return <>{getDurationString(value.start.toDate(), value.end.toDate())}</>;
}
