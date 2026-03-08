import {
  currentUserAtom,
  ProjectScopeContext,
  projectSettingsAtom,
  publicSettingsAtom,
  updateProjectSettingsAtom,
  updatePublicSettingsAtom,
  updateUserSettingsAtom,
  userSettingsAtom,
} from "@src/atoms/projectScope";

import { PUBLIC_SETTINGS, SETTINGS, USERS } from "@src/config/dbPaths";
import useFirestoreDocWithAtom from "@src/hooks/useFirestoreDocWithAtom";
import { useAtom } from "jotai";
import { useContext } from "react";

/**
 * Sets listeners to public settings, project settings, and user settings.
 * Also sets functions to update those documents.
 */
export function useSettingsDocs() {
  const projectScopeStore = useContext(ProjectScopeContext);
  const [ currentUser ] = useAtom(currentUserAtom, { store: projectScopeStore });

  // Store public settings in atom
  useFirestoreDocWithAtom(publicSettingsAtom, { store: projectScopeStore }, PUBLIC_SETTINGS, {
    updateDataAtom: updatePublicSettingsAtom,
  });

  // Store project settings in atom when a user is signed in.
  // If they have no access, display AccessDenied screen via ErrorBoundary.
  useFirestoreDocWithAtom(
    projectSettingsAtom,
    { store: projectScopeStore },
    currentUser ? SETTINGS : undefined,
    { updateDataAtom: updateProjectSettingsAtom }
  );

  const roles
    = JSON.parse((currentUser as any)?.reloadUserInfo?.customAttributes ?? "{}")
      ?.roles ?? [];
  // Store user settings in atom when a user is signed in
  useFirestoreDocWithAtom(userSettingsAtom, { store: projectScopeStore }, USERS, {
    pathSegments: [ currentUser?.uid ],
    createIfNonExistent: currentUser
      ? {
        user: {
          email: currentUser.email || "",
          displayName: currentUser.displayName || undefined,
          photoURL: currentUser.photoURL || undefined,
          phoneNumber: currentUser.phoneNumber || undefined,
        },
        roles,
      }
      : undefined,
    updateDataAtom: updateUserSettingsAtom,
  });
}
