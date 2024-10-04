import { lazy } from 'react';
import { IFieldConfig } from '../../types';
import { FieldType } from '../../constants/fields';
import { string } from 'yup';

import FormatListNumbered from 'mdi-material-ui/FormatListNumbered';

import Settings from './ListSettings';
const Component = lazy(
  () => import('./ListComponent')
);

export const ListConfig: IFieldConfig = {
  type: FieldType.list,
  name: 'List',
  group: 'input',
  icon: <FormatListNumbered />,
  dataType: 'string[]',
  defaultValue: [],
  component: Component,
  settings: Settings,
  validation: (config: Record<string, any>) => {
    const validation: any[][] = [
      ['array'],
      ['of', string().trim()],
      ['ensure'],
      ['compact'],
    ];

    if (config.required === true)
      validation.push(['min', 1, `${config.label || config.name} is required`]);

    return validation;
  },
};
export default ListConfig;
