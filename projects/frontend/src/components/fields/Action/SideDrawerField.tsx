import { Box, Link, Stack } from "@mui/material";
import { tableRowsAtom, TableScopeContext } from "@src/atoms/tableScope";
import { fieldSx, getFieldId } from "@src/components/SideDrawer/utils";
import { useAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { find, isEqual } from "lodash-es";

import { useContext, useMemo } from "react";
import ActionFab from "./ActionFab";
import { getActionName } from "./DisplayCell";
import { isUrl, sanitiseCallableName } from "./utils";
import type { ISideDrawerFieldProps } from "@src/components/fields/types";

export default function Action({
  column,
  _rowy_ref,
  value,
  disabled,
}: ISideDrawerFieldProps) {
  const tableScopeStore = useContext(TableScopeContext);
  const [ row ] = useAtom(
    useMemo(
      () =>
        selectAtom(
          tableRowsAtom,
          (tableRows) => find(tableRows, [ "_rowy_ref.path", _rowy_ref.path ]),
          isEqual
        ),
      [ _rowy_ref.path ]
    ),
    { store: tableScopeStore },
  );

  const hasRan = value?.status;

  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: -2 / 8 }}>
      <Box
        sx={[
          fieldSx,
          {
            flexGrow: 1,
            whiteSpace: "normal",
            width: "100%",
            overflow: "hidden",
          },
        ]}
      >
        {hasRan && isUrl(value.status) ? (
          <Link
            href={value.status}
            target="_blank"
            rel="noopener noreferrer"
            variant="body2"
            underline="always"
          >
            {value.status}
          </Link>
        ) : hasRan ? (
          value.status
        ) : (
          sanitiseCallableName(getActionName(column))
        )}
      </Box>

      <ActionFab
        row={row}
        column={column}
        value={value}
        disabled={disabled}
        id={getFieldId(column.key)}
      />
    </Stack>
  );
}
