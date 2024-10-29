import { lazy } from "react";
import { FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import FileIcon from "@mui/icons-material/AttachFile";
import DisplayCell from "./DisplayCell";
import ContextMenuActions from "./ContextMenuActions";
import type { IFieldConfig } from "@src/components/fields/types";

const EditorCell = lazy(
  () => import("./EditorCell")
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField")
);

export const config: IFieldConfig = {
  type: FieldType.file,
  name: "File",
  group: "File",
  dataType:
    "{ downloadURL: string; lastModifiedTS: number; name: string; type: string; ref: string; }[]",
  initialValue: [],
  icon: <FileIcon />,
  description: "File uploaded to Firebase Storage. Supports any file type.",
  TableCell: withRenderTableCell(DisplayCell, EditorCell, "inline", {
    disablePadding: true,
  }),
  SideDrawerField,
  contextMenuActions: ContextMenuActions,
};
export default config;

export { FileIcon };
