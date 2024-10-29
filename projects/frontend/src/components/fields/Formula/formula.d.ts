type RowRef<T> = { id: string; path: string; parent: T; };
type Ref = {} & RowRef<Ref>;

type FormulaContext = {
  row: Row;
  ref: Ref;
};

type Formula = (context: FormulaContext) => "PLACEHOLDER_OUTPUT_TYPE";
