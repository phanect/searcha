import { Derivative as DerivativeIcon } from "@src/assets/icons";
import { FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import ContextMenuActions from "./ContextMenuActions";
import Settings, { settingsValidator } from "./Settings";
import type { IFieldConfig } from "@src/components/fields/types";

export const config: IFieldConfig = {
  type: FieldType.derivative,
  name: "Derivative",
  group: "Cloud Function",
  dataType: "any",
  initialValue: "",
  initializable: true,
  icon: <DerivativeIcon />,
  description:
    "Value derived from the rest of the row’s values. Displayed using any other field type. Requires Rowy Run set up.",
  TableCell: withRenderTableCell(() => null, null),
  SideDrawerField: () => null as any,
  contextMenuActions: ContextMenuActions,
  settings: Settings,
  settingsValidator,
  requireConfiguration: true,
  requireCloudFunction: true,
  requireCollectionTable: true,
};
export default config;
