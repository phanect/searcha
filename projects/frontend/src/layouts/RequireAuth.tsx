import { currentUserAtom, ProjectScopeContext } from "@src/atoms/projectScope";
import Loading from "@src/components/Loading";
import { ROUTES } from "@src/constants/routes";
import { useAtom, type Atom, type createStore } from "jotai";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

export type IRequireAuthProps = {
  children: React.ReactElement;
  atom?: Atom<any>;
  store?: ReturnType<typeof createStore>;
};

export default function RequireAuth({
  children,
  atom = currentUserAtom,
  store = useContext(ProjectScopeContext),
}: IRequireAuthProps) {
  const [ currentUser ] = useAtom(atom, { store });
  const location = useLocation();

  if (currentUser === undefined) {
    return <Loading fullScreen message="Authenticating" />;
  }

  const redirect
    = (location.pathname ?? "") + (location.search ?? "") + (location.hash ?? "");

  if (currentUser === null) {
    return (
      <Navigate
        to={ROUTES.auth + `?redirect=${ encodeURIComponent(redirect) }`}
        replace
        state={location.state}
      />
    );
  }

  return children;
}
