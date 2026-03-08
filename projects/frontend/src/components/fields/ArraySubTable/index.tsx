import { ArraySubTable as ArraySubTableIcon } from "@src/assets/icons/ArraySubTable";
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
  type: FieldType.arraySubTable,
  name: "Array SubTable (Alpha)",
  group: "Connection",
  dataType: "undefined",
  initialValue: null,
  icon: <ArraySubTableIcon />,
  settings: Settings,
  description: "A sub-table representing an array of objects in the row",
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
