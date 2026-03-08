import {
  FunctionsIndexAtom,
  ProjectScopeContext,
  updateFunctionAtom,
} from "@src/atoms/projectScope";
import { FUNCTION_SCHEMAS } from "@src/config/dbPaths";
import useFirestoreCollectionWithAtom from "@src/hooks/useFirestoreCollectionWithAtom";
import { memo, useContext } from "react";

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
