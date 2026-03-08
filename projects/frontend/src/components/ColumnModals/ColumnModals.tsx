import {
  columnModalAtom,
  tableSchemaAtom,
  TableScopeContext,
} from "@src/atoms/tableScope";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import { useContext } from "react";

import ColumnConfigModal from "./ColumnConfigModal";
import NameChangeModal from "./NameChangeModal";
import NewColumnModal from "./NewColumnModal";
import SetColumnWidthModal from "./SetColumnWidthModal";
import TypeChangeModal from "./TypeChangeModal";
import type { ColumnConfig } from "@src/types/table";

export type IColumnModalProps = {
  onClose: () => void;
  column: ColumnConfig;
};

export default function ColumnModals() {
  const tableScopeStore = useContext(TableScopeContext);
  const [ tableSchema ] = useAtom(tableSchemaAtom, { store: tableScopeStore });
  const [ columnModal, setColumnModal ] = useAtom(columnModalAtom, { store: tableScopeStore });

  if (!columnModal) {
    return null;
  }

  const onClose = () => setColumnModal(RESET);

  if (columnModal.type === "new") {
    return <NewColumnModal onClose={onClose} />;
  }

  const column = tableSchema.columns?.[columnModal.columnKey ?? ""];
  if (!column) {
    return null;
  }

  if (columnModal.type === "name") {
    return <NameChangeModal onClose={onClose} column={column} />;
  }

  if (columnModal.type === "type") {
    return <TypeChangeModal onClose={onClose} column={column} />;
  }

  if (columnModal.type === "config") {
    return <ColumnConfigModal onClose={onClose} column={column} />;
  }

  if (columnModal.type === "setColumnWidth") {
    return <SetColumnWidthModal onClose={onClose} column={column} />;
  }

  return null;
}
