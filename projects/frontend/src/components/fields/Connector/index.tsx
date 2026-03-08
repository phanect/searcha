import ConnectorIcon from "@mui/icons-material/Cable";
import { FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";
import { lazy } from "react";

import DisplayCell from "./DisplayCell";
import type { IFieldConfig } from "@src/components/fields/types";

const EditorCell = lazy(
  () =>
    import("./EditorCell")
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
  type: FieldType.connector,
  name: "Connector",
  group: "Connection",
  dataType: "any",
  initialValue: "",
  initializable: true,
  icon: <ConnectorIcon />,
  description:
    "Connects to any table or API to fetch a list of results based on a text query or row data.",
  TableCell: withRenderTableCell(DisplayCell, EditorCell, "popover", {
    disablePadding: true,
  }),
  SideDrawerField,
  requireConfiguration: true,
  requireCloudFunction: true,
  settings: Settings,
};
export default config;
