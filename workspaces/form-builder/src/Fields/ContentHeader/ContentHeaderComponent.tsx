import { Box, Typography, Divider } from "@mui/material";
import type { TypographyProps } from "@mui/material";
import type { IFieldComponentProps } from "../../types";

export type IContentHeaderComponentProps = {} & IFieldComponentProps & Partial<Omit<TypographyProps, "title" | "onChange" | "onBlur" | "ref">>;

export default function ContentHeaderComponent({
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
}: IContentHeaderComponentProps) {
  return (
    <Box
      className={className}
      sx={[
        {
          mt: 3,
          mb: -1,
          width: "100%",

          whiteSpace: "pre-line",
          cursor: "default",
        },
        index === 0 && { mt: 0 },
      ]}
    >
      <Typography
        variant="subtitle1"
        {...({ component: "h3" } as any)}
        {...props}
      >
        {children ?? label}
      </Typography>

      <Divider sx={{ mt: 0.5 }} />
    </Box>
  );
}
