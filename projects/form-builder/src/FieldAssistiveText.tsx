import { FormHelperText } from "@mui/material";
import DOMPurify from "dompurify";

import type { FormHelperTextProps } from "@mui/material";

export type IFieldAssistiveTextProps = {
  disabled: boolean;
} & Omit<FormHelperTextProps, "error" | "disabled">;

export default function FieldAssistiveText({
  children,
  ...props
}: IFieldAssistiveTextProps) {
  if (!children) {
    return null;
  }

  const sanitizedChildren
    = typeof children === "string" ? DOMPurify.sanitize(children) : null;

  if (sanitizedChildren) {
    return (
      <FormHelperText
        {...props}
        style={{ whiteSpace: "pre-line", ...props.style }}
        error={false}
        dangerouslySetInnerHTML={{ __html: sanitizedChildren }}
      />
    );
  }

  return (
    <FormHelperText
      {...props}
      style={{ whiteSpace: "pre-line", ...props.style }}
      error={false}
      children={children}
    />
  );
}
