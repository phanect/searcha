import { Outlet } from "react-router-dom";
import { Container, Typography } from "@mui/material";

export default function Nav() {
  return (
    <Container>
      <Typography variant="h1">Nav</Typography>
      <Outlet />
    </Container>
  );
}
