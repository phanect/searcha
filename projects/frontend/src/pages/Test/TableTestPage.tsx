import { Suspense, useContext } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useParams } from "react-router-dom";

import {
  TableScopeContext,
  tableIdAtom,
  tableSettingsAtom,
  tableSchemaAtom,
  tableFiltersAtom,
  tableSortsAtom,
  tableRowsAtom,
} from "@src/atoms/tableScope";

import TableSourceFirestore from "@src/sources/TableSourceFirestore";
import TableToolbarSkeleton from "@src/components/TableToolbar/TableToolbarSkeleton";
import TableSkeleton from "@src/components/Table/TableSkeleton";
import { HydrateAtoms } from "@src/atoms/utils.ts";

import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import { currentUserAtom, ProjectScopeContext } from "@src/atoms/projectScope";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { TABLE_SCHEMAS } from "@src/config/dbPaths";
import { generateId } from "@src/utils/table";

function TableTestPage() {
  const projectScopeStore = useContext(ProjectScopeContext);
  const tableScopeStore = useContext(TableScopeContext);

  const [tableId] = useAtom(tableIdAtom, { store: tableScopeStore });
  const [tableSettings] = useAtom(tableSettingsAtom, { store: tableScopeStore });
  const [tableSchema] = useAtom(tableSchemaAtom, { store: tableScopeStore });

  const setTableFilters = useSetAtom(tableFiltersAtom, { store: tableScopeStore });
  const setTableSorts = useSetAtom(tableSortsAtom, { store: tableScopeStore });

  const [tableRows] = useAtom(tableRowsAtom, { store: tableScopeStore });

  console.log(tableId, tableSettings, tableSchema);

  const [firebaseDb] = useAtom(firebaseDbAtom, { store: projectScopeStore });

  return (
    <div>
      <p>
        Table ID: <code>{tableId}</code>
      </p>

      <pre style={{ height: "4em", overflow: "auto", resize: "vertical" }}>
        tableSettings: {JSON.stringify(tableSettings, undefined, 2)}
      </pre>
      <pre style={{ height: "4em", overflow: "auto", resize: "vertical" }}>
        tableSchema: {JSON.stringify(tableSchema, undefined, 2)}
      </pre>

      <button
        onClick={() => {
          setDoc(
            doc(firebaseDb, TABLE_SCHEMAS, tableId!),
            {
              _test: { [Date.now()]: "write" },
              _testArray: [{ [Date.now()]: "writeArray" }],
            },
            { merge: true }
          );
        }}
      >
        Firestore set + merge
      </button>
      <button
        onClick={() => {
          updateDoc(doc(firebaseDb, TABLE_SCHEMAS, tableId!), {
            _test: { [Date.now()]: "write" },
            _testArray: [{ [Date.now()]: "writeArray" }],
          });
        }}
      >
        Firestore update
      </button>
      <br />

      <button
        onClick={() =>
          setTableFilters([
            {
              key: "signedUp",
              operator: "==",
              value: true,
              id: generateId(),
            },
          ])
        }
      >
        Set table filters
      </button>
      <button onClick={() => setTableFilters([])}>Clear table filters</button>

      <button
        onClick={() => setTableSorts([{ key: "firstName", direction: "asc" }])}
      >
        Set table sorts
      </button>
      <button onClick={() => setTableFilters([])}>Clear table sorts</button>

      <ol>
        {tableRows.map(({ _rowy_ref, ...data }) => (
          <li key={_rowy_ref.id}>
            {_rowy_ref.id}: {data.firstName} {data.signedUp.toString()}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function ProvidedTableTestPage() {
  const projectScopeStore = useContext(ProjectScopeContext);
  const tableScopeStore = useContext(TableScopeContext);

  const { id } = useParams();
  const [currentUser] = useAtom(currentUserAtom, { store: projectScopeStore });

  return (
    <Suspense
      fallback={
        <>
          <TableToolbarSkeleton />
          <TableSkeleton />
        </>
      }
    >
      <TableScopeContext.Provider
        key={id}
        value={ tableScopeStore }
      >
        <HydrateAtoms initialValues={[
          [ tableIdAtom, id ],
          [ currentUserAtom, currentUser ],
        ]}>
          <TableSourceFirestore />
          <TableTestPage />
        </HydrateAtoms>
      </TableScopeContext.Provider>
    </Suspense>
  );
}
