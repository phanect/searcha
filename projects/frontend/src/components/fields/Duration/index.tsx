import DurationIcon from "@mui/icons-material/TimerOutlined";
import { FieldType } from "@src/components/fields/types";
import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import { lazy } from "react";
import DisplayCell from "./DisplayCell";
import type { IFieldConfig } from "@src/components/fields/types";

const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField"
    )
);

export const config: IFieldConfig = {
  type: FieldType.duration,
  name: "Duration",
  group: "Date & Time",
  dataType: "Record<'start' | 'end', firebase.firestore.Timestamp>",
  initialValue: {},
  icon: <DurationIcon />,
  description: "Duration calculated from two timestamps.",
  TableCell: withRenderTableCell(DisplayCell, SideDrawerField, "popover", {
    popoverProps: { PaperProps: { sx: { p: 1 }}},
  }),
  SideDrawerField,
  contextMenuActions: BasicContextMenuActions,
};
export default config;
