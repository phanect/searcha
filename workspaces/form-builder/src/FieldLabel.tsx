import { InputLabel } from "@mui/material";
import type { InputLabelProps } from "@mui/material";

export type IFieldLabelProps = {
  error: boolean;
  disabled: boolean;
  required: boolean;
} & Omit<InputLabelProps, "error" | "disabled">;

export default function FieldLabel(props: IFieldLabelProps) {
  return (
    <InputLabel
      {...props}
      sx={{
        display: "block",
        mb: 2 / 8,
        whiteSpace: "pre-line",
        position: "relative",
        transform: "none",
        ...props.sx,
      }}
    />
  );
}
