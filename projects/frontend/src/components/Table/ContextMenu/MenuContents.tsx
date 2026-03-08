import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import FilterIcon from "@mui/icons-material/FilterList";
import OpenIcon from "@mui/icons-material/OpenInNewOutlined";
import { Divider } from "@mui/material";
import {
  Clear as ClearIcon,
  Copy as CopyIcon,
  CopyCells as DuplicateIcon,
  Row as RowIcon,
} from "@src/assets/icons";

import {
  altPressAtom,
  confirmDialogAtom,
  projectIdAtom,
  ProjectScopeContext,
  updateUserSettingsAtom,
  userRolesAtom,
} from "@src/atoms/projectScope";
import {
  _updateRowDbAtom,
  addRowAtom,
  deleteRowAtom,
  selectedCellAtom,
  tableRowsAtom,
  tableSchemaAtom,
  TableScopeContext,
  tableSettingsAtom,
  updateFieldAtom,
  tableIdAtom,
} from "@src/atoms/tableScope";
import { getFieldProp } from "@src/components/fields";
import { FieldType } from "@src/constants/fields";
import { generateId } from "@src/utils/table";
import { useAtom, useSetAtom } from "jotai";
import { find } from "lodash-es";
import { Fragment, useContext } from "react";
import ContextMenuItem from "./ContextMenuItem";
import type { TableRow } from "@src/types/table";
import type { IContextMenuItem } from "./ContextMenuItem";

type IMenuContentsProps = {
  onClose: () => void;
};

