import { useTheme } from "@mui/material";
import { isArray } from "lodash-es";
import { detectType, SupportedTypes } from "./SideDrawerField/SupportedTypes";
import type { IDisplayCellProps } from "@src/components/fields/types";

export default function Array({ value }: IDisplayCellProps) {
  const theme = useTheme();

  if (!value) {
    return null;
  }
  if (isArray(value)) {
    value = value.map((item: any) => {
      const itemType = detectType(item);
      const converter = SupportedTypes[itemType].humanize;
      if (!converter) {
        return item;
      }
      return converter(item);
    });
  }

  return (
    <div
      style={{
        width: "100%",
        maxHeight: "100%",
        whiteSpace: "pre-wrap",
        lineHeight: theme.typography.body2.lineHeight,
        fontFamily: theme.typography.fontFamilyMono,
      }}
    >
      {JSON.stringify(value, null, 4)}
    </div>
  );
}
