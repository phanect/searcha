import { useEffect, useCallback, useContext } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { useErrorBoundary } from "react-error-boundary";
import { getIdTokenResult } from "firebase/auth";

import {
  ProjectScopeContext,
  currentUserAtom,
  userRolesAtom,
  updateUserSettingsAtom,
} from "@src/atoms/projectScope";
import { firebaseAuthAtom } from "./init";

/**
 * Sets currentUser and userRoles based on Firebase Auth user
 */
export function useAuthUser() {
  const { showBoundary } = useErrorBoundary();
  const projectScopeStore = useContext(ProjectScopeContext);
  // Get current user and store in atoms
  const [firebaseAuth] = useAtom(firebaseAuthAtom, { store: projectScopeStore });
  const setCurrentUser = useSetAtom(currentUserAtom, { store: projectScopeStore });
  const setUserRoles = useSetAtom(userRolesAtom, { store: projectScopeStore });
  // Must use `useAtomCallback`, otherwise `useAtom(updateUserSettingsAtom)`
  // will cause infinite re-render
  const updateUserSettings = useAtomCallback(
    useCallback((get) => get(updateUserSettingsAtom), []),
    { store: projectScopeStore },
  );

  useEffect(() => {
    // Suspend when currentUser has not been read yet
    (setCurrentUser as any)(new Promise(() => {}));

    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);

      try {
        if (user) {
          // Get user roles
          const tokenResult = await getIdTokenResult(user);
          const roles = (tokenResult.claims.roles as string[]) ?? [];
          setUserRoles(roles);

          // Update user settings doc with roles for User Management page
          const _updateUserSettings = await updateUserSettings();
          if (_updateUserSettings) _updateUserSettings({ roles });
        } else {
          setUserRoles([]);
        }
      } catch (e) {
        showBoundary(e);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [
    firebaseAuth,
    setCurrentUser,
    setUserRoles,
    updateUserSettings,
    showBoundary,
  ]);
}
