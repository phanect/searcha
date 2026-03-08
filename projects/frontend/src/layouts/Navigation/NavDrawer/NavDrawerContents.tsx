import AddIcon from "@mui/icons-material/Add";
import { Divider, ListItemIcon, ListItemText } from "@mui/material";
import { Tables as TablesIcon } from "@src/assets/icons";
import {
  ProjectScopeContext,
  tablesAtom,
  tableSettingsDialogAtom,
  userRolesAtom,
  userSettingsAtom,
} from "@src/atoms/projectScope";
import { ROUTES } from "@src/constants/routes";
import { useAtom, useSetAtom } from "jotai";
import { find, groupBy, sortBy } from "lodash-es";
import { useContext } from "react";

import NavItem from "./NavItem";
import NavTableSection from "./NavTableSection";
import SettingsNav from "./SettingsNav";
import type { TableSettings } from "@src/types/table";

export type INavDrawerContentsProps = {
  closeDrawer: ((e: {}) => void) | undefined;
  open: boolean;
  isPermanent: boolean;
  tempExpanded: boolean;
  setHover: React.Dispatch<React.SetStateAction<boolean | "persist">>;
};

export default function NavDrawerContents({
  closeDrawer,
  open,
  isPermanent,
  tempExpanded,
}: INavDrawerContentsProps) {
  const projectScopeStore = useContext(ProjectScopeContext);
  const [ tables ] = useAtom(tablesAtom, { store: projectScopeStore });
  const [ userRoles ] = useAtom(userRolesAtom, { store: projectScopeStore });
  const [ userSettings ] = useAtom(userSettingsAtom, { store: projectScopeStore });
  const openTableSettingsDialog = useSetAtom(
    tableSettingsDialogAtom,
    { store: projectScopeStore },
  );

  const favorites = Array.isArray(userSettings.favoriteTables)
    ? userSettings.favoriteTables
    : [];
  const sections: Record<string, TableSettings[]> = {
    Favorites: favorites
      .map((id) => find(tables, { id }))
      .filter((x) => x !== undefined) as TableSettings[],
    ...groupBy(sortBy(tables, [ "section", "name" ]), "section"),
  };

  return (
    <>
      <li>
        <NavItem to={ROUTES.tables} onClick={closeDrawer}>
          <ListItemIcon>
            <TablesIcon />
          </ListItemIcon>
          <ListItemText primary="Tables" />
        </NavItem>
      </li>

      <SettingsNav
        closeDrawer={closeDrawer as any}
        collapsed={isPermanent && !open && !tempExpanded}
      />

      <Divider variant="middle" sx={{ my: 1 }} />

      {sections
      && Object.entries(sections)
        .filter(([ , tables ]) => tables.length > 0)
        .map(([ section, tables ]) => (
          <NavTableSection
            key={section}
            section={section}
            tables={tables}
            closeDrawer={closeDrawer}
            collapsed={isPermanent && !open && !tempExpanded}
          />
        ))}

      {userRoles.includes("ADMIN") && (
        <li>
          <NavItem
            {...({ component: "button" } as any)}
            onClick={(e: any) => {
              if (closeDrawer) {
                closeDrawer(e);
              }
              openTableSettingsDialog({});
            }}
            sx={{ mb: 1 }}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Create table…" />
          </NavItem>
        </li>
      )}
    </>
  );
}
