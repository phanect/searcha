import EmailIcon from "@mui/icons-material/MailOutlined";
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

const Settings = lazy(
  () => import("./Settings")
);

export const config: IFieldConfig = {
  type: FieldType.email,
  name: "Email",
  group: "Text",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <EmailIcon />,
  description: "Email address. Not validated.",
  contextMenuActions: BasicContextMenuActions,
  TableCell: withRenderTableCell(DisplayCell, EditorCell),
  SideDrawerField,
  settings: Settings,
  filter: {
    operators: filterOperators,
  },
};
export default config;
