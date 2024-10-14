import { useState } from "react";
import { Box, useTheme } from "@mui/material";

import { IColor, ColorPicker } from "react-color-palette";

export interface IColorPickerProps {
  value: IColor;
  disabled?: boolean;
  onChangeComplete: (color: IColor) => void;
}

export default function ColorPickerInput({
  value,
  disabled,
  onChangeComplete,
}: IColorPickerProps) {
  const [localValue, setLocalValue] = useState(value);
  const theme = useTheme();

  return (
    <Box
      sx={[
        {
          padding: theme.spacing(1.5),
          paddingTop: theme.spacing(1),
          transitionDuration: 0,
          "& .rcp": {
            border: "none",
            "& .rcp-saturation": {
              borderRadius: theme.spacing(0.5),
            },
            "& .rcp-body": {
              boxSizing: "unset",
            },
          },
          ".rcp-dark": {
            "--rcp-background": "transparent",
          },
        },
      ]}
    >
      <ColorPicker
        height={150}
        color={localValue}
        disabled={ disabled }
        onChange={(color) => setLocalValue(color)}
        onChangeComplete={onChangeComplete}
      />
    </Box>
  );
}
