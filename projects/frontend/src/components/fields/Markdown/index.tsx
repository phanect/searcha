import { Markdown as MarkdownIcon } from "@src/assets/icons";
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
  type: FieldType.markdown,
  name: "Markdown",
  group: "Code",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <MarkdownIcon />,
  description: "Markdown editor with preview",
  TableCell: withRenderTableCell(DisplayCell, SideDrawerField, "popover"),
  SideDrawerField,
  contextMenuActions: BasicContextMenuActions,
  keywords: ["md"]
};
export default config;
