import { useAtom, Atom, type createStore } from "jotai";
import { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";

import Loading from "@src/components/Loading";

import { ProjectScopeContext, currentUserAtom } from "@src/atoms/projectScope";
import { ROUTES } from "@src/constants/routes";

export interface IRequireAuthProps {
  children: React.ReactElement;
  atom?: Atom<any>;
  store?: ReturnType<typeof createStore>;
}

export default function RequireAuth({
  children,
  atom = currentUserAtom,
  store = useContext(ProjectScopeContext),
}: IRequireAuthProps) {
  const [currentUser] = useAtom(atom, { store });
  const location = useLocation();

  if (currentUser === undefined)
    return <Loading fullScreen message="Authenticating" />;

  const redirect =
    (location.pathname ?? "") + (location.search ?? "") + (location.hash ?? "");

  if (currentUser === null)
    return (
      <Navigate
        to={ROUTES.auth + `?redirect=${encodeURIComponent(redirect)}`}
        replace
        state={location.state}
      />
    );

  return children;
}
