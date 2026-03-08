import OpenIcon from "@mui/icons-material/OpenInBrowser";
import { Box, IconButton, Stack } from "@mui/material";
import { tableRowsAtom, TableScopeContext } from "@src/atoms/tableScope";
import { fieldSx, getFieldId } from "@src/components/SideDrawer/utils";
import { useAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { find, isEqual } from "lodash-es";
import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";

import { useSubTableData } from "./utils";
import type { ISideDrawerFieldProps } from "@src/components/fields/types";

export default function SubTable({ column, _rowy_ref }: ISideDrawerFieldProps) {
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

  const { documentCount, label, subTablePath } = useSubTableData(
    column as any,
    row as any,
    _rowy_ref
  );

  return (
    <Stack direction="row" id={getFieldId(column.key)}>
      <Box sx={fieldSx}>
        {documentCount} {column.name as string}: {label}
      </Box>

      <IconButton
        component={Link}
        to={subTablePath}
        edge="end"
        size="small"
        sx={{ ml: 1 }}
        disabled={!subTablePath}
      >
        <OpenIcon />
      </IconButton>
    </Stack>
  );
}
