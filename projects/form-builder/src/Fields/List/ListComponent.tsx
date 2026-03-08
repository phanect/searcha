import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button, FormControl } from "@mui/material";
import { arrayMoveImmutable } from "array-move";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import ListItem from "./ListItem";

import FieldAssistiveText from "../../FieldAssistiveText";
import FieldErrorMessage from "../../FieldErrorMessage";
import FieldLabel from "../../FieldLabel";
import type { ButtonProps } from "@mui/material";
import type { IFieldComponentProps } from "../../types";

export type IListComponentProps = {
  itemLabel?: string;
  placeholder?: string;
  addButtonProps?: Partial<ButtonProps>;
} & IFieldComponentProps;

export default function ListComponent({
  field: { onChange, value: valueProp, ref },

  name,
  useFormMethods,

  label,
  errorMessage,
  assistiveText,

  required,
  disabled,

  itemLabel = "Item",
  placeholder,
  addButtonProps = {},
}: IListComponentProps) {
  const value: string[] = Array.isArray(valueProp) ? valueProp : [];
  const add = () => onChange([ ...value, "" ]);

  const edit = (index: number) => (item: string) => {
    const newValue = [ ...useFormMethods.getValues(name) ];
    newValue[index] = item;
    onChange(newValue);
  };

  const swap = (fromIndex: number, toIndex: number) => {
    const newValue = arrayMoveImmutable(
      useFormMethods.getValues(name),
      fromIndex,
      toIndex
    );
    onChange(newValue);
  };

  const remove = (index: number) => () => {
    const newValue = [ ...useFormMethods.getValues(name) ];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <FormControl
      component="fieldset"
      style={{ display: "flex" }}
      data-type="text-list"
      data-label={label ?? ""}
      error={!!errorMessage}
      disabled={disabled}
      ref={ref as any}
      tabIndex={-1}
    >
      <FieldLabel
        error={!!errorMessage}
        disabled={!!disabled}
        required={!!required}
      >
        {label}
      </FieldLabel>

      <DndProvider backend={HTML5Backend} context={window}>
        {value.map((item, index) => (
          <ListItem
            key={index}
            name={name}
            index={index}
            item={item}
            edit={edit(index)}
            swap={swap}
            remove={remove(index)}
            itemLabel={itemLabel}
            placeholder={placeholder}
            disabled={disabled}
          />
        ))}
      </DndProvider>

      <div>
        <Button
          startIcon={(
            <AddCircleIcon
              sx={{ mr: 2, "&:first-child": { fontSize: "1.5rem" }}}
            />
          )}
          color="secondary"
          {...addButtonProps}
          onClick={add}
          sx={[
            { m: 0, ml: -0.5 },
            ...(Array.isArray(addButtonProps.sx)
              ? addButtonProps.sx
              : addButtonProps.sx
                ? [ addButtonProps.sx ]
                : []),
          ]}
          disabled={disabled}
        >
          Add {itemLabel}
        </Button>
      </div>

      <FieldErrorMessage>{errorMessage}</FieldErrorMessage>
      <FieldAssistiveText disabled={!!disabled}>
        {assistiveText}
      </FieldAssistiveText>
    </FormControl>
  );
}
