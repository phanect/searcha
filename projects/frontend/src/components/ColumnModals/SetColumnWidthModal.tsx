import { TextField } from "@mui/material";
import { reactTableAtom, TableScopeContext } from "@src/atoms/tableScope";
import Modal from "@src/components/Modal";
import { useAtom } from "jotai";

import { useContext, useEffect, useState } from "react";
import type { IColumnModalProps } from ".";

export default function SetColumnWidthModal({
  onClose,
  column,
}: IColumnModalProps) {
  const tableScopeStore = useContext(TableScopeContext);
  const [ reactTable ] = useAtom(reactTableAtom, { store: tableScopeStore });
  const [ newWidth, setWidth ] = useState<number>(0);

  useEffect(() => {
    // Set the initial width to the current column width once the table is fetched.
    setWidth(reactTable?.getAllColumns()[column.index].getSize() || 0);
  }, [ reactTable, column ]);

  const handleUpdate = () => {
    reactTable?.setColumnSizing((old) => {
      const newSizing = { ...old };
      // Set the new width for the column.
      newSizing[column.fieldName] = newWidth;
      return newSizing;
    });
    onClose();
  };

  return (
    <Modal
      onClose={onClose}
      title="Set Column Width"
      maxWidth="xs"
      children={(
        <form
          id="column-width-modal"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <TextField
            value={newWidth}
            autoFocus
            variant="filled"
            id="name"
            label="Width"
            type="number"
            fullWidth
            onChange={(e) => setWidth(Number(e.target.value))}
          />
        </form>
      )}
      actions={{
        primary: {
          children: "Update",
          type: "submit",
          form: "column-width-modal",
        },
        secondary: {
          onClick: onClose,
          children: "Cancel",
        },
      }}
    />
  );
}
