import { lazy } from "react";
import { FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import { Number as NumberIcon } from "@src/assets/icons";
import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";
import DisplayCell from "./DisplayCell";
import EditorCell from "./EditorCell";
import { filterOperators } from "./Filter";
import type { IFieldConfig } from "@src/components/fields/types";
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField")
);

export const config: IFieldConfig = {
  type: FieldType.number,
  name: "Number",
  group: "Numeric",
  dataType: "number",
  initialValue: 0,
  initializable: true,
  icon: <NumberIcon />,
  description: "Numeric value.",
  contextMenuActions: BasicContextMenuActions,
  TableCell: withRenderTableCell(DisplayCell, EditorCell),
  SideDrawerField,
  filter: {
    operators: filterOperators,
  },
  csvImportParser: (v) => {
    try {
      const parsedValue = parseFloat(v);
      return Number.isNaN(parsedValue) ? null : parsedValue;
    } catch (e) {
      return null;
    }
  },
  keywords: ["digit"]
};
export default config;
