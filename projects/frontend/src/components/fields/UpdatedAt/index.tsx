import { UpdatedAt as UpdatedAtIcon } from "@src/assets/icons";
import { FieldType } from "@src/components/fields/types";
import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";
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
  () =>
    import("../CreatedBy/Settings")
);

export const config: IFieldConfig = {
  type: FieldType.updatedAt,
  name: "Updated At",
  group: "Auditing",
  dataType: "firebase.firestore.Timestamp",
  initialValue: null,
  icon: <UpdatedAtIcon />,
  description:
    "Displays the timestamp of the last update to the row. Read-only.",
  TableCell: withRenderTableCell(DisplayCell, null),
  SideDrawerField,
  settings: Settings,
  requireCollectionTable: true,
  contextMenuActions: BasicContextMenuActions,
  keywords: ["date", "time"]
};
export default config;
