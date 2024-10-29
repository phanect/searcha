import { lazy } from "react";
import { FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import { ConnectTable as ConnectTableIcon } from "@src/assets/icons";
import DisplayCell from "./DisplayCell";
import type { IFieldConfig } from "@src/components/fields/types";

const EditorCell = lazy(
  () => import("./EditorCell")
);
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
  type: FieldType.connectTable,
  name: "Connect Table (Alpha)",
  group: "Connection",
  dataType:
    "{ docPath: string; snapshot: Record<string, any>; }[] | { docPath: string; snapshot: Record<string, any>; } | null",
  initialValue: [],
  icon: <ConnectTableIcon />,
  description:
    "Connects to an existing table to fetch a snapshot of values from a row. Requires Rowy Run and Algolia setup.",
  TableCell: withRenderTableCell(DisplayCell, EditorCell, "popover", {
    disablePadding: true,
    transparentPopover: true,
  }),
  SideDrawerField,
  settings: Settings,
  requireConfiguration: true,
};
export default config;
