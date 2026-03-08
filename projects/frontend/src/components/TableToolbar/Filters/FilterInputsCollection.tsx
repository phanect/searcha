import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";

import { generateId } from "@src/utils/table";
import { find } from "lodash-es";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import FilterInputs from "./FilterInputs";
import type { TableFilter } from "@src/types/table";
import type { useFilterInputs } from "./useFilterInputs";

export type IFilterInputsCollectionProps = {
  disabled?: boolean;
} & ReturnType<typeof useFilterInputs>;

export default function FilterInputsCollection({
  filterColumns,
  selectedColumns,
  handleColumnChange,
  availableFiltersForEachSelectedColumn,
  queries,
  setQueries,
  disabled,
  joinOperator,
  setJoinOperator,
}: IFilterInputsCollectionProps) {
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    setQueries((prevQueries) => {
      const newQueries = [ ...prevQueries ];
      const [ reorderedItem ] = newQueries.splice(result.source.index, 1);
      newQueries.splice(result.destination.index, 0, reorderedItem);
      return newQueries;
    });
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="items">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {queries.map((query, index) => (
                <Draggable
                  key={query.id}
                  draggableId={query.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <FilterInputs
                        filterColumns={filterColumns}
                        selectedColumn={selectedColumns[index]}
                        handleChangeColumn={(key: string) => {
                          handleColumnChange(query.id, key);
                        }}
                        availableFilters={
                          availableFiltersForEachSelectedColumn[index]
                        }
                        query={query}
                        setQuery={(newQuery: TableFilter) => {
                          setQueries((prevQueries) => {
                            const newQueries = [ ...prevQueries ];
                            newQueries[index] = newQuery;
                            return newQueries;
                          });
                        }}
                        disabled={disabled}
                        joinOperator={joinOperator}
                        setJoinOperator={setJoinOperator}
                        handleDelete={() => {
                          setQueries((prevQueries) => {
                            const newQueries = [ ...prevQueries ];
                            newQueries.splice(index, 1);
                            return newQueries;
                          });
                        }}
                        index={index}
                        noOfQueries={queries.length}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          const column = find(filterColumns, (column) => !find(selectedColumns, { key: column.key }));

          const id = generateId();

          setQueries((prevQueries) => [
            ...prevQueries,
            {
              key: "",
              operator: "is-not-empty",
              value: "",
              id,
            },
          ]);

          handleColumnChange(id, column?.key ?? filterColumns[0].key);
        }}
        startIcon={<AddIcon />}
      >
        Add Filter
      </Button>
    </>
  );
}
