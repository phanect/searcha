import Text from "mdi-material-ui/Text";
import { lazy } from "react";
import Settings from "./ContentParagraphSettings";
import { FieldType } from "../../constants/fields";

import type { IFieldConfig } from "../../types";
const Component = lazy(
  () =>
    import(
      "./ContentParagraphComponent"
    )
);

export const ContentParagraphConfig: IFieldConfig = {
  type: FieldType.contentParagraph,
  name: "Paragraph",
  group: "content",
  icon: <Text />,
  dataType: "undefined",
  defaultValue: undefined,
  component: Component,
  settings: Settings,
};
export default ContentParagraphConfig;
