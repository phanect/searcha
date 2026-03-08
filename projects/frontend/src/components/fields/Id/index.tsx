import { Id as IdIcon } from "@src/assets/icons";
import { FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";
import { lazy } from "react";

import DisplayCell from "./DisplayCell";
import type { IFieldConfig } from "@src/components/fields/types";

const SideDrawerField = lazy(
  () => import("./SideDrawerField")
);

export const config: IFieldConfig = {
  type: FieldType.id,
  name: "ID",
  group: "Metadata",
  dataType: "string",
  initialValue: "",
  icon: <IdIcon />,
  description: "Displays the row’s ID. Read-only. Cannot be sorted.",
  TableCell: withRenderTableCell(DisplayCell, null),
  SideDrawerField,
  keywords: ["unique"]
};
export default config;
