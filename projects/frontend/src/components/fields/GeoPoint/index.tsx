import GeoPointIcon from "@mui/icons-material/PinDropOutlined";
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

export const config: IFieldConfig = {
  type: FieldType.geoPoint,
  name: "GeoPoint",
  group: "Numeric",
  dataType: "{latitude:number; longitude:number}",
  initialValue: {},
  icon: <GeoPointIcon />,
  description: "Geo point is represented as latitude/longitude pair.",
  TableCell: withRenderTableCell(DisplayCell, SideDrawerField, "popover", {
    popoverProps: { PaperProps: { sx: { p: 1, pt: 0 }}},
  }),
  SideDrawerField,
  contextMenuActions: BasicContextMenuActions,
  keywords: ["location", "latitude", "longitude", "point"]
};
export default config;
