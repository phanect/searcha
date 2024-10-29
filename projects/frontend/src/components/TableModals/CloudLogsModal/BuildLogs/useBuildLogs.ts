import { useState, useEffect, useContext } from "react";
import { useAtom } from "jotai";
import useMemoValue from "@phanect/use-memo-value";
import {
  query,
  collection,
  orderBy,
  limit,
  queryEqual,
  onSnapshot,
} from "firebase/firestore";

import { ProjectScopeContext } from "@src/atoms/projectScope";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import { TableScopeContext, tableSchemaAtom } from "@src/atoms/tableScope";
import type {
  DocumentData } from "firebase/firestore";

export default function useBuildLogs() {
  const projectScopeStore = useContext(ProjectScopeContext);
  const tableScopeStore = useContext(TableScopeContext);
  const [ firebaseDb ] = useAtom(firebaseDbAtom, { store: projectScopeStore });
  const [ tableSchema ] = useAtom(tableSchemaAtom, { store: tableScopeStore });
  const functionConfigPath = tableSchema.functionConfigPath;

  const [ logs, setLogs ] = useState<DocumentData[]>([]);
  const logsQuery = useMemoValue(
    functionConfigPath
      ? query(
        collection(firebaseDb, `${ functionConfigPath }/buildLogs`),
        orderBy("startTimeStamp", "desc"),
        limit(15)
      )
      : null,
    (next, prev) => queryEqual(next as any, prev as any)
  );

  useEffect(() => {
    if (!logsQuery) {
      return undefined;
    }

    const unsubscribe = onSnapshot(logsQuery, (snapshot) => {
      setLogs(snapshot.docs.map((doc) => doc.data()));
    });

    return unsubscribe;
  }, [ logsQuery ]);

  const latestLog = logs[0];
  const latestStatus = latestLog?.status as string;
  return { logs, latestLog, latestStatus };
}
