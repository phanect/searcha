import Image from "mdi-material-ui/Image";
import { lazy } from "react";
import Settings from "./ContentImageSettings";
import { FieldType } from "../../constants/fields";

import type { IFieldConfig } from "../../types";
const Component = lazy(
  () =>
    import(
      "./ContentImageComponent"
    )
);

export const ContentImageConfig: IFieldConfig = {
  type: FieldType.contentImage,
  name: "Image",
  group: "content",
  icon: <Image />,
  dataType: "undefined",
  defaultValue: undefined,
  component: Component as any,
  settings: Settings,
};
export default ContentImageConfig;
