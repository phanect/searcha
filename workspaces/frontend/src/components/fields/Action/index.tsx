import { lazy } from "react";
import { FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import ActionIcon from "@mui/icons-material/TouchAppOutlined";
import DisplayCell from "./DisplayCell";
import type { IFieldConfig } from "@src/components/fields/types";

const EditorCell = lazy(
  () => import("./EditorCell")
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField")
);
const Settings = lazy(
  () => import("./Settings")
);
export const config: IFieldConfig = {
  type: FieldType.action,
  name: "Action",
  group: "Cloud Function",
  dataType: "any",
  initialValue: {},
  icon: <ActionIcon />,
  description:
    "Button with pre-defined action script or triggers a Cloud Function. Optionally supports Undo and Redo.",
  TableCell: withRenderTableCell(DisplayCell, EditorCell, "inline", {
    disablePadding: true,
  }),
  SideDrawerField,
  settings: Settings,
  requireConfiguration: true,
  requireCloudFunction: true,
  requireCollectionTable: true,
  sortKey: "status",
};
export default config;
