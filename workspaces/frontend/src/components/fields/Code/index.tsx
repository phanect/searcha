import { lazy } from "react";
import { FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import CodeIcon from "@mui/icons-material/Code";
import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";
import DisplayCell from "./DisplayCell";
import type { IFieldConfig } from "@src/components/fields/types";

const Settings = lazy(
  () => import("./Settings")
);

const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField")
);

export const config: IFieldConfig = {
  type: FieldType.code,
  name: "Code",
  group: "Code",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <CodeIcon />,
  description: "Raw code edited with the Monaco Editor.",
  TableCell: withRenderTableCell(DisplayCell, SideDrawerField, "popover", {
    popoverProps: {
      anchorOrigin: { vertical: "top", horizontal: "center" },
      PaperProps: { sx: { borderRadius: 1 }},
    },
  }),
  SideDrawerField,
  settings: Settings,
  contextMenuActions: BasicContextMenuActions,
};
export default config;
