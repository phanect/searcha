import { find } from "lodash-es";

import ShortText from "./ShortText";
import Paragraph from "./Paragraph";
import Date from "./Date";
import DateTime from "./DateTime";
import Checkbox from "./Checkbox";
import Radio from "./Radio";
import SingleSelect from "./SingleSelect";
import MultiSelect from "./MultiSelect";
import Slider from "./Slider";
import List from "./List";
import Color from "./Color";
import Score from "./Score";
import Hidden from "./Hidden";

import ContentHeader from "./ContentHeader";
import ContentSubHeader from "./ContentSubHeader";
import ContentParagraph from "./ContentParagraph";
import ContentImage from "./ContentImage";
import type { IFieldConfig } from "../types";
import type { FieldType } from "../constants/fields.ts";

export const FieldConfigs: IFieldConfig[] = [
  ShortText,
  Paragraph,
  Date,
  DateTime,
  Checkbox,
  Radio,
  SingleSelect,
  MultiSelect,
  Slider,
  List,
  Color,
  Score,
  Hidden,

  ContentHeader,
  ContentSubHeader,
  ContentParagraph,
  ContentImage,
];

/**
 * Returns specific property of field config
 * @param prop
 * @param fieldType
 */
export const getFieldProp = <Prop extends keyof IFieldConfig>(
  prop: Prop,
  fieldType: FieldType,
): IFieldConfig[Prop] | undefined => {
  const field = find(FieldConfigs, { type: fieldType });
  return field?.[prop];
};
