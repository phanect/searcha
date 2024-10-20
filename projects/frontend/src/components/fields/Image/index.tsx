import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import { Image as ImageIcon } from "@src/assets/icons";
import DisplayCell from "./DisplayCell";
import ContextMenuActions from "./ContextMenuActions";
import type { Accept } from "react-dropzone";

const EditorCell = lazy(
  () => import("./EditorCell")
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField")
);

export const config: IFieldConfig = {
  type: FieldType.image,
  name: "Image",
  group: "File",
  dataType: "RowyFile[]",
  initialValue: [],
  icon: <ImageIcon />,
  description:
    "Image file uploaded to Firebase Storage. Supports JPEG, PNG, SVG, GIF, WebP, AVIF, JPEG XL.",
  TableCell: withRenderTableCell(DisplayCell, EditorCell, "inline", {
    disablePadding: true,
  }),
  SideDrawerField,
  contextMenuActions: ContextMenuActions,
  keywords: ["picture"]
};
export default config;

export const imageMimeTypes: Accept = {
  "image/jpeg": [ ".jpg", ".jpeg" ],
  "image/png": [ ".png" ],
  "image/svg+xml": [ ".svg" ],
  "image/gif": [ ".gif" ],
  "image/webp": [ ".webp" ],
  "image/avif": [ ".avif" ],
  "image/jxl": [ ".jxl" ],
} as const;
