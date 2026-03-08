import {
  allUsersAtom,
  ProjectScopeContext,
  tablesAtom,
  userSettingsAtom,
} from "@src/atoms/projectScope";
import { useAtom } from "jotai";
import { useContext } from "react";

export default function useGetStartedCompletion() {
  const projectScopeStore = useContext(ProjectScopeContext);
  const [ tables ] = useAtom(tablesAtom, { store: projectScopeStore });
  const [ userSettings ] = useAtom(userSettingsAtom, { store: projectScopeStore });
  const [ allUsers ] = useAtom(allUsersAtom, { store: projectScopeStore });

  const completedSteps = {
    project: true,
    tutorial: Boolean(userSettings.tableTutorialComplete),
    table: tables.length > 0,
    members: allUsers.length > 0,
  };

  return [
    completedSteps,
    Object.values(completedSteps).reduce((a, c) => (c ? a + 1 : a), 0),
  ] as const;
}
