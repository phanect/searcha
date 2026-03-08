import { get } from "lodash-es";
import { isUrl, sanitiseCallableName } from "./utils";
import type { IDisplayCellProps } from "@src/components/fields/types";

export const getActionName = (column: IDisplayCellProps["column"]) => {
  const config = get(column, "config");
  if (!get(config, "customName.enabled")) {
    return get(column, "name");
  }
  return get(config, "customName.actionName") || get(column, "name");
};

export default function Action({ value, column }: IDisplayCellProps) {
  const hasRan = value && ![ null, undefined ].includes(value.status);

  return (
    <div style={{ padding: "0 var(--cell-padding)" }}>
      {hasRan && isUrl(value.status) ? (
        <a href={value.status} target="_blank" rel="noopener noreferrer">
          {value.status}
        </a>
      ) : hasRan ? (
        value.status
      ) : (
        sanitiseCallableName(getActionName(column))
      )}
    </div>
  );
}
