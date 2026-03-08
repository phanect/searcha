import {
  Button,
  Checkbox,
  Collapse,
  FormControlLabel,
  Grid2 as Grid,
  InputLabel,
} from "@mui/material";
import { projectIdAtom, ProjectScopeContext } from "@src/atoms/projectScope";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import { useAtom } from "jotai";
import { useContext, useState } from "react";
import { useWatch } from "react-hook-form";

import type { IFieldComponentProps } from "@phanect/searcha-form-builder";

type customizationOptions = "allRead" | "authRead" | "subcollections" | "user";

export type ISuggestedRulesProps = {} & IFieldComponentProps;

export default function SuggestedRules({
  useFormMethods: { control },
  label,
}: ISuggestedRulesProps) {
  const projectScopeStore = useContext(ProjectScopeContext);
  const [ projectId ] = useAtom(projectIdAtom, { store: projectScopeStore });

  const watched = useWatch({
    control,
    name: [ "collection", "roles", "readOnly" ],
  } as any);
  const [ collection, roles, readOnly ] = Array.isArray(watched) ? watched : [];
  const [ customized, setCustomized ] = useState<boolean>(false);
  const [ customizations, setCustomizations ] = useState<customizationOptions[]>(
    []
  );
  const handleChange
    = (option: customizationOptions) =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setCustomizations((prev) => {
          const set = new Set(prev || []);
          if (e.target.checked) {
            set.add(option);
          } else {
            set.delete(option);
          }
          return Array.from(set);
        });

  const generatedRules = `match /${ collection }/{${
    customizations.includes("subcollections") ? "document=**" : "docId"
  }} {
  allow read, write: if hasAnyRole(${
    readOnly ? "[\"ADMIN\"]" : JSON.stringify(roles)
  });${
    readOnly && roles.filter((r: string) => r !== "ADMIN").length > 0
      ? `\n  allow read: if hasAnyRole(${ JSON.stringify(
        roles.filter((r: string) => r !== "ADMIN")
      ) });`
      : ""
  }${
    customizations.includes("allRead")
      ? "\n  allow read: if true;"
      : customizations.includes("authRead")
        ? "\n  allow read: if request.auth != null;"
        : ""
  }${
    customizations.includes("user")
      ? `\n
  allow create: if request.auth != null;
  allow get, update, delete: if isDocOwner(userId);`
      : ""
  }
}`;

  return (
    <>
      <InputLabel sx={{ mb: 0.5, ml: 0.25 }}>{label}</InputLabel>
      <pre style={{ margin: 0, userSelect: "all", whiteSpace: "pre-wrap" }}>
        {generatedRules}
      </pre>

      <Collapse in={customized}>
        <Grid container>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={customizations.includes("allRead")}
                  onChange={handleChange("allRead")}
                />
              )}
              label="Anyone can read"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={customizations.includes("authRead")}
                  onChange={handleChange("authRead")}
                />
              )}
              label="All signed-in users can read"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={customizations.includes("user")}
                  onChange={handleChange("user")}
                />
              )}
              label="Users can create and edit docs"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={customizations.includes("subcollections")}
                  onChange={handleChange("subcollections")}
                />
              )}
              label="Same rules for all subcollections"
            />
          </Grid>
        </Grid>
      </Collapse>

      <Grid container spacing={1} style={{ marginTop: 0 }}>
        {!customized && (
          <Grid>
            <Button onClick={() => setCustomized(true)}>Customize…</Button>
          </Grid>
        )}
        <Grid>
          <Button onClick={() => navigator.clipboard.writeText(generatedRules)}>
            Copy to clipboard
          </Button>
        </Grid>
        <Grid>
          <Button
            href={`https://console.firebase.google.com/u/0/project/${ projectId }/firestore/rules`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Set rules in Firebase Console
            <InlineOpenInNewIcon />
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
