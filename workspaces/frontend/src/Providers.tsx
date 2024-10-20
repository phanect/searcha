import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@src/components/ErrorFallback";
import { HydrateAtoms } from "@src/atoms/utils.ts";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ProjectScopeContext } from "@src/atoms/projectScope";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import RowyThemeProvider from "@src/theme/RowyThemeProvider";
import SnackbarProvider from "@src/contexts/SnackbarContext";
import { SnackLogProvider } from "@src/contexts/SnackLogContext";

import { Suspense, useContext } from "react";
import Loading from "@src/components/Loading";

export const muiCache = createCache({ key: "mui", prepend: true });

export interface IProvidersProps {
  children: React.ReactNode;
  initialAtomValues?: Parameters<typeof HydrateAtoms>[0]["initialValues"];
}

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
            value={ projectScopeStore }
          >
            <HydrateAtoms initialValues={ initialAtomValues }>
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
