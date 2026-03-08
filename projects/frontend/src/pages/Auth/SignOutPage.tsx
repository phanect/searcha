import { Button } from "@mui/material";

import { ProjectScopeContext } from "@src/atoms/projectScope";
import AuthLayout from "@src/layouts/AuthLayout";

import { firebaseAuthAtom } from "@src/sources/ProjectSourceFirebase";
import { signOut } from "firebase/auth";
import { useAtom } from "jotai";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

export default function SignOutPage() {
  const projectScopeStore = useContext(ProjectScopeContext);
  const [ firebaseAuth ] = useAtom(firebaseAuthAtom, { store: projectScopeStore });

  useEffect(() => {
    signOut(firebaseAuth);
  }, [ firebaseAuth ]);

  return (
    <AuthLayout title="Signed out">
      <Button component={Link} to="/auth" variant="outlined">
        Sign in again
      </Button>
    </AuthLayout>
  );
}
