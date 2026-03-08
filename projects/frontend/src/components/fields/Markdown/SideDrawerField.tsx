import { Box, useTheme } from "@mui/material";

import { fieldSx } from "@src/components/SideDrawer/utils";
import MDEditor from "@uiw/react-md-editor";

import type { ISideDrawerFieldProps } from "@src/components/fields/types";

export default function Markdown({
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  const theme = useTheme();

  if (disabled) {
    return (
      <Box
        sx={[ fieldSx, { display: "block", maxHeight: 300, overflow: "auto" }]}
        data-color-mode={theme.palette.mode}
      >
        <MDEditor.Markdown
          source={value}
          style={{ backgroundColor: theme.palette.background.paper }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={[
        fieldSx,
        {
          display: "block",
          padding: 0,
          "& .wmde-markdown-var": { boxShadow: (fieldSx as any)?.boxShadow },
        },
      ]}
      data-color-mode={theme.palette.mode}
    >
      <MDEditor
        style={{ backgroundColor: theme.palette.background.paper }}
        height={300}
        value={value}
        onChange={onChange}
        onBlur={onSubmit}
      />
    </Box>
  );
}
