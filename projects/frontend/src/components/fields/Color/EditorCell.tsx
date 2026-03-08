import { ColorPicker, ColorService } from "react-color-palette";
import type { IEditorCellProps } from "@src/components/fields/types";
import "react-color-palette/css";

import { Box } from "@mui/material";

export default function Color({ value, onChange }: IEditorCellProps) {
  return (
    <Box sx={{ "& .rcp": { border: 0 }}}>
      <ColorPicker
        height={180}
        color={ColorService.convert("hex", value?.hex ?? "#fff")}
        onChange={onChange}
        hideAlpha={false}
      />
    </Box>
  );
}
