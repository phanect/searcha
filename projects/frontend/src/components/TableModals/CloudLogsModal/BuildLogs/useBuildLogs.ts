import useMemoValue from "@phanect/use-memo-value";

import { ProjectScopeContext } from "@src/atoms/projectScope";
import { tableSchemaAtom, TableScopeContext } from "@src/atoms/tableScope";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  queryEqual,
} from "firebase/firestore";
import { useAtom } from "jotai";
import { useContext, useEffect, useState } from "react";
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
