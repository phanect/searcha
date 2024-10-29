import { FieldType } from "../../constants/fields";
import type { IFieldConfig } from "../../types";

export const ContentParagraphSettings: IFieldConfig["settings"] = [
  {
    name: "label",
    label: "Paragraph",
    type: FieldType.paragraph,
    required: true,
    defaultValue: "",
  },
];

export default ContentParagraphSettings;
