import { lazy } from "react";
import { FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import CheckboxIcon from "@mui/icons-material/ToggleOnOutlined";
import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";
import DisplayCell from "./DisplayCell";
import type { IFieldConfig } from "@src/components/fields/types";

const EditorCell = lazy(
  () => import("./EditorCell")
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField"
    )
);

export const config: IFieldConfig = {
  type: FieldType.checkbox,
  name: "Toggle",
  group: "Numeric",
  dataType: "boolean",
  initialValue: false,
  initializable: true,
  icon: <CheckboxIcon />,
  description: "True/false value. Default: false.",
  TableCell: withRenderTableCell(DisplayCell, EditorCell, "inline", {
    usesRowData: true,
  }),
  csvImportParser: (value: string) => {
    if ([ "YES", "TRUE", "1" ].includes(value.toUpperCase())) {
      return true;
    } else if ([ "NO", "FALSE", "0" ].includes(value.toUpperCase())) {
      return false;
    } else {
      return null;
    }
  },
  filter: {
    operators: [
      {
        value: "==",
        label: "is",
      },
    ],
    defaultValue: false,
  },
  SideDrawerField,
  contextMenuActions: BasicContextMenuActions,
  keywords: ["boolean", "switch", "true", "false", "on", "off"]
};
export default config;
