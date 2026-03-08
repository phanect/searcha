import LongTextIcon from "@mui/icons-material/Notes";
import { FieldType } from "@src/components/fields/types";
import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import { lazy } from "react";
import DisplayCell from "./DisplayCell";
import EditorCell from "./EditorCell";

import { filterOperators } from "./Filter";
import type { IFieldConfig } from "@src/components/fields/types";

const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField"
    )
);
const Settings = lazy(
  () => import("./Settings")
);

export const config: IFieldConfig = {
  type: FieldType.longText,
  name: "Long Text",
  group: "Text",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <LongTextIcon />,
  description: "Text displayed on multiple lines.",
  contextMenuActions: BasicContextMenuActions,
  TableCell: withRenderTableCell(DisplayCell, EditorCell),
  SideDrawerField,
  settings: Settings,
  filter: {
    operators: filterOperators,
  },
  keywords: ["string"]
};
export default config;
