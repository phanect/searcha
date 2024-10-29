import { lazy } from "react";
import { FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import { Reference } from "@src/assets/icons";
import { filterOperators } from "@src/components/fields/ShortText/Filter";
import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";
import DisplayCell from "./DisplayCell";
import EditorCell from "./EditorCell";
import { valueFormatter } from "./filters";
import type { IFieldConfig } from "@src/components/fields/types";

const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField"
    )
);

export const config: IFieldConfig = {
  type: FieldType.reference,
  name: "Reference",
  group: "Connection",
  dataType: "reference",
  initialValue: null,
  initializable: true,
  icon: <Reference />,
  description: "Firestore document reference",
  contextMenuActions: BasicContextMenuActions,
  TableCell: withRenderTableCell(DisplayCell, EditorCell, "focus", {
    disablePadding: true,
  }),
  SideDrawerField,
  filter: { operators: filterOperators, valueFormatter: valueFormatter },
  csvExportFormatter: (value: any) => value?.path,
};
export default config;
