import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";

export type IFullScreenButtonProps = {
  active: boolean;
} & ButtonProps;

export default function FullScreenButton({
  active,
  ...props
}: IFullScreenButtonProps) {
  return (
    <Button
      aria-label={`${ active ? "Exit" : "Enter" } full screen`}
      variant={active ? "contained" : "outlined"}
      color={active ? "secondary" : undefined}
      {...props}
      style={{
        position: "absolute",
        bottom: 4,
        right: 16,
        zIndex: 2,
        minWidth: 32,
        padding: 0,
        ...props.style,
      }}
    >
      {active ? <FullscreenExitIcon /> : <FullscreenIcon />}
    </Button>
  );
}
