import { lazy } from "react";
import { FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import RichTextIcon from "@mui/icons-material/TextFormat";
import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";
import DisplayCell from "./DisplayCell";
import type { IFieldConfig } from "@src/components/fields/types";

const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField"
    )
);

export const config: IFieldConfig = {
  type: FieldType.richText,
  name: "Rich Text",
  group: "Text",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <RichTextIcon />,
  description: "HTML edited with a rich text editor.",
  contextMenuActions: BasicContextMenuActions,
  TableCell: withRenderTableCell(DisplayCell, SideDrawerField, "popover"),
  SideDrawerField,
  keywords: ["string"]
};
export default config;
