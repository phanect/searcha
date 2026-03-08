import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { ProjectScopeContext } from "@src/atoms/projectScope";
import { HydrateAtoms } from "@src/atoms/utils.ts";
import ErrorFallback from "@src/components/ErrorFallback";

import Loading from "@src/components/Loading";
import SnackbarProvider from "@src/contexts/SnackbarContext";
import { SnackLogProvider } from "@src/contexts/SnackLogContext";
import RowyThemeProvider from "@src/theme/RowyThemeProvider";
import { Suspense, useContext } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";

export const muiCache = createCache({ key: "mui", prepend: true });

export type IProvidersProps = {
  children: React.ReactNode;
  initialAtomValues?: Parameters<typeof HydrateAtoms>[0]["initialValues"];
};

export default function Providers({
  children,
  initialAtomValues,
}: IProvidersProps) {
  const projectScopeStore = useContext(ProjectScopeContext);

  return (
    <ErrorBoundary
      fallbackRender={
        // Can’t use <ErrorFallback> here because it uses useLocation,
        // which needs to be inside a <Router>
        ({ error }) => (
          <div role="alert">
            <h1>Something went wrong</h1>
            <p>{error.message}</p>
          </div>
        )
      }
    >
      <BrowserRouter>
        <HelmetProvider>
          <ProjectScopeContext.Provider
            key="projectScope"
            value={projectScopeStore}
          >
            <HydrateAtoms initialValues={initialAtomValues}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <CacheProvider value={muiCache}>
                  <RowyThemeProvider>
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <SnackbarProvider>
                        <SnackLogProvider>
                          <Suspense fallback={<Loading fullScreen />}>
                            {children}
                          </Suspense>
                        </SnackLogProvider>
                      </SnackbarProvider>
                    </ErrorBoundary>
                  </RowyThemeProvider>
                </CacheProvider>
              </LocalizationProvider>
            </HydrateAtoms>
          </ProjectScopeContext.Provider>
        </HelmetProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
