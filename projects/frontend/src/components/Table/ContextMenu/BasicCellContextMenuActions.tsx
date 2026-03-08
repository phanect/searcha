import Paste from "@mui/icons-material/ContentPaste";
import { Copy as CopyCells } from "@src/assets/icons";
// import Cut from "@mui/icons-material/ContentCut";
import { tableSchemaAtom, TableScopeContext } from "@src/atoms/tableScope";
import { SUPPORTED_TYPES_PASTE, useMenuAction } from "@src/components/Table/useMenuAction";
import { useAtom } from "jotai";
import { useContext } from "react";
import type { IFieldConfig } from "@src/components/fields/types";

// TODO: Remove this and add `handlePaste` function to column config
export const BasicContextMenuActions: IFieldConfig["contextMenuActions"] = (
  selectedCell,
  reset
) => {
  const tableScopeStore = useContext(TableScopeContext);
  const [ tableSchema ] = useAtom(tableSchemaAtom, { store: tableScopeStore });
  const selectedCol = tableSchema.columns?.[selectedCell.columnKey];

  const handleClose = async () => await reset?.();
  const { handleCopy, handlePaste, cellValue } = useMenuAction(
    selectedCell,
    handleClose
  );

  const contextMenuActions = [
    // { label: "Cut", icon: <Cut />, onClick: handleCut },
    {
      label: "Copy",
      icon: <CopyCells />,
      onClick: handleCopy,
      disabled:
        cellValue === undefined || cellValue === null || cellValue === "",
    },
  ];

  if (SUPPORTED_TYPES_PASTE.has(selectedCol?.type)) {
    contextMenuActions.push({
      label: "Paste",
      icon: <Paste />,
      onClick: handlePaste,
      disabled: false,
    });
  }

  return contextMenuActions;
};

export default BasicContextMenuActions;
