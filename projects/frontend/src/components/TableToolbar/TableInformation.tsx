import InfoIcon from "@mui/icons-material/InfoOutlined";
import {
  sideDrawerAtom,
  TableScopeContext,
  tableSettingsAtom,
} from "@src/atoms/tableScope";
import TableToolbarButton from "@src/components/TableToolbar/TableToolbarButton";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";

import { useContext } from "react";

export default function TableInformation() {
  const tableScopeStore = useContext(TableScopeContext);
  const [ tableSettings ] = useAtom(tableSettingsAtom, { store: tableScopeStore });
  const [ sideDrawer, setSideDrawer ] = useAtom(sideDrawerAtom, { store: tableScopeStore });

  return (
    <TableToolbarButton
      title="Table information"
      icon={<InfoIcon />}
      onClick={() => setSideDrawer(sideDrawer ? RESET : "table-information")}
      disabled={!setSideDrawer || tableSettings.id.includes("/")}
    />
  );
}
