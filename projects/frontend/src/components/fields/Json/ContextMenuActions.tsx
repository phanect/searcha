import Paste from "@mui/icons-material/ContentPaste";
import { Copy } from "@src/assets/icons";
import {
  tableRowsAtom,
  tableSchemaAtom,
  TableScopeContext,
  updateFieldAtom,
} from "@src/atoms/tableScope";
import { useAtom, useSetAtom } from "jotai";
import { find, get } from "lodash-es";
import { useSnackbar } from "notistack";

import { useContext } from "react";
import type { IFieldConfig } from "@src/components/fields/types";

export type IContextMenuActions = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

export const ContextMenuActions: IFieldConfig["contextMenuActions"] = (
  selectedCell,
) => {
  const tableScopeStore = useContext(TableScopeContext);
  const [ tableSchema ] = useAtom(tableSchemaAtom, { store: tableScopeStore });
  const [ tableRows ] = useAtom(tableRowsAtom, { store: tableScopeStore });
  const { enqueueSnackbar } = useSnackbar();
  const updateField = useSetAtom(updateFieldAtom, { store: tableScopeStore });
  const selectedCol = tableSchema.columns?.[selectedCell.columnKey];
  if (!selectedCol) {
    return [];
  }

  const selectedRow = find(tableRows, [ "_rowy_ref.path", selectedCell.path ]);
  const cellValue = get(selectedRow, selectedCol.fieldName) || [];

  const isEmpty
    = cellValue === ""
    || cellValue === null
    || cellValue === undefined
    || cellValue.length === 0;

  return [
    {
      label: "Copy",
      icon: <Copy />,
      onClick: () => {
        try {
          navigator.clipboard.writeText(JSON.stringify(cellValue));
          enqueueSnackbar("Copied");
        } catch (error) {
          enqueueSnackbar(`Failed to copy: ${ error }`, { variant: "error" });
        }
      },
      disabled: isEmpty,
    },
    {
      label: "Paste",
      icon: <Paste />,
      onClick: async () => {
        try {
          const text = await navigator.clipboard.readText();
          const parsed = JSON.parse(text);
          updateField({
            path: selectedCell.path,
            fieldName: selectedCol.fieldName,
            value: parsed,
          });
        } catch (error) {
          enqueueSnackbar(`Failed to paste: ${ error }`, { variant: "error" });
        }
      },
    },
  ];
};

export default ContextMenuActions;
