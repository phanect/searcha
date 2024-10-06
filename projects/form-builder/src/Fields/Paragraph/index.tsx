import { lazy } from 'react';
import type { IFieldConfig } from '../../types';
import { FieldType } from '../../constants/fields';

import FormTextarea from 'mdi-material-ui/FormTextarea';

import Settings from './ParagraphSettings';
import { string } from "yup";
const Component = lazy(
  () =>
    import('./ParagraphComponent')
);

export const ParagraphConfig: IFieldConfig = {
  type: FieldType.paragraph,
  name: 'Paragraph',
  group: 'input',
  icon: <FormTextarea />,
  dataType: 'string',
  defaultValue: '',
  component: Component,
  settings: Settings,
  validation: (config) => {
    let schema = string().trim();

    if (typeof config.maxCharacters === 'number')
      schema = schema.max(
        config.maxCharacters,
        'You have reached the character limit',
      );

    return schema;
  },
};
export default ParagraphConfig;
