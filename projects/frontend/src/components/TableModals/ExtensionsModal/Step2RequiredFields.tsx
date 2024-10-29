import { Typography } from "@mui/material";
import ColumnSelect from "@src/components/Table/ColumnSelect";

import { FieldType } from "@src/constants/fields";
import type { IExtensionModalStepProps } from "./ExtensionModal";

export default function Step2RequiredFields({
  extensionObject,
  setExtensionObject,
}: IExtensionModalStepProps) {
  return (
    <>
      <Typography gutterBottom>
        Optionally, select fields that must have a value set for the extension
        to be triggered for that row
      </Typography>

      <ColumnSelect
        aria-label="Required fields"
        label=" "
        multiple
        value={extensionObject.requiredFields}
        filterColumns={(c) => c.type !== FieldType.id}
        showFieldNames
        onChange={(requiredFields: string[]) =>
          setExtensionObject((e) => ({ ...e, requiredFields }))}
        TextFieldProps={{ autoFocus: true }}
        freeText
        AddButtonProps={{ children: "Add other field…" }}
        AddDialogProps={{
          title: "Add other field",
          textFieldLabel: "Field key",
        }}
      />
    </>
  );
}
