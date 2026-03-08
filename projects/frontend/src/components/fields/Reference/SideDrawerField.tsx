import LaunchIcon from "@mui/icons-material/Launch";
import { IconButton, Stack, TextField } from "@mui/material";

import { projectIdAtom, ProjectScopeContext } from "@src/atoms/projectScope";
import { getFieldId } from "@src/components/SideDrawer/utils";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import { doc } from "firebase/firestore";
import { useAtom } from "jotai";
import { useContext, useState } from "react";
import type { ISideDrawerFieldProps } from "@src/components/fields/types";

export default function Reference({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  const projectScopeStore = useContext(ProjectScopeContext);
  const [ projectId ] = useAtom(projectIdAtom, { store: projectScopeStore });
  const [ firebaseDb ] = useAtom(firebaseDbAtom, { store: projectScopeStore });

  const [ localValue, setLocalValue ] = useState(
    Boolean(value) && "path" in value && typeof value.path === "string"
      ? value.path
      : ""
  );
  const [ error, setError ] = useState("");

  return (
    <Stack direction="row" alignItems="flex-start">
      <TextField
        variant="filled"
        fullWidth
        margin="none"
        onChange={(e) => {
          try {
            doc(firebaseDb, e.target.value);
            setError("");
          } catch (e: any) {
            setError(e.message);
          }
          setLocalValue(e.target.value);
        }}
        onBlur={() => {
          if (!error) {
            onChange(doc(firebaseDb, localValue));
            onSubmit();
          }
        }}
        value={localValue}
        error={Boolean(error)}
        helperText={error}
        id={getFieldId(column.key)}
        label=""
        hiddenLabel
        disabled={disabled}
      />

      <IconButton
        size="small"
        href={`https://console.firebase.google.com/project/${ projectId }/firestore/data/~2F${ localValue.replace(
          /\//g,
          "~2F"
        ) }`}
        target="_blank"
        rel="noopener"
        aria-label="Open in Firebase Console"
        disabled={Boolean(error) || !localValue}
        edge="end"
        sx={{ ml: 1 }}
      >
        <LaunchIcon />
      </IconButton>
    </Stack>
  );
}
