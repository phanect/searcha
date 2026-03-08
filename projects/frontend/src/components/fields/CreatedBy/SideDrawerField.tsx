import { Avatar, Box, Stack, Typography } from "@mui/material";
import { fieldSx } from "@src/components/SideDrawer/utils";

import { DATE_TIME_FORMAT } from "@src/constants/dates";
import { format } from "date-fns";
import type { ISideDrawerFieldProps } from "@src/components/fields/types";

export default function CreatedBy({ column, value }: ISideDrawerFieldProps) {
  if (!value?.displayName || !value.timestamp) {
    return <Box sx={fieldSx} />;
  }

  const dateLabel = format(
    value.timestamp.toDate ? value.timestamp.toDate() : value.timestamp,
    column.config?.format || DATE_TIME_FORMAT
  );

  return (
    <Stack direction="row" sx={[ fieldSx, { alignItems: "flex-start" }]}>
      <Avatar
        alt="Avatar"
        src={value.photoURL}
        sx={{
          width: 32,
          height: 32,
          ml: -0.5,
          mr: 1.5,
          my: 0.5,
          fontSize: "inherit",
        }}
      >
        {value.displayName[0]}
      </Avatar>

      <Typography
        variant="body2"
        component="div"
        style={{ whiteSpace: "normal" }}
      >
        {value.displayName} ({value.email})
        <Typography variant="caption" color="textSecondary" component="div">
          Created at {dateLabel}
        </Typography>
      </Typography>
    </Stack>
  );
}
