import { useContext, useState } from "react";
import { useAtom } from "jotai";
import {
  ProjectScopeContext,
  projectIdAtom,
  currentUserAtom,
  userRolesAtom,
  userSettingsAtom,
  publicSettingsAtom,
  projectSettingsAtom,
  rowyRunAtom,
} from "@src/atoms/projectScope";
import { firebaseAuthAtom } from "@src/sources/ProjectSourceFirebase";
import { Button } from "@mui/material";
import MultiSelect from "@phanect/datasheet-multiselect";
import { useSnackbar } from "notistack";
import { useFirestoreDocWithAtom } from "@src/hooks/useFirestoreDocWithAtom";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  getIdTokenResult,
} from "firebase/auth";
import { runRoutes } from "@src/constants/runRoutes";
import type {
  User } from "firebase/auth";

const provider = new GoogleAuthProvider();

function CurrentUser({ currentUser }: { currentUser: User; }) {
  // console.log("currentUser", currentUser.uid);
  return <p>{currentUser?.email}</p>;
}

function JotaiTest() {
  const projectScopeStore = useContext(ProjectScopeContext);

  const [ firebaseAuth ] = useAtom(firebaseAuthAtom, { store: projectScopeStore });
  const [ projectId ] = useAtom(projectIdAtom, { store: projectScopeStore });
  const [ currentUser ] = useAtom(currentUserAtom, { store: projectScopeStore });
  const [ userRoles ] = useAtom(userRolesAtom, { store: projectScopeStore });
  const [ publicSettings ] = useAtom(publicSettingsAtom, { store: projectScopeStore });
  const [ projectSettings ] = useAtom(projectSettingsAtom, { store: projectScopeStore });
  const [ userSettings ] = useAtom(userSettingsAtom, { store: projectScopeStore });
  const [ rowyRun ] = useAtom(rowyRunAtom, { store: projectScopeStore });

  const [ count, setCount ] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  useFirestoreDocWithAtom(
    publicSettingsAtom,
    { store: projectScopeStore },
    "_rowy_/publicSettings"
  );

  return (
    <>
      <Button
        variant={currentUser ? "outlined" : "contained"}
        color={currentUser ? "secondary" : "primary"}
        onClick={() => {
          signInWithPopup(firebaseAuth, provider);
          enqueueSnackbar("Signed in");
        }}
        sx={{ my: 4, mx: 1 }}
      >
        Sign in with Google
      </Button>
      <Button
        variant={!currentUser ? "outlined" : "contained"}
        color={!currentUser ? "secondary" : "primary"}
        onClick={() => {
          signOut(firebaseAuth);
          enqueueSnackbar("Signed out");
        }}
        sx={{ my: 4, mx: 1 }}
      >
        Sign out
      </Button>

      <MultiSelect
        multiple={false}
        onChange={console.log}
        value="2"
        options={new Array(10).fill(undefined).map((_, i) => i.toString())}
      />

      <Button onClick={() => getIdTokenResult(currentUser!).then(console.log)}>
        getIdTokenResult
      </Button>
      <Button
        onClick={() =>
          rowyRun({ route: runRoutes.version, localhost: true }).then(
            console.log
          )}
      >
        rowyRun
      </Button>

      {currentUser === undefined && <p>Authenticating …</p>}
      {currentUser && <CurrentUser currentUser={currentUser} />}
      <p>{JSON.stringify(userRoles)}</p>

      <p>Project: {projectId}</p>
      <p>{JSON.stringify(publicSettings)}</p>
      <p>{JSON.stringify(projectSettings)}</p>
      <p>{JSON.stringify(userSettings)}</p>

      <div>
        <Button onClick={() => setCount((c) => c + 1)}>
          Increment: {count}
        </Button>
      </div>
    </>
  );
}

export default JotaiTest;
