import { ButtonBase, Grid2 as Grid, Tooltip, useTheme } from "@mui/material";
import WarningIcon from "@mui/icons-material/WarningAmber";
import { ChevronDown } from "@src/assets/icons";

import ChipList from "@src/components/Table/TableCell/ChipList";
import FormattedChip from "@src/components/FormattedChip";
import {
  getColors,
} from "@src/components/fields/SingleSelect/Settings";
import { sanitiseValue } from "./utils";
import type {
  IColors } from "@src/components/fields/SingleSelect/Settings";
import type { IDisplayCellProps } from "@src/components/fields/types";

export default function MultiSelect({
  value,
  showPopoverCell,
  disabled,
  tabIndex,
  rowHeight,
  column,
}: IDisplayCellProps) {
  const colors: IColors[] = column?.config?.colors ?? [];
  const { mode } = useTheme().palette;

  const rendered
    = typeof value === "string" && value !== "" ? (
      <div style={{ flexGrow: 1, paddingLeft: "var(--cell-padding)" }}>
        <Tooltip title="This cell’s value is a string and needs to be converted to an array">
          <WarningIcon color="action" style={{ verticalAlign: "middle" }} />
        </Tooltip>
        &nbsp;
        {value}
      </div>
    ) : (
      <ChipList rowHeight={rowHeight}>
        {sanitiseValue(value).map(
          (item) =>
            typeof item === "string" && (
              <Grid key={item}>
                <FormattedChip
                  label={item}
                  sx={{
                    backgroundColor: getColors(colors, item)[mode],
                  }}
                />
              </Grid>
            )
        )}
      </ChipList>
    );

  if (disabled) {
    return rendered;
  }

  return (
    <ButtonBase
      onClick={() => showPopoverCell(true)}
      style={{
        width: "100%",
        height: "100%",
        font: "inherit",
        color: "inherit !important",
        letterSpacing: "inherit",
        textAlign: "inherit",
        justifyContent: "flex-start",
      }}
      tabIndex={tabIndex}
    >
      {rendered}
      <ChevronDown className="row-hover-iconButton end" />
    </ButtonBase>
  );
}
