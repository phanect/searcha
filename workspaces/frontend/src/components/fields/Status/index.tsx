import { lazy } from "react";
import { FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import { Status as StatusIcon } from "@src/assets/icons";
import { StatusDisplayCell } from "./DisplayCell";
import EditorCell from "./EditorCell";
import { filterOperators } from "./Filter";
import type { IFieldConfig } from "@src/components/fields/types";

const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField")
);
const Settings = lazy(
  () => import("./Settings")
);

export const config: IFieldConfig = {
  type: FieldType.status,
  name: "Status",
  group: "Cloud Function",
  dataType: "any",
  initialValue: undefined,
  initializable: true,
  icon: <StatusIcon />,
  description: "Displays field value as custom status text.",
  TableCell: withRenderTableCell(StatusDisplayCell, EditorCell, "popover", {
    disablePadding: true,
    transparentPopover: true,
  }),
  settings: Settings,
  SideDrawerField,
  requireConfiguration: true,
  filter: {
    operators: filterOperators,
  },
};
export default config;
