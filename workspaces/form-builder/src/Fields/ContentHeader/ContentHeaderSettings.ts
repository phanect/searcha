import { FieldType } from "../../constants/fields";
import type { IFieldConfig } from "../../types";

export const ContentHeaderSettings: IFieldConfig["settings"] = [
  {
    name: "label",
    label: "Header",
    type: FieldType.shortText,
    required: true,
    defaultValue: "",
  },
];

export default ContentHeaderSettings;
