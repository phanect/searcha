import { memo, useContext } from "react";

import useFirestoreCollectionWithAtom from "@src/hooks/useFirestoreCollectionWithAtom";
import {
  ProjectScopeContext,
  allUsersAtom,
  updateUserAtom,
} from "@src/atoms/projectScope";
import { USERS } from "@src/config/dbPaths";

/**
 * When rendered, provides atom values for top-level tables
 */
const MembersSourceFirebase = memo(function MembersSourceFirebase() {
  const projectScopeStore = useContext(ProjectScopeContext);

  useFirestoreCollectionWithAtom(allUsersAtom, { store: projectScopeStore }, USERS, {
    updateDocAtom: updateUserAtom,
  });

  return null;
});

export default MembersSourceFirebase;
