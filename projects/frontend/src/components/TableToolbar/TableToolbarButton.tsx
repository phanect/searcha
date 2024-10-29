import { forwardRef } from "react";
import { Tooltip, Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";

export type ITableToolbarButtonProps = {
  title: string;
  icon: React.ReactNode;
  tooltip?: string;
} & Partial<ButtonProps>;

export const TableToolbarButton = forwardRef((
  { title, icon, tooltip, ...props }: ITableToolbarButtonProps,
  ref: React.Ref<HTMLButtonElement>
) => {
  // https://mui.com/material-ui/react-tooltip/#accessibility
  const tooltipIsDescription = Boolean(tooltip);

  const button = (
    <Button
      variant="outlined"
      color="secondary"
      size="small"
      style={{ minWidth: 40, height: 32, padding: 0 }}
      {...props}
      {...(tooltipIsDescription
        ? {
          "aria-label": title, // Actual button label
          title: tooltip, // Tooltip text, used to describe button e.g. why it’s disabled
        }
        : {})}
      ref={ref}
    >
      {icon}
    </Button>
  );

  return (
    <Tooltip title={tooltip || title} describeChild={tooltipIsDescription}>
      {props.disabled ? <span title="">{button}</span> : button}
    </Tooltip>
  );
});

export default TableToolbarButton;
