import { SubTable as SubTableIcon } from "@src/assets/icons";
import { FieldType } from "@src/components/fields/types";
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
const Settings = lazy(
  () => import("./Settings")
);
export const config: IFieldConfig = {
  type: FieldType.subTable,
  name: "Sub-Table",
  group: "Connection",
  dataType: "undefined",
  initialValue: null,
  icon: <SubTableIcon />,
  settings: Settings,
  description:
    "Connects to a sub-table in the current row. Also displays number of rows inside the sub-table. Max sub-table depth: 100.",
  TableCell: withRenderTableCell(DisplayCell, null, "focus", {
    usesRowData: true,
    disablePadding: true,
  }),
  SideDrawerField,
  initializable: false,
  requireConfiguration: true,
  requireCollectionTable: true,
};
export default config;
