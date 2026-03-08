import { Grid2 as Grid, styled } from "@mui/material";
import { tableRowsAtom, TableScopeContext } from "@src/atoms/tableScope";
import Cell from "@src/components/Table/Mock/Cell";
import Column from "@src/components/Table/Mock/Column";

import { useAtom } from "jotai";
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

export default function Step4Preview({ config }: IStepProps) {
  const tableScopeStore = useContext(TableScopeContext);
  const [ tableRows ] = useAtom(tableRowsAtom, { store: tableScopeStore });

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
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          {Object.entries(config).map(([ , { name, type }]) => (
            <ColumnWrapper>
              <Column label={name} type={type} />
            </ColumnWrapper>
          ))}
          <Spacer />
        </Grid>

        <Grid container wrap="nowrap" style={{ flexGrow: 1 }}>
          {Object.entries(config).map(([ field, { name, type }]) => (
            <ColumnWrapper>
              {tableRows.slice(0, 20).map((row) => (
                <Cell
                  key={`${ field }--${ row._rowy_ref.path }`}
                  field={field}
                  value={row[field]}
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
