import UrlIcon from "@mui/icons-material/Link";
import { filterOperators } from "@src/components/fields/ShortText/Filter";
import { FieldType } from "@src/components/fields/types";
import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";
import { lazy } from "react";
import DisplayCell from "./DisplayCell";
import EditorCell from "./EditorCell";
import type { IFieldConfig } from "@src/components/fields/types";

const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField")
);

export const config: IFieldConfig = {
  type: FieldType.url,
  name: "URL",
  group: "Text",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <UrlIcon />,
  description: "Web address. Not validated.",
  contextMenuActions: BasicContextMenuActions,
  TableCell: withRenderTableCell(DisplayCell, EditorCell, "focus", {
    disablePadding: true,
  }),
  SideDrawerField,
  filter: {
    operators: filterOperators,
  },
  keywords: ["link", "path"]
};
export default config;
