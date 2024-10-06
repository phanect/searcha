import { UseFormReturn, UseControllerReturn } from 'react-hook-form';
import { FieldType } from './constants/fields';
import { GridProps } from '@mui/material';
import type { Flags, Schema } from "yup";

export type SchemaFunction = (config: Record<string, unknown>) => Schema<unknown, unknown, unknown, Flags>;

export type Field = {
  type: FieldType;
  name?: string;

  label?: string | JSX.Element;
  assistiveText?: string | JSX.Element;

  conditional?: 'check' | 'option';
  displayCondition?: string;
  required?: boolean;
  disabled?: boolean;
  validation?: Schema;

  defaultValue?: any;
  gridCols?:
    | GridProps['xs']
    | Pick<GridProps, 'xs' | 'sm' | 'md' | 'lg' | 'xl'>;
  disablePadding?: boolean;
  disablePaddingTop?: boolean;

  [key: string]: any;
};
export type Fields = Field[];

export interface IFieldComponentProps extends UseControllerReturn {
  index: number;
  name: string;
  useFormMethods: UseFormReturn;

  label: string | JSX.Element;
  errorMessage?: string;
  assistiveText?: string | JSX.Element;

  required?: boolean;
  disabled?: boolean;

  [key: string]: any;
}

export type CustomComponent<
  P extends IFieldComponentProps = IFieldComponentProps
> = React.ComponentType<P> | React.LazyExoticComponent<React.ComponentType<P>>;

export type CustomComponents<
  P extends IFieldComponentProps = IFieldComponentProps
> = {
  [type: string]: {
    component: CustomComponent<P>;
    defaultValue?: any;
    validation?: Schema;
  };
};

export interface IFieldConfig<
  P extends IFieldComponentProps = IFieldComponentProps
> {
  type: FieldType;
  name: string;
  group: 'input' | 'content';
  icon: React.ReactNode;
  dataType: string;
  defaultValue: unknown;
  component: CustomComponent<P>;
  settings: Fields;
  validation?: SchemaFunction;
}
