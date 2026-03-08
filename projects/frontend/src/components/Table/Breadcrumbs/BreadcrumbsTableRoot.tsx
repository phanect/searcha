import ReadOnlyIcon from "@mui/icons-material/EditOffOutlined";
import {
  Breadcrumbs,
  Link,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ProjectScopeContext,
  tablesAtom,
  userRolesAtom,
} from "@src/atoms/projectScope";
import { ROUTES } from "@src/constants/routes";
import { useAtom } from "jotai";
import { camelCase, find } from "lodash-es";
import { useContext } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

import type {
  StackProps } from "@mui/material";

/**
 * Breadcrumbs is rendered by the Navigation component,
 * so it does not have access to tableScope
 * @param props
 */
export default function BreadcrumbsTableRoot(props: StackProps) {
  const { id } = useParams();

  const projectScopeStore = useContext(ProjectScopeContext);
  const [ userRoles ] = useAtom(userRolesAtom, { store: projectScopeStore });
  const [ tables ] = useAtom(tablesAtom, { store: projectScopeStore });

  const tableSettings = find(tables, [ "id", id ]);
  if (!tableSettings) {
    return null;
  }

  return (
    <Stack direction="row" alignItems="center" spacing={1.5} {...props}>
      <Breadcrumbs
        aria-label="Table breadcrumbs"
        sx={{
          typography: "button",
          fontSize: (theme) => theme.typography.h6.fontSize,
          color: "text.disabled",

          "& .MuiBreadcrumbs-ol": {
            userSelect: "none",
            flexWrap: "nowrap",
            whiteSpace: "nowrap",
          },
          "& .MuiBreadcrumbs-li": { display: "flex" },
          "& .MuiTypography-inherit": { typography: "h6" },
        }}
      >
        <Link
          component={RouterLink}
          to={`${ ROUTES.home }#${ camelCase(tableSettings.section) }`}
          color="text.secondary"
          underline="hover"
        >
          {tableSettings.section}
        </Link>

        <Typography variant="inherit" color="text.primary">
          {tableSettings.name}
        </Typography>
      </Breadcrumbs>

      {tableSettings.readOnly && (
        <Tooltip
          title={
            userRoles.includes("ADMIN")
              ? "Table is read-only for non-ADMIN users"
              : "Table is read-only"
          }
        >
          <ReadOnlyIcon fontSize="small" sx={{ ml: 0.5 }} color="action" />
        </Tooltip>
      )}
    </Stack>
  );
}
