import { FieldType } from "../../constants/fields";
import type { IFieldConfig } from "../../types";

export const HiddenSettings: IFieldConfig["settings"] = [
  {
    type: FieldType.shortText,
    name: "defaultValue",
    label: "Persistent Value",
    required: true,
    defaultValue: "",
    assistiveText:
      "This value will always be submitted as part of the form. It cannot be edited by the user.",
  },
  {
    type: FieldType.checkbox,
    name: "disablePadding",
    label: "Disable padding",
    defaultValue: true,
    required: true,
  },
];

export default HiddenSettings;
