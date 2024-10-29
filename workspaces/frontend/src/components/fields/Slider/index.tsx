import { lazy } from "react";
import { FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import { Slider as SliderIcon } from "@src/assets/icons";
import { filterOperators } from "@src/components/fields/Number/Filter";
import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";
import DisplayCell from "./DisplayCell";
import type { IFieldConfig } from "@src/components/fields/types";

const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField")
);
const Settings = lazy(
  () => import("./Settings")
);

export const config: IFieldConfig = {
  type: FieldType.slider,
  name: "Slider",
  group: "Numeric",
  dataType: "number",
  initialValue: 0,
  initializable: true,
  icon: <SliderIcon />,
  requireConfiguration: true,
  description: "Numeric value edited with a Slider. Range is configurable.",
  TableCell: withRenderTableCell(DisplayCell, SideDrawerField, "popover", {
    popoverProps: { PaperProps: { sx: { p: 1, pt: 5 }}},
  }),
  settings: Settings,
  filter: {
    operators: filterOperators,
  },
  SideDrawerField,
  csvImportParser: (value: string) => {
    try {
      const parsed = parseInt(value);
      if (Number.isNaN(parsed)) {
        throw new Error("Invalid slider value!");
      }
      return parsed;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  contextMenuActions: BasicContextMenuActions,
};
export default config;
