import { useContext, useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { useSnackbar } from "notistack";
import { useDebounce } from "use-debounce";
import { isEqual, isEmpty } from "lodash-es";

import LoadingButton from "@mui/lab/LoadingButton";
import CheckIcon from "@mui/icons-material/Check";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

import {
  TableScopeContext,
  updateColumnAtom,
} from "@src/atoms/tableScope";
import {
  defaultTableSettingsAtom,
  ProjectScopeContext,
} from "@src/atoms/projectScope";
import { DEBOUNCE_DELAY } from "./Table";
import type { ColumnSizingState } from "@tanstack/react-table";
import type {
  IUpdateColumnOptions } from "@src/atoms/tableScope";

/**
 * Debounces `columnSizing` and asks user if they want to save for all users,
 * if they have the `canEditColumns` permission
 * @param columnSizing
 * @param canEditColumns
 */
export function useSaveColumnSizing(
  columnSizing: ColumnSizingState,
  canEditColumns: boolean
) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const projectScopeStore = useContext(ProjectScopeContext);
  const tableScopeStore = useContext(TableScopeContext);
  const updateColumn = useSetAtom(updateColumnAtom, { store: tableScopeStore });
  const defaultTableSettings = useAtomValue(
    defaultTableSettingsAtom,
    { store: projectScopeStore },
  );

  // Debounce for saving to schema
  const [ debouncedColumnSizing ] = useDebounce<ColumnSizingState>(columnSizing, DEBOUNCE_DELAY, {
    equalityFn: isEqual,
  });
  // Offer to save when column sizing changes, depending on user settings
  useEffect(() => {
    if (!canEditColumns || isEmpty(debouncedColumnSizing)) {
      return undefined;
    }
    // If the user has disabled the popup, return early
    if (defaultTableSettings?.saveColumnSizingPopupDisabled) {
      // If the user has `automaticallyApplyColumnSizing` set to true, apply the column width before returning
      if (defaultTableSettings?.automaticallyApplyColumnSizing) {
        const updateTable = async () => {
          for (const [ key, value ] of Object.entries(debouncedColumnSizing)) {
            await updateColumn({ key, config: { width: value }});
          }
        };
        updateTable();
      }
      return undefined;
    }

    const snackbarId = enqueueSnackbar("Save column sizes for all users?", {
      action: (
        <SaveColumnSizingButton
          debouncedColumnSizing={debouncedColumnSizing}
          updateColumn={updateColumn}
        />
      ),
      anchorOrigin: { horizontal: "left", vertical: "bottom" },
    });

    return () => closeSnackbar(snackbarId);
  }, [
    debouncedColumnSizing,
    canEditColumns,
    enqueueSnackbar,
    closeSnackbar,
    updateColumn,
    defaultTableSettings,
  ]);

  return null;
}

type ISaveColumnSizingButtonProps = {
  debouncedColumnSizing: ColumnSizingState;
  updateColumn: (update: IUpdateColumnOptions) => Promise<void>;
};

/**
 * Make the button a component so it can have its own state,
 * so we can display the loading state without showing a new snackbar
 * @param root0
 * @param root0.debouncedColumnSizing
 * @param root0.updateColumn
 */
function SaveColumnSizingButton({
  debouncedColumnSizing,
  updateColumn,
}: ISaveColumnSizingButtonProps) {
  const [ state, setState ] = useState<"" | "loading" | "success">("");

  const handleSaveToSchema = async () => {
    setState("loading");
    // Do this one by one for now to prevent race conditions.
    // Need to support updating multiple columns in updateColumnAtom
    // in the future.
    for (const [ key, value ] of Object.entries(debouncedColumnSizing)) {
      await updateColumn({ key, config: { width: value }});
    }
    setState("success");
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

export default useSaveColumnSizing;
