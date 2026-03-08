import { Avatar, Button, Grid2 as Grid, Typography } from "@mui/material";

import { ROUTES } from "@src/constants/routes";
import { Link } from "react-router-dom";
import type { IUserSettingsChildProps } from "@src/pages/Settings/UserSettingsPage";

export default function Account({ settings }: IUserSettingsChildProps) {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid>
        <Avatar src={settings.user?.photoURL} />
      </Grid>

      <Grid>
        <Typography variant="body1" style={{ userSelect: "all" }}>
          {settings.user?.displayName}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ userSelect: "all" }}
        >
          {settings.user?.email}
        </Typography>
      </Grid>

      <Grid>
        <Button component={Link} to={ROUTES.signOut}>
          Sign out
        </Button>
      </Grid>
    </Grid>
  );
}
