import { useState } from 'react';
import { action } from '@storybook/addon-actions';

import {
  StyledEngineProvider,
  createTheme,
  ThemeProvider,
  type AutocompleteChangeReason,
} from '@mui/material';

import MultiSelect, { type MultiSelectProps } from '../src';
import { top100Films } from './data';
import type { Meta, StoryFn } from "@storybook/react";

const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'filled',
        size: 'small',
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'outlined',
        color: 'secondary',
      },
    },
  },
});

const meta: Meta<typeof MultiSelect> = {
  title: 'MultiSelect',
  component: MultiSelect,
  decorators: [
    (storyFn) => (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <div style={{ maxWidth: 600, margin: '40px auto' }}>{storyFn()}</div>
        </ThemeProvider>
      </StyledEngineProvider>
    ),
  ],
  args: {
    label: 'Movie',
    labelPlural: 'Movies',
    empty: false,
    options: top100Films,
    disabled: false,
    searchable: true,
    freeText: false,
    selectAll: true,
    clearable: true,
  },
};
export default meta;

export const Multiple: StoryFn<typeof MultiSelect> = (args) => {
  const [value, setValue] = useState<string[]>(['The Godfather']);

  const handleChange: MultiSelectProps<string>["onChange"] = (
    value: string[],
    reason: AutocompleteChangeReason
  ) => {
    setValue(value);
    action('Value changed')(value, reason);
  };

  return (
    <MultiSelect
      {...args}
      options={args.empty ? [] : args.options}
      value={value}
      onChange={handleChange}
      onOpen={action('Opened')}
      onClose={action('Closed')}
    />
  );
};
Multiple.args = { max: 3 };

export const Single: StoryFn<typeof MultiSelect> = (args) => {
  const [value, setValue] = useState<string>('The Godfather');

  const handleChange: MultiSelectProps<string>["onChange"] = (
    value: string | null,
    reason: AutocompleteChangeReason
  ) => {
    setValue(value);
    action('Value changed')(value, reason);
  };

  return (
    <MultiSelect
      {...args}
      options={args.empty ? [] : args.options}
      multiple={false}
      value={value}
      onChange={handleChange}
      onOpen={action('Opened')}
      onClose={action('Closed')}
    />
  );
};