export default function MenuContents({ onClose }: IMenuContentsProps) {
  const projectScopeStore = useContext(ProjectScopeContext);
  const tableScopeStore = useContext(TableScopeContext);

  const [ projectId ] = useAtom(projectIdAtom, { store: projectScopeStore });
  const [ userRoles ] = useAtom(userRolesAtom, { store: projectScopeStore });
  const [ altPress ] = useAtom(altPressAtom, { store: projectScopeStore });
  const confirm = useSetAtom(confirmDialogAtom, { store: projectScopeStore });
  const [ tableSettings ] = useAtom(tableSettingsAtom, { store: tableScopeStore });
  const [ tableSchema ] = useAtom(tableSchemaAtom, { store: tableScopeStore });
  const [ tableRows ] = useAtom(tableRowsAtom, { store: tableScopeStore });
  const [ selectedCell ] = useAtom(selectedCellAtom, { store: tableScopeStore });
  const addRow = useSetAtom(addRowAtom, { store: tableScopeStore });
  const deleteRow = useSetAtom(deleteRowAtom, { store: tableScopeStore });
  const updateField = useSetAtom(updateFieldAtom, { store: tableScopeStore });
  const [ updateRowDb ] = useAtom(_updateRowDbAtom, { store: tableScopeStore });
  const [ updateUserSettings ] = useAtom(updateUserSettingsAtom, { store: projectScopeStore });
  const [ tableId ] = useAtom(tableIdAtom, { store: tableScopeStore });

  const addRowIdType = tableSchema.idType || "decrement";

  if (!tableSchema.columns || !selectedCell) {
    return null;
  }

  const selectedColumn = tableSchema.columns[selectedCell.columnKey];
  const row = find(
    tableRows,
    selectedCell?.arrayIndex === undefined
      ? [ "_rowy_ref.path", selectedCell.path ]
      : // if the table is an array table, we need to use the array index to find the row
      [ "_rowy_ref.arrayTableData.index", selectedCell.arrayIndex ]
  );

  if (!row) {
    return null;
  }

  const actionGroups: IContextMenuItem[][] = [];

  const handleDuplicate = () => {
    const _duplicate = async (): Promise<void> => {
      if (row._rowy_ref.arrayTableData !== undefined) {
        if (!updateRowDb) {
          return;
        }

        return updateRowDb("", {}, undefined, {
          index: row._rowy_ref.arrayTableData.index,
          operation: {
            addRow: "bottom",
            base: row,
          },
        });
      }
      return addRow({
        row: row,
        setId: addRowIdType === "custom" ? "decrement" : addRowIdType,
      });
    };

    if (altPress || row._rowy_ref.arrayTableData !== undefined) {
      _duplicate();
    } else {
      confirm({
        title: "Duplicate row?",
        body: (
          <>
            Row path:
            <br />
            <code style={{ userSelect: "all", wordBreak: "break-all" }}>
              {row._rowy_ref.path}
            </code>
          </>
        ),
        confirm: "Duplicate",
        handleConfirm: _duplicate,
      });
    }
  };
  const handleDelete = () => {
    const _delete = () =>
      deleteRow({
        path: row._rowy_ref.path,
        options: row._rowy_ref.arrayTableData,
      });

    if (altPress || row._rowy_ref.arrayTableData !== undefined) {
      _delete();
    } else {
      confirm({
        title: "Delete row?",
        body: (
          <>
            Row path:
            <br />
            <code style={{ userSelect: "all", wordBreak: "break-all" }}>
              {row._rowy_ref.path}
            </code>
          </>
        ),
        confirm: "Delete",
        confirmColor: "error",
        handleConfirm: _delete,
      });
    }
  };

  const handleClearValue = () => {
    const clearValue = () => {
      updateField({
        path: selectedCell.path,
        fieldName: selectedColumn.fieldName,
        arrayTableData: {
          index: selectedCell.arrayIndex,
        },
        value: null,
        deleteField: true,
      });
      onClose();
    };

    if (altPress || row._rowy_ref.arrayTableData !== undefined) {
      clearValue();
    } else {
      confirm({
        title: "Clear cell value?",
        body: "The cell’s value cannot be recovered after",
        confirm: "Delete",
        confirmColor: "error",
        handleConfirm: clearValue,
      });
    }
  };

  const rowActions: IContextMenuItem[] = [
    {
      label: "Copy ID",
      icon: <CopyIcon />,
      onClick: () => {
        navigator.clipboard.writeText(row._rowy_ref.id);
        onClose();
      },
    },
    {
      label: "Copy path",
      icon: <CopyIcon />,
      onClick: () => {
        navigator.clipboard.writeText(row._rowy_ref.path);
        onClose();
      },
    },
    {
      label: "Open in Firebase Console",
      icon: <OpenIcon />,
      onClick: () => {
        window.open(
          `https://console.firebase.google.com/project/${ projectId }/firestore/data/~2F${ row._rowy_ref.path.replace(
            /\//g,
            "~2F"
          ) }`
        );
        onClose();
      },
    },
    { label: "Divider", divider: true },
    {
      label: "Duplicate",
      icon: <DuplicateIcon />,
      disabled:
        tableSettings.tableType === "collectionGroup"
        || (!userRoles.includes("ADMIN") && tableSettings.readOnly),
      onClick: handleDuplicate,
    },
    {
      label: altPress ? "Delete" : "Delete…",
      color: "error",
      icon: <DeleteIcon />,
      disabled: !userRoles.includes("ADMIN") && tableSettings.readOnly,
      onClick: handleDelete,
    },
  ];

  if (selectedColumn) {
    const menuActions = getFieldProp(
      "contextMenuActions",
      selectedColumn?.type
    );

    // Field type actions
    const fieldTypeActions = menuActions
      ? menuActions(selectedCell, onClose)
      : [];
    if (fieldTypeActions.length > 0) {
      actionGroups.push(fieldTypeActions);
    }

    if (selectedColumn?.type === FieldType.derivative) {
      const renderedFieldMenuActions = getFieldProp(
        "contextMenuActions",
        selectedColumn.config?.renderFieldType
      );
      if (renderedFieldMenuActions) {
        actionGroups.push(renderedFieldMenuActions(selectedCell, onClose));
      }
    }

    // Cell actions
    // TODO: Add copy and paste here

    const selectedColumnKey = selectedCell.columnKey;
    const selectedColumnKeySplit = selectedColumnKey.split(".");

    const getNestedFieldValue = (object: TableRow, keys: string[]) => {
      let value = object;

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (value && typeof value === "object" && key in value) {
          value = value[key];
        } else {
          // Handle cases where the key does not exist in the nested structure
          return undefined;
        }
      }

      return value;
    };

    const cellValue = getNestedFieldValue(row, selectedColumnKeySplit);

    const columnFilters = getFieldProp(
      "filter",
      selectedColumn?.type === FieldType.derivative
        ? selectedColumn.config?.renderFieldType
        : selectedColumn?.type
    );
    const handleFilterBy = () => {
      const filters = [
        {
          key: selectedColumn.fieldName,
          operator: columnFilters!.operators[0]?.value || "==",
          value: cellValue,
          id: generateId(),
        },
      ];

      if (updateUserSettings) {
        updateUserSettings({ tables: { [`${ tableId }`]: { filters }}});
      }
      onClose();
    };
    const cellActions = [
      {
        label: altPress ? "Clear value" : "Clear value…",
        color: "error",
        icon: <ClearIcon />,
        disabled:
          selectedColumn?.editable === false
          || !row
          || cellValue === undefined
          || getFieldProp("group", selectedColumn?.type) === "Auditing",
        onClick: handleClearValue,
      },
      {
        label: "Filter by",
        icon: <FilterIcon />,
        disabled: !columnFilters || cellValue === undefined,
        onClick: handleFilterBy,
      },
    ];
    actionGroups.push(cellActions);

    // Row actions as sub-menu
    actionGroups.push([
      {
        label: "Row",
        icon: <RowIcon />,
        subItems: rowActions,
      },
    ]);
  } else {
    actionGroups.push(rowActions);
  }

  return (
    <>
      {actionGroups.map((items, groupIndex) => (
        <Fragment key={groupIndex}>
          {groupIndex > 0 && <Divider variant="middle" />}
          {items.map((item, index: number) => (
            <ContextMenuItem
              key={`contextMenu-${ groupIndex }-${ index }`}
              {...item}
            />
          ))}
        </Fragment>
      ))}
    </>
  );
}
