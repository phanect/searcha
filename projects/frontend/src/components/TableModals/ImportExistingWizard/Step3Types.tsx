import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { ButtonBase, Divider, Grid2 as Grid, Typography } from "@mui/material";

import { tableRowsAtom, TableScopeContext } from "@src/atoms/tableScope";
import FieldsDropdown from "@src/components/ColumnModals/FieldsDropdown";
import Cell from "@src/components/Table/Mock/Cell";
import Column from "@src/components/Table/Mock/Column";
import ScrollableList from "@src/components/TableModals/ScrollableList";

import { FieldType } from "@src/constants/fields";
import { useAtom } from "jotai";
import { useContext, useState } from "react";
import { SELECTABLE_TYPES } from "./utils";
import type { IStepProps } from ".";

export default function Step3Types({ config, updateConfig, isXs }: IStepProps) {
  const tableScopeStore = useContext(TableScopeContext);
  const [ tableRows ] = useAtom(tableRowsAtom, { store: tableScopeStore });

  const [ fieldToEdit, setFieldToEdit ] = useState(Object.keys(config)[0]);
  const handleChange = (v: FieldType) =>
    updateConfig({ [fieldToEdit]: { type: v }});

  return (
    <div>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle2" gutterBottom component="h2">
            Table columns
          </Typography>
          <Divider />

          <ScrollableList>
            {Object.entries(config).map(([ field, { name, type }]) => (
              <li key={field}>
                <ButtonBase
                  onClick={() => setFieldToEdit(field)}
                  aria-label={`Edit column ${ field }`}
                  focusRipple
                  sx={{ width: "100%", textAlign: "left" }}
                >
                  <Column
                    label={name}
                    type={type}
                    active={field === fieldToEdit}
                    secondaryItem={
                      field === fieldToEdit && <ChevronRightIcon />
                    }
                  />
                </ButtonBase>
              </li>
            ))}
          </ScrollableList>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            variant="subtitle2"
            noWrap
            component="h2"
            sx={{ mt: 52 / 8, mx: 0, mb: 1 }}
          >
            Column type: {config[fieldToEdit].name}
          </Typography>

          <FieldsDropdown
            value={config[fieldToEdit].type}
            onChange={handleChange}
            hideLabel
            options={SELECTABLE_TYPES}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {!isXs && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" gutterBottom component="h2">
              Raw data
            </Typography>
          </Grid>
        )}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle2" gutterBottom component="h2">
            Column preview
          </Typography>
        </Grid>
      </Grid>

      <ScrollableList listSx={{ pt: 0 }}>
        <Grid
          container
          spacing={3}
          style={{ position: "sticky", top: 0, zIndex: 1, marginTop: 0 }}
        >
          {!isXs && (
            <Grid size={{ xs: 12, sm: 6 }} style={{ paddingTop: 0 }}>
              <Column label={fieldToEdit} />
            </Grid>
          )}
          <Grid size={{ xs: 12, sm: 6 }} style={{ paddingTop: 0 }}>
            <Column
              label={config[fieldToEdit].name}
              type={config[fieldToEdit].type}
            />
          </Grid>
        </Grid>

        {tableRows.slice(0, 20).map((row) => (
          <Grid container key={row.id} wrap="nowrap">
            {!isXs && (
              <Grid style={{ overflow: "hidden" }}>
                <Cell
                  field={fieldToEdit}
                  value={(JSON.stringify(row[fieldToEdit]) || "")
                    .replace(/^"/, "")
                    .replace(/"$/, "")}
                  type={FieldType.shortText}
                />
              </Grid>
            )}

            {!isXs && <Grid sx={{ width: (theme) => theme.spacing(3) }} />}

            <Grid style={{ overflow: "hidden" }}>
              <Cell
                field={fieldToEdit}
                value={row[fieldToEdit]}
                type={config[fieldToEdit].type}
                name={config[fieldToEdit].name}
              />
            </Grid>
          </Grid>
        ))}
      </ScrollableList>
    </div>
  );
}
