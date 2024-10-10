import { useContext } from "react";
import { useAtom, useSetAtom } from "jotai";

import TableToolbarButton from "./TableToolbarButton";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";

import { ProjectScopeContext, tableSettingsDialogAtom } from "@src/atoms/projectScope";
import { TableScopeContext, tableSettingsAtom } from "@src/atoms/tableScope";

export default function TableSettings() {
  const projectScopeStore = useContext(ProjectScopeContext);
  const tableScopeStore = useContext(TableScopeContext);
  const [tableSettings] = useAtom(tableSettingsAtom, { store: tableScopeStore });
  const openTableSettingsDialog = useSetAtom(
    tableSettingsDialogAtom,
    { store: projectScopeStore }
  );

  return (
    <TableToolbarButton
      title="Table settings"
      onClick={() =>
        openTableSettingsDialog({ mode: "update", data: tableSettings })
      }
      icon={<SettingsIcon />}
      disabled={!openTableSettingsDialog || tableSettings.id.includes("/")}
    />
  );
}
