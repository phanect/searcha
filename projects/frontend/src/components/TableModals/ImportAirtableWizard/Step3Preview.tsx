import { Grid2 as Grid, styled } from "@mui/material";
import { tableSchemaAtom, TableScopeContext } from "@src/atoms/tableScope";
import Cell from "@src/components/Table/Mock/Cell";
import Column from "@src/components/Table/Mock/Column";

import { fieldParser } from "@src/components/TableModals/ImportAirtableWizard/utils";
import { useAtom } from "jotai";
import { find } from "lodash-es";
import { useContext } from "react";
import type { IStepProps } from ".";

const Spacer = styled(Grid)(({ theme }) => ({
  width: theme.spacing(3),
  height: theme.spacing(3),
  flexShrink: 0,
}));

const ColumnWrapper = styled(Grid)(() => ({
  width: 200,
  flexShrink: 0,
  marginLeft: -1,
  "&:first-of-type": { marginLeft: 0 },
}));

export default function Step3Preview({ airtableData, config }: IStepProps) {
  const tableScopeStore = useContext(TableScopeContext);
  const [ tableSchema ] = useAtom(tableSchemaAtom, { store: tableScopeStore });

  const columns = config.pairs.map(({ fieldKey, columnKey }) => ({
    fieldKey,
    columnKey,
    ...(tableSchema.columns?.[columnKey]
      ?? find(config.newColumns, { key: columnKey })
      ?? {}),
  }));

  return (
    <div style={{ minHeight: 300, height: "calc(100% - 80px)" }}>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "scroll",
        }}
      >
        <Grid
          container
          wrap="nowrap"
          sx={{ position: "sticky", top: 0, zIndex: 1 }}
        >
          {columns.map(({ key, name, type }) => (
            <ColumnWrapper key={key}>
              <Column label={name || ""} type={type} />
            </ColumnWrapper>
          ))}
          <Spacer />
        </Grid>

        <Grid container wrap="nowrap" style={{ flexGrow: 1 }}>
          {columns.map(({ fieldKey, name, columnKey, type }) => (
            <ColumnWrapper key={fieldKey}>
              {airtableData.records.map((record, i) => (
                <Cell
                  key={fieldKey + i}
                  field={columnKey}
                  value={fieldParser(type)?.(record.fields[fieldKey])}
                  type={type}
                  name={name}
                />
              ))}
              <Spacer />
            </ColumnWrapper>
          ))}
          <Spacer />
        </Grid>
      </div>
    </div>
  );
}
