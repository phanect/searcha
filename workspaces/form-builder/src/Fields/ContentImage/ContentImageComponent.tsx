import type { IFieldComponentProps } from "../../types";
import type { ImgHTMLAttributes } from "react";

export type IContentImageComponentProps = {
  src: string | { downloadURL: string; }[];
} & IFieldComponentProps & Omit<ImgHTMLAttributes<HTMLImageElement>, "src">;

export default function ContentImageComponent({
  field,
  fieldState,
  formState,

  index,
  label,
  children,

  disabled,
  errorMessage,
  name,
  useFormMethods,

  src,
  alt,
  ...props
}: IContentImageComponentProps) {
  if (!src || (Array.isArray(src) && (src.length === 0 || !src[0].downloadURL))) {
    return null;
  }

  return (
    <img
      {...props}
      src={typeof src === "string" ? src : src?.[0]?.downloadURL}
      alt={alt}
      style={{
        maxWidth: "100%",
        height: "auto",
        ...props.style,
      }}
    />
  );
}
