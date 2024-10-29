import { useState, Suspense, useContext } from "react";
import { useSetAtom } from "jotai";

import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { Export as ExportIcon, Import as ImportIcon } from "@src/assets/icons";

import {
  ProjectScopeContext,
  tableSettingsDialogIdAtom,
} from "@src/atoms/projectScope";
import ImportSettings from "./ImportSettings";
import ExportSettings from "./ExportSettings";
import type {
  TableSettingsDialogState } from "@src/atoms/projectScope";
import type { Control, UseFormReturn, FieldValues } from "react-hook-form";

export type IActionsMenuProps = {
  mode: TableSettingsDialogState["mode"];
  control: Control;
  useFormMethods: UseFormReturn<FieldValues, object>;
};

export default function ActionsMenu({
  mode,
  control,
  useFormMethods,
}: IActionsMenuProps) {
  const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const projectScopeStore = useContext(ProjectScopeContext);
  const setTableSettingsDialogId = useSetAtom(
    tableSettingsDialogIdAtom,
    { store: projectScopeStore },
  );

  // On open, set tableSettingsDialogIdAtom so the derived
  // tableSettingsDialogSchemaAtom can fetch the schema doc
  const handleOpen: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setAnchorEl(e.currentTarget);
    const tableId = useFormMethods.getValues("id") as string;
    setTableSettingsDialogId(tableId);
  };
  // Reset the tableSettingsDialogIdAtom so we fetch fresh data every time
  // the menu is opened
  const handleClose = () => {
    setAnchorEl(null);
    setTableSettingsDialogId("");
  };

  return (
    <>
      <Tooltip title="Actions menu">
        <IconButton
          aria-label="Actions…"
          id="table-settings-actions-button"
          aria-controls="table-settings-actions-menu"
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleOpen}
        >
          {mode === "create" ? <ImportIcon /> : <ExportIcon />}
        </IconButton>
      </Tooltip>

      <Menu
        id="table-settings-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "table-settings-actions-button" }}
        disablePortal
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Suspense
          fallback={(
            <>
              <MenuItem disabled>Loading table settings…</MenuItem>
              <MenuItem disabled />
            </>
          )}
        >
          <ImportSettings
            closeMenu={handleClose}
            control={control}
            useFormMethods={useFormMethods}
          />
          <ExportSettings closeMenu={handleClose} control={control} />
        </Suspense>
      </Menu>
    </>
  );
}
