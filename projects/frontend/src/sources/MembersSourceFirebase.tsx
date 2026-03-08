import {
  allUsersAtom,
  ProjectScopeContext,
  updateUserAtom,
} from "@src/atoms/projectScope";
import { USERS } from "@src/config/dbPaths";
import useFirestoreCollectionWithAtom from "@src/hooks/useFirestoreCollectionWithAtom";
import { memo, useContext } from "react";

/**
 * When rendered, provides atom values for top-level tables
 */
const MembersSourceFirebase = memo(() => {
  const projectScopeStore = useContext(ProjectScopeContext);

  useFirestoreCollectionWithAtom(allUsersAtom, { store: projectScopeStore }, USERS, {
    updateDocAtom: updateUserAtom,
  });

  return null;
});

export default MembersSourceFirebase;
