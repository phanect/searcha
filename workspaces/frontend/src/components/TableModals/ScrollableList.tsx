import { memo, useRef } from "react";
import { styled, Divider, DividerProps } from "@mui/material";
import { spreadSx } from "@src/utils/ui";

const MemoizedList = memo(
  styled("ul")(({ theme }) => ({
    listStyleType: "none",
    margin: 0,
    padding: theme.spacing(1.5, 0, 3),

    height: 400,
    overflowY: "auto",

    "& li": { margin: theme.spacing(0.5, 0) },
  }))
);

export interface IFadeListProps {
  children?: React.ReactNode;
  disableTopDivider?: boolean;
  disableBottomDivider?: boolean;
  dividerSx?: DividerProps["sx"];
  topDividerSx?: DividerProps["sx"];
  bottomDividerSx?: DividerProps["sx"];
  listSx?: DividerProps["sx"];
}

export default function FadeList({
  children,
  disableTopDivider = true,
  disableBottomDivider = false,
  dividerSx = [],
  topDividerSx = [],
  bottomDividerSx = [],
  listSx,
}: IFadeListProps) {
  const ref = useRef<HTMLUListElement>(null);

  return (
    <>
      {!disableTopDivider &&
        (ref.current?.scrollTop ?? 0) > 0 && (
          <Divider sx={[...spreadSx(dividerSx), ...spreadSx(topDividerSx)]} />
        )}

      <MemoizedList ref={ ref } sx={listSx}>
        {children}
      </MemoizedList>

      {!disableBottomDivider &&
        ref.current &&
        (ref.current.scrollTop < ref.current.scrollHeight - ref.current.clientHeight) && (
          <Divider
            sx={[...spreadSx(dividerSx), ...spreadSx(bottomDividerSx)]}
          />
        )}
    </>
  );
}
