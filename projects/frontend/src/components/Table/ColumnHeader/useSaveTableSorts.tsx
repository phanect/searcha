import CheckIcon from "@mui/icons-material/Check";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  defaultTableSettingsAtom,
  ProjectScopeContext,
  updateUserSettingsAtom,
} from "@src/atoms/projectScope";
import {
  tableIdAtom,
  TableScopeContext,
  updateTableSchemaAtom,
} from "@src/atoms/tableScope";
import CircularProgressOptical from "@src/components/CircularProgressOptical";
import { useAtom, useAtomValue } from "jotai";
import { useSnackbar } from "notistack";

import { useCallback, useContext, useState } from "react";
import type { TableSort } from "@src/types/table";
import type { SnackbarKey } from "notistack";

function useSaveTableSorts(canEditColumns: boolean) {
  const projectScopeStore = useContext(ProjectScopeContext);
  const tableScopeStore = useContext(TableScopeContext);

  const [ updateTableSchema ] = useAtom(updateTableSchemaAtom, { store: tableScopeStore });
  const [ updateUserSettings ] = useAtom(updateUserSettingsAtom, { store: projectScopeStore });
  const [ tableId ] = useAtom(tableIdAtom, { store: tableScopeStore });
  const defaultTableSettings = useAtomValue(
    defaultTableSettingsAtom,
    { store: projectScopeStore },
  );
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [ snackbarId, setSnackbarId ] = useState<SnackbarKey | null>(null);

  // Offer to save when table sorts changes, depending on user settings
  const trigger = useCallback(
    (sorts: TableSort[]) => {
      if (!updateTableSchema) {
        throw new Error("Cannot update table schema");
      }
      if (updateUserSettings) {
        updateUserSettings({
          tables: {
            [`${ tableId }`]: { sorts },
          },
        });
      }
      if (!canEditColumns) {
        return undefined;
      }
      // If the user has disabled the popup, return early
      if (defaultTableSettings?.saveSortsPopupDisabled) {
        // If the user has `automaticallyApplySorts` set to true, apply the sorting before returning
        if (defaultTableSettings?.automaticallyApplySorts) {
          const updateTable = async () => await updateTableSchema({ sorts });
          updateTable();
        }
        return undefined;
      }
      if (snackbarId) {
        closeSnackbar(snackbarId);
      }
      setSnackbarId(
        enqueueSnackbar("Apply this sorting for all users?", {
          action: (
            <SaveTableSortButton
              updateTable={async () => await updateTableSchema({ sorts })}
            />
          ),
          anchorOrigin: { horizontal: "left", vertical: "bottom" },
        })
      );

      return () => (snackbarId ? closeSnackbar(snackbarId) : null);
    },
    [
      updateUserSettings,
      canEditColumns,
      snackbarId,
      enqueueSnackbar,
      tableId,
      closeSnackbar,
      updateTableSchema,
      defaultTableSettings,
    ]
  );

  return trigger;
}

function SaveTableSortButton({ updateTable }: { updateTable: Function; }) {
  const [ state, setState ] = useState<"" | "loading" | "success" | "error">("");

  const handleSaveToSchema = async () => {
    setState("loading");
    try {
      await updateTable();
      setState("success");
    } catch (e) {
      setState("error");
    }
  };

  return (
    <LoadingButton
      variant="contained"
      color="primary"
      onClick={handleSaveToSchema}
      loading={Boolean(state)}
      loadingIndicator={
        state === "success" ? (
          <CheckIcon color="primary" />
        ) : (
          <CircularProgressOptical size={20} color="primary" />
        )
      }
    >
      Save
    </LoadingButton>
  );
}

export default useSaveTableSorts;
