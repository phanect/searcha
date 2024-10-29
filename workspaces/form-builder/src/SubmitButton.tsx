import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import type { ReactNode } from "react";

export type ISubmitButtonProps = {
  label?: ReactNode;
} & ButtonProps;

export default function SubmitButton({ label, ...props }: ISubmitButtonProps) {
  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      {...props}
      sx={[
        { display: "flex", mt: 3, mx: "auto", mb: 0, minWidth: 120 },
        ...(Array.isArray(props.sx) ? props.sx : props.sx ? [ props.sx ] : []),
      ]}
    >
      {label || "Submit"}
    </Button>
  );
}
