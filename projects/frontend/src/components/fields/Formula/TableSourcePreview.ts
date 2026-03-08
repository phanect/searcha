import {
  _deleteRowDbAtom,
  _updateRowDbAtom,
  tableNextPageAtom,
  tableRowsDbAtom,
  TableScopeContext,
  tableSettingsAtom,
} from "@src/atoms/tableScope";
import { generateId, updateRowData } from "@src/utils/table";
import { useAtom, useSetAtom } from "jotai";
import { cloneDeep, findIndex, isEqual, sortBy } from "lodash-es";

import { useCallback, useContext, useEffect, useRef } from "react";
import { serializeRef } from "./util";
import type { TableRow } from "@src/types/table";

const TableSourcePreview = ({ formulaFn }: { formulaFn: string; }) => {
  const prevFn = useRef(formulaFn);
  const isInitialMount = useRef(true);

  const tableScopeStore = useContext(TableScopeContext);
  const [ tableSettings ] = useAtom(tableSettingsAtom, { store: tableScopeStore });
  const [ rows, setRows ] = useAtom(tableRowsDbAtom, { store: tableScopeStore });
  const setUpdateRowDb = useSetAtom(_updateRowDbAtom, { store: tableScopeStore });
  const setDeleteRowDb = useSetAtom(_deleteRowDbAtom, { store: tableScopeStore });
  const setNextPageAtom = useSetAtom(tableNextPageAtom, { store: tableScopeStore });

  const generateRows = useCallback(
    (rows: TableRow[]) =>
      rows.map((row) => ({
        ...row,
        _rowy_ref: serializeRef(`${ tableSettings.collection }/${ generateId() }`),
      })),
    [ tableSettings.collection ]
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const emptyRow = {} as TableRow;
      setRows(generateRows([ emptyRow, emptyRow, emptyRow ]));
    }
  }, [ setRows, generateRows, tableSettings.collection ]);

  useEffect(() => {
    if (!isEqual(prevFn.current, formulaFn)) {
      prevFn.current = formulaFn;
      setRows(rows.map((row) => ({ ...row, __mock_field__: Math.random() })));
    }
  }, [ rows, setRows, generateRows, formulaFn ]);

  useEffect(() => {
    setUpdateRowDb(() => (path: string, update: Partial<TableRow>) => {
      const index = findIndex(rows, [ "_rowy_ref.path", path ]);
      if (index === -1) {
        setRows(
          sortBy(
            [
              ...rows,
              { ...update, _rowy_ref: { id: path.split("/").pop()!, path }},
            ],
            [ "_rowy_ref.id" ]
          )
        );
      } else {
        const updatedRows = [ ...rows ];
        updatedRows[index] = cloneDeep(rows[index]);
        updatedRows[index] = updateRowData(updatedRows[index], update);
        setRows(updatedRows);
      }
      return Promise.resolve();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ setRows, setUpdateRowDb ]);

  useEffect(() => {
    setDeleteRowDb(() => (path: string) => {
      const index = findIndex(rows, [ "_rowy_ref.path", path ]);
      if (index > -1) {
        setRows(rows.filter((_, idx) => idx !== index));
      }
      return Promise.resolve();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ setRows, setDeleteRowDb ]);

  useEffect(() => {
    setNextPageAtom({ loading: false, available: false });
  }, [ setNextPageAtom ]);

  return null;
};

export default TableSourcePreview;
