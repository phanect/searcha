import { memo, useContext } from "react";

import useFirestoreCollectionWithAtom from "@src/hooks/useFirestoreCollectionWithAtom";
import {
  ProjectScopeContext,
  FunctionsIndexAtom,
  updateFunctionAtom,
} from "@src/atoms/projectScope";
import { FUNCTION_SCHEMAS } from "@src/config/dbPaths";

const FunctionsSource = memo(() => {
  const projectScopeStore = useContext(ProjectScopeContext);

  useFirestoreCollectionWithAtom(
    FunctionsIndexAtom,
    {
      store: projectScopeStore,
    },
    FUNCTION_SCHEMAS,
    {
      updateDocAtom: updateFunctionAtom,
    }
  );
  return null;
});

export default FunctionsSource;
