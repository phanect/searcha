import { Stack } from "@mui/material";

import ActionFab from "./ActionFab";
import { getActionName } from "./DisplayCell";
import { isUrl, sanitiseCallableName } from "./utils";
import type { IEditorCellProps } from "@src/components/fields/types";

export default function Action({
  column,
  row,
  value,
  disabled,
  tabIndex,
}: IEditorCellProps) {
  const hasRan = value && ![ null, undefined ].includes(value.status);

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ padding: "var(--cell-padding)", pr: 0.5, width: "100%" }}
    >
      <div style={{ flexGrow: 1, overflow: "hidden" }}>
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

      <ActionFab
        row={row}
        column={column}
        value={value}
        disabled={disabled}
        tabIndex={tabIndex}
      />
    </Stack>
  );
}
