import { lazy } from "react";
import { FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";
import { ColorService } from "react-color-palette";

import ColorIcon from "@mui/icons-material/Colorize";
import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";
import DisplayCell from "./DisplayCell";
import type { IFieldConfig } from "@src/components/fields/types";

const EditorCell = lazy(
  () => import("./EditorCell")
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField")
);

export const config: IFieldConfig = {
  type: FieldType.color,
  name: "Color",
  group: "Numeric",
  dataType: "Record<string, any>",
  initialValue: {},
  initializable: true,
  icon: <ColorIcon />,
  description:
    "Color stored as Hex, RGB, and HSV. Edited with a visual picker.",
  TableCell: withRenderTableCell(DisplayCell, EditorCell, "popover", {
    disablePadding: true,
  }),
  SideDrawerField,
  csvImportParser: (value: string) => {
    try {
      const obj: unknown = JSON.parse(value);
      if (obj && typeof obj === "object" && "hex" in obj && typeof obj.hex === "string") {
        return ColorService.convert("hex", obj.hex);
      }
      throw new Error();
    } catch (error) {
      console.error("Invalid color value");
      return null;
    }
  },
  contextMenuActions: BasicContextMenuActions,
};
export default config;
