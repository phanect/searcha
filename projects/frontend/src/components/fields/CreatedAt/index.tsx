import { lazy } from "react";
import { FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import { CreatedAt as CreatedAtIcon } from "@src/assets/icons";
import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";
import DisplayCell from "./DisplayCell";
import type { IFieldConfig } from "@src/components/fields/types";

const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField"
    )
);
const Settings = lazy(
  () =>
    import("../CreatedBy/Settings")
);

export const config: IFieldConfig = {
  type: FieldType.createdAt,
  name: "Created At",
  group: "Auditing",
  dataType: "firebase.firestore.Timestamp",
  initialValue: null,
  icon: <CreatedAtIcon />,
  description: "Displays the timestamp of when the row was created. Read-only.",
  TableCell: withRenderTableCell(DisplayCell, null),
  SideDrawerField,
  settings: Settings,
  requireCollectionTable: true,
  contextMenuActions: BasicContextMenuActions,
  keywords: ["date", "time"]
};
export default config;
