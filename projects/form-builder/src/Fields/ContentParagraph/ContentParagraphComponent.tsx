import { Typography } from "@mui/material";
import DOMPurify from "dompurify";

import type { TypographyProps } from "@mui/material";
import type { IFieldComponentProps } from "../../types";

const rootStyles = { mb: -1.5, whiteSpace: "pre-line", cursor: "default" };

export type IContentParagraphComponentProps = {} & IFieldComponentProps & Partial<Omit<TypographyProps, "title" | "onChange" | "onBlur" | "ref">>;

export default function ContentParagraphComponent({
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
}: IContentParagraphComponentProps) {
  if (children) {
    return (
      <Typography
        className={className}
        {...({ component: "div" } as any)}
        {...props}
        sx={[
          rootStyles,
          ...(Array.isArray(props.sx) ? props.sx : props.sx ? [ props.sx ] : []),
        ]}
      >
        {children}
      </Typography>
    );
  }

  const renderedLabel
    = typeof label === "string" ? DOMPurify.sanitize(label) : null;

  if (renderedLabel) {
    return (
      <Typography
        className={className}
        {...({ component: "div" } as any)}
        {...props}
        sx={[
          rootStyles,
          ...(Array.isArray(props.sx) ? props.sx : props.sx ? [ props.sx ] : []),
        ]}
        dangerouslySetInnerHTML={{ __html: renderedLabel }}
      />
    );
  }

  return (
    <Typography
      className={className}
      {...({ component: "div" } as any)}
      {...props}
      sx={[
        rootStyles,
        ...(Array.isArray(props.sx) ? props.sx : props.sx ? [ props.sx ] : []),
      ]}
    >
      {label}
    </Typography>
  );
}
