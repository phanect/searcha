import { Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material";
import type { IFieldComponentProps } from "../../types";

export type IContentSubHeaderComponentProps = {} & IFieldComponentProps & Partial<Omit<TypographyProps, "title" | "onChange" | "onBlur" | "ref">>;

export default function ContentSubHeaderComponent({
  field,
  fieldState,
  formState,

  index,
  label,
  children,
  className,

  disabled,
  errorMessage,
  name,
  useFormMethods,
  ...props
}: IContentSubHeaderComponentProps) {
  return (
    <Typography
      variant="subtitle2"
      className={className}
      {...({ component: "h4" } as any)}
      {...props}
      sx={[
        { mt: 2, mb: -1.5, whiteSpace: "pre-line", cursor: "default" },
        index === 0 && { mt: 0 },
        ...(Array.isArray(props.sx) ? props.sx : props.sx ? [ props.sx ] : []),
      ]}
    >
      {children ?? label}
    </Typography>
  );
}
