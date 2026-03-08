import { Container, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function Nav() {
  return (
    <Container>
      <Typography variant="h1">Nav</Typography>
      <Outlet />
    </Container>
  );
}
