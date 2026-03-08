import { Button } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { forwardRef, type Ref } from "react";
import type { ButtonProps } from "@mui/material";

export type IButtonWithStatusProps = {
  active?: boolean;
} & ButtonProps;

export const ButtonWithStatus = forwardRef((
  { active = false, className, sx, ...props }: IButtonWithStatusProps,
  ref: Ref<HTMLButtonElement>
) => (
  <Button
    {...props}
    ref={ref}
    variant="outlined"
    color={active ? "primary" : "secondary"}
    sx={[
      {
        position: "relative",
        zIndex: 1,
      },
      active
        ? {
          color: (theme) =>
            theme.palette.mode === "dark"
              ? theme.palette.primary.light
              : theme.palette.primary.dark,
          backgroundColor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.selectedOpacity
            ),
          borderColor: "primary.main",

          "&:hover": {
            color: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette.primary.light
                : theme.palette.primary.dark,
            backgroundColor: (theme) =>
              alpha(
                theme.palette.mode === "dark"
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark,
                theme.palette.action.selectedOpacity
                + theme.palette.action.hoverOpacity
              ),
            borderColor: "currentColor",
          },
        }
        : {},
      ...((Array.isArray(sx) ? sx : [ sx ]) as any),
    ]}
  />
));

export default ButtonWithStatus;
