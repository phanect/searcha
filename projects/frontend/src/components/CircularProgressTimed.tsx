import { Box } from "@mui/material";
import CircularProgressOptical from "@src/components/CircularProgressOptical";
import { useEffect, useState } from "react";

import type {
  ICircularProgressOpticalProps,
} from "@src/components/CircularProgressOptical";

export type ICircularProgressTimedProps = {
  /** Duration in seconds */
  duration: number;
  complete: boolean;
} & ICircularProgressOpticalProps;

export default function CircularProgressTimed({
  duration,
  complete,
  size = 64,
  ...props
}: ICircularProgressTimedProps) {
  const [ count, setCount ] = useState(0);

  useEffect(() => {
    if (complete) {
      setCount(0);
      return undefined;
    }

    const interval = setInterval(() => {
      setCount((c) => {
        if (c >= duration) {
          clearInterval(interval);
          return c;
        }
        return c + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [ duration, complete ]);

  const DEFAULT_SIZE = 24;
  const DEFAULT_THICKNESS = 2.6;
  const linearThickness = (DEFAULT_SIZE / size) * DEFAULT_THICKNESS;
  const opticalRatio = 1 - (1 - size / DEFAULT_SIZE) / 2;

  return (
    <Box
      sx={{ position: "relative", width: size, height: size, ...props.sx }}
      style={props.style}
    >
      <CircularProgressOptical
        {...props}
        size={size}
        variant="determinate"
        value={complete ? 100 : Math.min(90, (count / duration) * 90)}
        style={{ position: "absolute", top: 0, left: 0 }}
        sx={{
          transition: (theme) =>
            theme.transitions.create([ "color" ], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.standard,
            }),
        }}
        color={complete ? "success" : "primary"}
      />
      {complete ? (
        <Box
          component="svg"
          viewBox="0 -0.5 18 18"
          sx={{
            position: "absolute",
            inset: size * 0.33 * 0.5,
            width: size * 0.67,
            height: size * 0.67,

            "& .tick": {
              stroke: (theme) => theme.palette.success.main,
              strokeDasharray: 18,

              animationName: "draw-tick",
              animationTimingFunction: (theme) =>
                theme.transitions.easing.easeOut,
              animationDuration: (theme) =>
                theme.transitions.duration.standard + "ms",
              animationDelay: (theme) =>
                theme.transitions.duration.standard + "ms",
              animationFillMode: "both",

              "@keyframes draw-tick": {
                from: { strokeDashoffset: 18 },
                to: { strokeDashoffset: 0 },
              },
            },
          }}
        >
          <polyline
            strokeWidth={linearThickness * opticalRatio}
            strokeLinecap="round"
            strokeLinejoin="round"
            points="2.705 8.29 7 12.585 15.295 4.29"
            fill="none"
            className="tick"
          />
        </Box>
      ) : (
        <CircularProgressOptical
          {...props}
          size={size}
          style={{ position: "absolute", top: 0, left: 0 }}
          sx={{ color: "primary.contrastText", opacity: 0.33 }}
          disableShrink
        />
      )}
    </Box>
  );
}
