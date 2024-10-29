import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { SvgIconProps } from "@mui/material/SvgIcon";

/**
 * Right chevron icon with optical alignment
 * @param props
 */
export function Go(props: SvgIconProps) {
  return <ChevronRightIcon style={{ marginLeft: "-0.33em" }} {...props} />;
}
