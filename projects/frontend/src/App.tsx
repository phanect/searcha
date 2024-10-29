import { lazy, Suspense, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAtom } from "jotai";

import { Backdrop } from "@mui/material";
import Loading from "@src/components/Loading";
import ProjectSourceFirebase from "@src/sources/ProjectSourceFirebase";
import MembersSourceFirebase from "@src/sources/MembersSourceFirebase";
import ConfirmDialog from "@src/components/ConfirmDialog";
import RowyRunModal from "@src/components/RowyRunModal";
import NotFound from "@src/pages/NotFoundPage";
import RequireAuth from "@src/layouts/RequireAuth";
import AdminRoute from "@src/layouts/AdminRoute";

import {
  currentUserAtom,
  ProjectScopeContext,
  userRolesAtom,
  altPressAtom,
} from "@src/atoms/projectScope";
import { ROUTES } from "@src/constants/routes";
import useKeyPressWithAtom from "@src/hooks/useKeyPressWithAtom";

import SignOutPage from "@src/pages/Auth/SignOutPage";
import TableGroupRedirectPage from "./pages/TableGroupRedirectPage";
import ProvidedArraySubTablePage from "./pages/Table/ProvidedArraySubTablePage";

const AuthPage = lazy(() => import("@src/pages/Auth/AuthPage"));
const SignUpPage = lazy(() => import("@src/pages/Auth/SignUpPage"));
const JwtAuthPage = lazy(() => import("@src/pages/Auth/JwtAuthPage"));
const ImpersonatorAuthPage = lazy(() => import("@src/pages/Auth/ImpersonatorAuthPage"));

const SetupPage = lazy(() => import("@src/pages/SetupPage"));

const Navigation = lazy(() => import("@src/layouts/Navigation"));
const TableSettingsDialog = lazy(() => import("@src/components/TableSettingsDialog"));
const ProjectSettingsDialog = lazy(
  () =>
    import(
      "@src/components/ProjectSettingsDialog"
    )
);

const TablesPage = lazy(() => import("@src/pages/TablesPage"));
const ProvidedTablePage = lazy(() => import("@src/pages/Table/ProvidedTablePage"));
const ProvidedSubTablePage = lazy(() => import("@src/pages/Table/ProvidedSubTablePage"));
const TableTutorialPage = lazy(() => import("@src/pages/Table/TableTutorialPage"));

const UserSettingsPage = lazy(() => import("@src/pages/Settings/UserSettingsPage"));
const ProjectSettingsPage = lazy(() => import("@src/pages/Settings/ProjectSettingsPage"));
const MembersPage = lazy(() => import("@src/pages/Settings/MembersPage"));
const DebugPage = lazy(() => import("@src/pages/Settings/DebugPage"));

export default function App() {
  const projectScopeStore = useContext(ProjectScopeContext);

  const [ currentUser ] = useAtom(currentUserAtom, { store: projectScopeStore });
  const [ userRoles ] = useAtom(userRolesAtom, { store: projectScopeStore });
  useKeyPressWithAtom("Alt", altPressAtom, { store: projectScopeStore });

  return (
    <Suspense fallback={<Loading fullScreen />}>
      <ProjectSourceFirebase />
      {userRoles.includes("ADMIN") && <MembersSourceFirebase />}
      <ConfirmDialog />
      <RowyRunModal />

      {currentUser === undefined ? (
        <Loading fullScreen message="Authenticating" />
      ) : (
        <Routes>
          <Route path="*" element={<NotFound />} />

          <Route path={ROUTES.auth} element={<AuthPage />} />
          <Route path={ROUTES.signUp} element={<SignUpPage />} />
          <Route path={ROUTES.signOut} element={<SignOutPage />} />
          <Route path={ROUTES.jwtAuth} element={<JwtAuthPage />} />
          <Route
            path={ROUTES.impersonatorAuth}
            element={(
              <RequireAuth>
                <ImpersonatorAuthPage />
              </RequireAuth>
            )}
          />

          <Route path={ROUTES.setup} element={<SetupPage />} />

          <Route
            path="/"
            element={(
              <RequireAuth>
                <Navigation>
                  <TableSettingsDialog />
                  <ProjectSettingsDialog />
                </Navigation>
              </RequireAuth>
            )}
          >
            <Route
              path={ROUTES.home}
              element={<Navigate to={ROUTES.tables} replace />}
            />
            <Route path={ROUTES.tables} element={<TablesPage />} />

            <Route path={ROUTES.table}>
              <Route index element={<Navigate to={ROUTES.tables} replace />} />
              <Route path=":id" element={<ProvidedTablePage />}>
                <Route path={ROUTES.subTable}>
                  <Route index element={<NotFound />} />
                  <Route
                    path=":docPath/:subTableKey"
                    element={(
                      <Suspense
                        fallback={(
                          <Backdrop
                            key="sub-table-modal-backdrop"
                            open
                            sx={{ zIndex: "modal" }}
                          >
                            <Loading />
                          </Backdrop>
                        )}
                      >
                        <ProvidedSubTablePage />
                      </Suspense>
                    )}
                  />
                </Route>
                <Route path={ROUTES.arraySubTable}>
                  <Route index element={<NotFound />} />
                  <Route
                    path=":docPath/:subTableKey"
                    element={(
                      <Suspense
                        fallback={(
                          <Backdrop
                            key="sub-table-modal-backdrop"
                            open
                            sx={{ zIndex: "modal" }}
                          >
                            <Loading />
                          </Backdrop>
                        )}
                      >
                        <ProvidedArraySubTablePage />
                      </Suspense>
                    )}
                  />
                </Route>
              </Route>
            </Route>

            <Route path={ROUTES.tableGroup}>
              <Route index element={<Navigate to={ROUTES.tables} replace />} />
              <Route path=":id" element={<TableGroupRedirectPage />} />
            </Route>

            <Route
              path={ROUTES.tableTutorial}
              element={<TableTutorialPage />}
            />

            <Route
              path={ROUTES.settings}
              element={<Navigate to={ROUTES.userSettings} replace />}
            />
            <Route path={ROUTES.userSettings} element={<UserSettingsPage />} />
            <Route
              path={ROUTES.projectSettings}
              element={(
                <AdminRoute>
                  <ProjectSettingsPage />
                </AdminRoute>
              )}
            />
            <Route path={ROUTES.members} element={<MembersPage />} />

            <Route path={ROUTES.debug} element={<DebugPage />} />
          </Route>
        </Routes>
      )}
    </Suspense>
  );
}
