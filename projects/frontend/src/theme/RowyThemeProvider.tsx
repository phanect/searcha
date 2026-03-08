import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import Favicon from "@src/assets/Favicon";
import {
  customizedThemesAtom,
  ProjectScopeContext,
  themeAtom,
  themeOverriddenAtom,
} from "@src/atoms/projectScope";
import { useAtom } from "jotai";
import { useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router-dom";

/**
 * Injects the MUI theme with customizations from project and user settings.
 * Also adds dark mode support.
 * @param root0
 * @param root0.children
 */
export default function RowyThemeProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const projectScopeStore = useContext(ProjectScopeContext);

  const [ theme, setTheme ] = useAtom(themeAtom, { store: projectScopeStore });
  const [ themeOverridden ] = useAtom(themeOverriddenAtom, { store: projectScopeStore });
  const [ customizedThemes ] = useAtom(customizedThemesAtom, { store: projectScopeStore });

  // Infer theme based on system settings
  const prefersDarkTheme = useMediaQuery("(prefers-color-scheme: dark)", {
    noSsr: true,
  });

  // Update theme when system settings change
  useEffect(() => {
    if (themeOverridden) {
      return;
    }
    setTheme(prefersDarkTheme ? "dark" : "light");
  }, [ prefersDarkTheme, themeOverridden, setTheme ]);

  // Sync theme to body data-theme attribute for Feedback Fin
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [ theme ]);

  const fontCssUrls = customizedThemes[theme].typography.fontCssUrls;

  return (
    <>
      {Array.isArray(fontCssUrls) && (
        <Helmet>
          {fontCssUrls!.map((url) => (
            <link key={url} rel="stylesheet" href={url} />
          ))}
        </Helmet>
      )}

      <ThemeProvider theme={customizedThemes[theme]}>
        <Favicon />
        <CssBaseline />
        {children}
        <Outlet />
      </ThemeProvider>
    </>
  );
}
