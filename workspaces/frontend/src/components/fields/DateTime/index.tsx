import { lazy } from "react";
import { FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";
import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "@src/constants/dates";

import DateTimeIcon from "@mui/icons-material/AccessTime";
import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";
import DisplayCell from "./DisplayCell";
import { filterOperators, valueFormatter } from "./filters";
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
const FilterCustomInput = lazy(
  () =>
    import(
      "./FilterCustomInput"
    )
);

export const config: IFieldConfig = {
  type: FieldType.dateTime,
  name: "Date & Time",
  group: "Date & Time",
  dataType: "firebase.firestore.Timestamp",
  initialValue: null,
  initializable: true,
  icon: <DateTimeIcon />,
  description: `Formatted date & time. Format is configurable, default: ${ DATE_TIME_FORMAT }. Edited with a visual picker.`,
  TableCell: withRenderTableCell(DisplayCell, EditorCell, "focus", {
    disablePadding: true,
  }),
  SideDrawerField,
  filter: {
    operators: filterOperators,
    valueFormatter,
    customInput: FilterCustomInput,
  },
  settings: Settings,
  csvImportParser: (value) => new Date(value),
  csvExportFormatter: (value: any) => {
    if (typeof value === "number") {
      return format(new Date(value), DATE_TIME_FORMAT);
    } else {
      return format(value.toDate(), DATE_TIME_FORMAT);
    }
  },
  contextMenuActions: BasicContextMenuActions,
};
export default config;

export { DateTimeIcon };
