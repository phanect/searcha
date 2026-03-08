import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import DisplayCell from "@src/components/fields/ShortText/DisplayCell";
import { filterOperators } from "@src/components/fields/ShortText/Filter";
import { FieldType } from "@src/components/fields/types";
import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";
import { lazy } from "react";
import EditorCell from "./EditorCell";
import type { IFieldConfig } from "@src/components/fields/types";

const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField")
);

export const config: IFieldConfig = {
  type: FieldType.phone,
  name: "Phone",
  group: "Text",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <PhoneIcon />,
  description: "Phone number stored as text. Not validated.",
  contextMenuActions: BasicContextMenuActions,
  TableCell: withRenderTableCell(DisplayCell, EditorCell),
  SideDrawerField,
  filter: {
    operators: filterOperators,
  },
  keywords: ["number", "contact"]
};
export default config;
