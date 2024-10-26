import { useRef } from "react";
import {
  Divider,
  DividerProps,
  DialogContent,
  DialogContentProps,
} from "@mui/material";
import { spreadSx } from "@src/utils/ui";

export interface IScrollableDialogContentProps extends DialogContentProps {
  disableTopDivider?: boolean;
  disableBottomDivider?: boolean;
  dividerSx?: DividerProps["sx"];
  topDividerSx?: DividerProps["sx"];
  bottomDividerSx?: DividerProps["sx"];
}

export default function ScrollableDialogContent({
  disableTopDivider = false,
  disableBottomDivider = false,
  dividerSx = [],
  topDividerSx = [],
  bottomDividerSx = [],
  ...props
}: IScrollableDialogContentProps) {
  const ref = useRef<HTMLElement>(null);

  return (
    <>
      {!disableTopDivider && ref.current?.scrollTop !== undefined && (
        <Divider
          style={{
            visibility: ref.current.scrollTop > 0 ? "visible" : "hidden",
          }}
          sx={[...spreadSx(dividerSx), ...spreadSx(topDividerSx)]}
        />
      )}

      <DialogContent {...props} ref={ ref } />

      {!disableBottomDivider && ref.current?.scrollTop !== undefined && (
        <Divider
          style={{
            visibility: (ref.current.scrollTop < ref.current.scrollHeight - ref.current.clientHeight)
              ? "visible"
              : "hidden",
          }}
          sx={[...spreadSx(dividerSx), ...spreadSx(bottomDividerSx)]}
        />
      )}
    </>
  );
}
