import { useContext } from "react";
import { useAtom } from "jotai";
import { Link } from "react-router-dom";

import { Typography, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/LockOutlined";
import HomeIcon from "@mui/icons-material/HomeOutlined";

import EmptyState from "@src/components/EmptyState";

import { ProjectScopeContext, userRolesAtom } from "@src/atoms/projectScope";
import { ROUTES } from "@src/constants/routes";
import { TOP_BAR_HEIGHT } from "@src/layouts/Navigation/TopBar";
import type { PropsWithChildren } from "react";

/**
 * Lock pages for admins only
 * @param root0
 * @param root0.children
 * @param root0.fallback
 */
export default function AdminRoute({
  children,
  fallback,
}: PropsWithChildren<{ fallback?: React.ReactNode; }>) {
  const projectScopeStore = useContext(ProjectScopeContext);
  const [ userRoles ] = useAtom(userRolesAtom, { store: projectScopeStore });

  if (!userRoles.includes("ADMIN")) {
    if (fallback) {
      return fallback as JSX.Element;
    }

    return (
      <EmptyState
        role="alert"
        fullScreen
        Icon={LockIcon}
        message="Access denied"
        description={(
          <>
            <Typography>
              You must be an admin of this workspace to access this page.
            </Typography>

            <Button component={Link} to={ROUTES.home} startIcon={<HomeIcon />}>
              Home
            </Button>
          </>
        )}
        style={{ marginTop: -TOP_BAR_HEIGHT, marginBottom: -TOP_BAR_HEIGHT }}
      />
    );
  }

  return children as JSX.Element;
}
