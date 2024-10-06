import { lazy } from 'react';
import { number } from "yup";
import { IFieldConfig } from '../../types';
import { FieldType } from '../../constants/fields';

import GestureSwipeHorizontal from 'mdi-material-ui/GestureSwipeHorizontal';

import Settings from './SliderSettings';
const Component = lazy(
  () => import('./SliderComponent')
);

export const SliderConfig: IFieldConfig = {
  type: FieldType.slider,
  name: 'Slider',
  group: 'input',
  icon: <GestureSwipeHorizontal />,
  dataType: 'number',
  defaultValue: 0,
  component: Component,
  settings: Settings,
  validation: (config) => {
    let schema = number();

    if (typeof config.min === 'number')
      schema = schema.min(
        config.min,
        'Please use the slider to set the value',
      );

    if (typeof config.max === 'number')
      schema = schema.max(
        config.max,
        'Please use the slider to set the value',
      );

    return schema;
  },
};
export default SliderConfig;
