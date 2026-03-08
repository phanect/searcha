import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import {
  ProjectScopeContext,
  themeAtom,
  themeOverriddenAtom,
} from "@src/atoms/projectScope";
import { useAtom } from "jotai";
import { merge } from "lodash-es";
import { useContext } from "react";

import type { IUserSettingsChildProps } from "@src/pages/Settings/UserSettingsPage";

export default function Theme({
  settings,
  updateSettings,
}: IUserSettingsChildProps) {
  const projectScopeStore = useContext(ProjectScopeContext);
  const [ theme, setTheme ] = useAtom(themeAtom, { store: projectScopeStore });
  const [ themeOverridden, setThemeOverridden ] = useAtom(
    themeOverriddenAtom,
    { store: projectScopeStore }
  );

  return (
    <>
      <FormControl
        component="fieldset"
        variant="standard"
        sx={{ my: -10 / 8, display: "flex" }}
      >
        <legend style={{ fontSize: 0 }}>Theme</legend>

        <RadioGroup
          value={themeOverridden ? theme : "system"}
          onChange={(e) => {
            if (e.target.value === "system") {
              setThemeOverridden(false);
            } else {
              setTheme(e.target.value as typeof theme);
              setThemeOverridden(true);
            }
          }}
        >
          <FormControlLabel
            control={<Radio />}
            value="system"
            label="Match system theme"
          />
          <FormControlLabel control={<Radio />} value="light" label="Light" />
          <FormControlLabel control={<Radio />} value="dark" label="Dark" />
        </RadioGroup>
      </FormControl>

      <Divider />

      <FormControlLabel
        control={(
          <Checkbox
            defaultChecked={Boolean(
              (settings.theme?.dark?.palette as any)?.darker
            )}
            onChange={(e) => {
              updateSettings({
                theme: merge(settings.theme, {
                  dark: { palette: { darker: e.target.checked }},
                }),
              });
            }}
          />
        )}
        label="Darker dark theme"
        style={{ marginLeft: -11, marginBottom: -10, marginTop: 13 }}
      />
    </>
  );
}
