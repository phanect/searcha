import { UpdatedBy as UpdatedByIcon } from "@src/assets/icons";
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
  type: FieldType.updatedBy,
  name: "Updated By",
  group: "Auditing",
  dataType:
    "{ displayName: string; email: string; emailVerified: boolean; isAnonymous: boolean; photoURL: string; uid: string; timestamp: firebase.firestore.Timestamp; updatedField?: string; }",
  initialValue: null,
  icon: <UpdatedByIcon />,
  description:
    "Displays the user that last updated the row, timestamp, and updated field key. Read-only.",
  TableCell: withRenderTableCell(DisplayCell, null),
  SideDrawerField,
  settings: Settings,
  requireCollectionTable: true,
  contextMenuActions: BasicContextMenuActions,
  keywords: ["date", "time"]
};
export default config;
