import {
  compatibleRowyRunVersionAtom,
  currentUserAtom,
  ProjectScopeContext,
  rowyRunAtom,
} from "@src/atoms/projectScope";
import {
  auditChangeAtom,
  TableScopeContext,
  tableSettingsAtom,
} from "@src/atoms/tableScope";
import { runRoutes } from "@src/constants/runRoutes";
import { rowyUser } from "@src/utils/table";
import { useAtom, useSetAtom } from "jotai";
import { useContext, useEffect } from "react";

/**
 * Sets the value of auditChangeAtom
 */
export default function useAuditChange() {
  const projectScopeStore = useContext(ProjectScopeContext);
  const tableScopeStore = useContext(TableScopeContext);
  const setAuditChange = useSetAtom(auditChangeAtom, { store: tableScopeStore });
  const [ rowyRun ] = useAtom(rowyRunAtom, { store: projectScopeStore });
  const [ currentUser ] = useAtom(currentUserAtom, { store: projectScopeStore });

  const [ compatibleRowyRunVersion ] = useAtom(
    compatibleRowyRunVersionAtom,
    { store: projectScopeStore }
  );
  const [ tableSettings ] = useAtom(tableSettingsAtom, { store: tableScopeStore });

  useEffect(() => {
    if (
      !tableSettings?.id
      || !tableSettings?.collection
      || !tableSettings.audit
      || !compatibleRowyRunVersion({ minVersion: "1.1.1" })
    ) {
      setAuditChange(undefined);
      return;
    }

    setAuditChange(
      () =>
        (
          type: "ADD_ROW" | "UPDATE_CELL" | "DELETE_ROW",
          rowId: string,
          data?: { updatedField?: string; }
        ) =>
          rowyRun({
            route: runRoutes.auditChange,
            body: {
              type,
              rowyUser: rowyUser(currentUser!),
              ref: {
                rowPath: tableSettings.collection,
                rowId,
                tableId: tableSettings.id,
                collectionPath: tableSettings.collection,
              },
              data,
            },
          }).catch(console.log)
    );

    return () => setAuditChange(undefined);
  }, [ setAuditChange, rowyRun, compatibleRowyRunVersion, tableSettings ]);
}
