import { useAtom } from "jotai";
import { useContext } from "react";
import { Link } from "react-router-dom";

import { Button } from "@mui/material";
import { Go as GoIcon, Tables as TablesIcon } from "@src/assets/icons";

import AuthLayout from "@src/layouts/AuthLayout";
import Navigation from "@src/layouts/Navigation";
import { TOP_BAR_HEIGHT } from "@src/layouts/Navigation/TopBar";
import EmptyState from "@src/components/EmptyState";

import { ROUTES } from "@src/constants/routes";
import { ProjectScopeContext, currentUserAtom } from "@src/atoms/projectScope";
import { EXTERNAL_LINKS } from "@src/constants/externalLinks.ts";

export default function NotFound() {
  const projectScopeStore = useContext(ProjectScopeContext);
  const [currentUser] = useAtom(currentUserAtom, { store: projectScopeStore });

  if (currentUser)
    return (
      <Navigation>
        <EmptyState
          fullScreen
          message="Page not found"
          description={
            <Button
              variant="outlined"
              sx={{ mt: 3 }}
              component={Link}
              to={ROUTES.home}
              startIcon={<TablesIcon />}
            >
              Tables
            </Button>
          }
          style={{ marginTop: -TOP_BAR_HEIGHT }}
        />
      </Navigation>
    );

  return (
    <AuthLayout title="Page not found" hideLinks={Boolean(currentUser)}>
      <Button
        variant="outlined"
        sx={{ mt: 3 }}
        href={EXTERNAL_LINKS.homepage}
        endIcon={<GoIcon style={{ margin: "0 -0.33em" }} />}
      >
        {EXTERNAL_LINKS.homepage.split("//")[1].replace(/\//g, "")}
      </Button>
    </AuthLayout>
  );
}
