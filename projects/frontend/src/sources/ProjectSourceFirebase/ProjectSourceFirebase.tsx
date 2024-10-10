import { memo, useContext, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";

import { ProjectScopeContext, projectIdAtom } from "@src/atoms/projectScope";
import { firebaseConfigAtom } from "./init";

import { useAuthUser } from "./useAuthUser";
import { useSettingsDocs } from "./useSettingsDocs";
import { useTableFunctions } from "./useTableFunctions";

/**
 * When rendered, connects to a Firebase project and populates
 * all atoms in src/atoms/projectScope/project.
 */
export const ProjectSourceFirebase = memo(function ProjectSourceFirebase() {
  const projectScopeStore = useContext(ProjectScopeContext);

  // Set projectId from Firebase project
  const [firebaseConfig] = useAtom(firebaseConfigAtom, { store: projectScopeStore });
  const setProjectId = useSetAtom(projectIdAtom, { store: projectScopeStore });
  useEffect(() => {
    setProjectId(firebaseConfig.projectId || "");
  }, [firebaseConfig.projectId, setProjectId]);

  // Sets currentUser and userRoles based on Firebase Auth user.
  useAuthUser();

  // Sets listeners to public settings, project settings, and user settings.
  // Also sets functions to update those documents.
  useSettingsDocs();
  useTableFunctions();

  return null;
});

export default ProjectSourceFirebase;
