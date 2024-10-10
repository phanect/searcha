import { useContext, useEffect, useCallback } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { camelCase, find, findIndex, isEmpty } from "lodash-es";

import {
  ProjectScopeContext,
  projectSettingsAtom,
  createTableAtom,
  updateTableAtom,
  deleteTableAtom,
  getTableSchemaAtom,
  AdditionalTableSettings,
  MinimumTableSettings,
  currentUserAtom,
  updateSecretNamesAtom,
  projectIdAtom,
  rowyRunAtom,
  secretNamesAtom,
} from "@src/atoms/projectScope";
import { firebaseDbAtom } from "./init";

import {
  SETTINGS,
  TABLE_SCHEMAS,
  TABLE_GROUP_SCHEMAS,
} from "@src/config/dbPaths";
import { rowyUser } from "@src/utils/table";
import { TableSettings, TableSchema, SubTablesSchema } from "@src/types/table";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";
import { runRoutes } from "@src/constants/runRoutes";

export function useTableFunctions() {
  const projectScopeStore = useContext(ProjectScopeContext);
  const [firebaseDb] = useAtom(firebaseDbAtom, { store: projectScopeStore });
  const [currentUser] = useAtom(currentUserAtom, { store: projectScopeStore });
  const [projectId] = useAtom(projectIdAtom, { store: projectScopeStore });
  const [rowyRun] = useAtom(rowyRunAtom, { store: projectScopeStore });
  const [secretNames, setSecretNames] = useAtom(secretNamesAtom, { store: projectScopeStore });
  const [updateSecretNames] = useAtom(updateSecretNamesAtom, { store: projectScopeStore });

  // Create a function to get the latest tables from project settings,
  // so we don’t create new functions when tables change
  const readTables = useAtomCallback(
    useCallback((get) => get(projectSettingsAtom).tables, []),
    { store: projectScopeStore },
  );

  // Set the createTable function
  const setCreateTable = useSetAtom(createTableAtom, { store: projectScopeStore });
  useEffect(() => {
    setCreateTable(
      () =>
        async (
          settings: TableSettings,
          additionalSettings?: AdditionalTableSettings
        ) => {
          const {
            _schemaSource,
            _initialColumns = {},
            _schema,
          } = additionalSettings || {};

          // Get latest tables
          const tables = (await readTables()) || [];

          // Get columns from imported table settings or _schemaSource if provided
          let columns: NonNullable<TableSchema["columns"]> =
            Array.isArray(_schema?.columns) || !_schema?.columns
              ? {}
              : _schema?.columns;

          // If _schemaSource is provided, get the schema doc for that table
          if (_schemaSource) {
            const sourceTable = find(tables, ["id", _schemaSource]);

            if (sourceTable) {
              const sourceDocRef = doc(
                firebaseDb,
                sourceTable.tableType !== "collectionGroup"
                  ? TABLE_SCHEMAS
                  : TABLE_GROUP_SCHEMAS,
                _schemaSource
              );
              const sourceDoc = await getDoc(sourceDocRef);
              columns = sourceDoc.get("columns") || {};
            }
          }

          // Add columns from `_initialColumns`
          for (const [type, checked] of Object.entries(_initialColumns)) {
            if (
              checked &&
              // Make sure we don’t have
              !Object.values(columns)?.some((column) => column.type === type)
            )
              columns["_" + camelCase(type)] = {
                type,
                name: getFieldProp("name", type as FieldType),
                key: "_" + camelCase(type),
                fieldName: "_" + camelCase(type),
                config: {},
                index: Object.values(columns).length,
              };
          }

          const _createdBy = currentUser && rowyUser(currentUser);
          // Appends table to settings doc
          const promiseUpdateSettings = setDoc(
            doc(firebaseDb, SETTINGS),
            { tables: [...tables, { ...settings, _createdBy }] },
            { merge: true }
          );

          // adding subtables
          const batch = writeBatch(firebaseDb);

          if (_schema?.subTables) {
            const subTableCollectionRef = (id: string) =>
              doc(
                firebaseDb,
                settings.tableType !== "collectionGroup"
                  ? TABLE_SCHEMAS
                  : TABLE_GROUP_SCHEMAS,
                settings.id,
                "subTables",
                id
              );
            Object.keys(_schema.subTables).forEach((subTableId: string) => {
              if (_schema.subTables) {
                batch.set(
                  subTableCollectionRef(subTableId),
                  _schema.subTables[subTableId]
                );
              }
            });

            delete _schema.subTables;
          }

          // Creates schema doc with columns
          const { functionConfigPath, functionBuilderRef, ...schemaToWrite } =
            _schema ?? {};
          const tableSchemaDocRef = doc(
            firebaseDb,
            settings.tableType !== "collectionGroup"
              ? TABLE_SCHEMAS
              : TABLE_GROUP_SCHEMAS,
            settings.id
          );
          const promiseAddSchema = await setDoc(
            tableSchemaDocRef,
            { ...schemaToWrite, columns },
            { merge: true }
          );

          // Wait for both to complete
          await Promise.all([
            promiseUpdateSettings,
            promiseAddSchema,
            batch.commit(),
          ]);
        }
    );
  }, [currentUser, firebaseDb, readTables, setCreateTable]);

  // Set the createTable function
  const setUpdateTable = useSetAtom(updateTableAtom, { store: projectScopeStore });
  useEffect(() => {
    setUpdateTable(
      () =>
        async (
          settings: MinimumTableSettings,
          additionalSettings?: AdditionalTableSettings
        ) => {
          const { _schema } = additionalSettings || {};

          // Get latest tables
          const tables = [...((await readTables()) || [])];
          const foundIndex = findIndex(tables, ["id", settings.id]);
          const tableIndex = foundIndex > -1 ? foundIndex : tables.length;

          // Shallow merge new settings with old
          tables[tableIndex] = { ...tables[tableIndex], ...settings };

          // Create tablesSettings object from tables array
          const tablesSettings = tables.reduce(
            (acc, table) => {
              if (table.tableType === "primaryCollection") {
                acc.pc[table.id] = table;
              } else {
                acc.cg[table.id] = table;
              }
              return acc;
            },
            {
              pc: {},
              cg: {},
            } as Record<string, Record<string, TableSettings>>
          );
          // Updates settings doc with new tables array
          const promiseUpdateSettings = setDoc(
            doc(firebaseDb, SETTINGS),
            { tables, tablesSettings },
            { merge: true }
          );

          // adding subtables
          const batch = writeBatch(firebaseDb);

          if (_schema?.subTables) {
            const subTableCollectionRef = (id: string) =>
              doc(
                firebaseDb,
                settings.tableType !== "collectionGroup"
                  ? TABLE_SCHEMAS
                  : TABLE_GROUP_SCHEMAS,
                settings.id,
                "subTables",
                id
              );
            Object.keys(_schema.subTables).forEach((subTableId: string) => {
              if (_schema.subTables) {
                batch.set(
                  subTableCollectionRef(subTableId),
                  _schema.subTables[subTableId]
                );
              }
            });

            delete _schema.subTables;
          }

          // Updates schema doc if param is provided
          const { functionConfigPath, functionBuilderRef, ...schemaToWrite } =
            _schema ?? {};
          const tableSchemaDocRef = doc(
            firebaseDb,
            settings.tableType !== "collectionGroup"
              ? TABLE_SCHEMAS
              : TABLE_GROUP_SCHEMAS,
            settings.id
          );
          const promiseUpdateSchema = isEmpty(schemaToWrite)
            ? Promise.resolve()
            : await setDoc(tableSchemaDocRef, schemaToWrite, { merge: true });

          // Wait for both to complete
          await Promise.all([
            promiseUpdateSettings,
            promiseUpdateSchema,
            batch.commit(),
          ]);
        }
    );
  }, [firebaseDb, readTables, setUpdateTable]);

  // Set the deleteTable function
  const setDeleteTable = useSetAtom(deleteTableAtom, { store: projectScopeStore });
  useEffect(() => {
    setDeleteTable(() => async (id: string) => {
      // Get latest tables
      const tables = (await readTables()) || [];
      const table = find(tables, ["id", id]);

      // Removes table from settings doc array
      const promiseUpdateSettings = setDoc(
        doc(firebaseDb, SETTINGS),
        { tables: tables.filter((table) => table.id !== id) },
        { merge: true }
      );

      // Deletes table schema doc
      const tableSchemaDocRef = doc(
        firebaseDb,
        table?.tableType === "collectionGroup"
          ? TABLE_GROUP_SCHEMAS
          : TABLE_SCHEMAS,
        id
      );
      const promiseDeleteSchema = deleteDoc(tableSchemaDocRef);

      // Wait for both to complete
      await Promise.all([promiseUpdateSettings, promiseDeleteSchema]);
    });
  }, [firebaseDb, readTables, setDeleteTable]);

  // Set the getTableSchema function
  const setGetTableSchema = useSetAtom(getTableSchemaAtom, { store: projectScopeStore });
  useEffect(() => {
    setGetTableSchema(() => async (id: string, withSubtables?: boolean) => {
      // Get latest tables
      const tables = (await readTables()) || [];
      const table = find(tables, ["id", id]);

      const tableSchemaDocRef = doc(
        firebaseDb,
        table?.tableType === "collectionGroup"
          ? TABLE_GROUP_SCHEMAS
          : TABLE_SCHEMAS,
        id
      );

      let tableSchema: TableSchema | Promise<TableSchema> = getDoc(
        tableSchemaDocRef
      ).then((doc) => (doc.data() || {}) as TableSchema);

      if (withSubtables) {
        let subTables: SubTablesSchema | Promise<SubTablesSchema> = getDocs(
          collection(
            firebaseDb,
            `${
              table?.tableType === "collectionGroup"
                ? TABLE_GROUP_SCHEMAS
                : TABLE_SCHEMAS
            }/${id}/subTables`
          )
        ).then((querySnapshot) => {
          let subTables: SubTablesSchema = {};
          querySnapshot.forEach((doc) => {
            subTables[doc.id] = doc.data();
          });
          return subTables;
        });

        [tableSchema, subTables] = await Promise.all([tableSchema, subTables]);
        tableSchema.subTables = subTables;
      }

      return tableSchema as TableSchema;
    });
  }, [firebaseDb, readTables, setGetTableSchema]);

  // Set the deleteTable function
  const setUpdateSecretNames = useSetAtom(updateSecretNamesAtom, { store: projectScopeStore });
  useEffect(() => {
    if (!projectId || !rowyRun || !secretNamesAtom) return;
    setUpdateSecretNames(() => async (clearSecretNames?: boolean) => {
      setSecretNames({
        loading: true,
        secretNames: clearSecretNames ? null : secretNames.secretNames,
      });
      rowyRun({
        route: runRoutes.listSecrets,
      })
        .then((secrets: string[]) => {
          setSecretNames({
            loading: false,
            secretNames: secrets,
          });
        })
        .catch(() => {
          setSecretNames({
            loading: false,
            secretNames: clearSecretNames ? null : secretNames.secretNames,
          });
        });
    });
  }, [projectId, rowyRun, setUpdateSecretNames]);
  useEffect(() => {
    if (updateSecretNames) {
      updateSecretNames(true);
    }
  }, [updateSecretNames]);
}
