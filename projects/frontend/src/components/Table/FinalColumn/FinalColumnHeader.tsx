import { useSetAtom } from "jotai";
import { useContext } from "react";
import { Box, Button } from "@mui/material";
import { AddColumn as AddColumnIcon } from "@src/assets/icons";

import { TableScopeContext, columnModalAtom } from "@src/atoms/tableScope";
import { spreadSx } from "@src/utils/ui";
import type { BoxProps } from "@mui/material";

export type IFinalColumnHeaderProps = {
  focusInsideCell: boolean;
  canAddColumns: boolean;
} & Partial<BoxProps>;

export default function FinalColumnHeader({
  focusInsideCell,
  canAddColumns,
  ...props
}: IFinalColumnHeaderProps) {
  const tableScopeStore = useContext(TableScopeContext);
  const openColumnModal = useSetAtom(columnModalAtom, { store: tableScopeStore });

  if (canAddColumns) {
    return (
      <Box
        role="columnheader"
        {...props}
        sx={[
          {
            backgroundColor: "background.default",
            border: (theme) => `1px solid ${ theme.palette.divider }`,
            borderLeft: "none",
            borderTopRightRadius: (theme) => theme.shape.borderRadius,
            borderBottomRightRadius: (theme) => theme.shape.borderRadius,
            display: "flex",
            alignItems: "center",
            width: 32 * 3 + 4 * 2 + 10 * 2,
            overflow: "visible",
            px: 0.75,
          },
          ...spreadSx(props.sx),
        ]}
        className="column-header"
      >
        <Button
          onClick={() => openColumnModal({ type: "new" })}
          variant="contained"
          color="primary"
          startIcon={<AddColumnIcon />}
          style={{ zIndex: 1, flexShrink: 0 }}
          tabIndex={focusInsideCell ? 0 : -1}
        >
          Add column
        </Button>
      </Box>
    );
  } else {
    return (
      <Box
        role="columnheader"
        {...props}
        sx={[
          {
            backgroundColor: "background.default",
            border: (theme) => `1px solid ${ theme.palette.divider }`,
            borderLeft: "none",
            borderTopRightRadius: (theme) => theme.shape.borderRadius,
            borderBottomRightRadius: (theme) => theme.shape.borderRadius,

            display: "flex",
            alignItems: "center",

            width: 32 * 3 + 4 * 2 + 10 * 2,
            px: 1.5,
            color: "text.secondary",
          },
          ...spreadSx(props.sx),
        ]}
        className="column-header"
      >
        Actions
      </Box>
    );
  }
}
