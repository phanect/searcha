import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Checkbox,
  Grid2 as Grid,
  InputAdornment,
  List,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Radio,
  TextField,
  Typography,
} from "@mui/material";

import { ProjectScopeContext, rowyRunAtom } from "@src/atoms/projectScope";
import { TableScopeContext, tableSettingsAtom } from "@src/atoms/tableScope";
import { getLabel } from "@src/components/fields/Connector/utils";
import Loading from "@src/components/Loading";
import { getTableSchemaPath } from "@src/utils/table";
import { useAtom } from "jotai";
import { get } from "lodash-es";
import { useSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { IConnectorSelectProps } from ".";

export type IPopupContentsProps = {} & Omit<IConnectorSelectProps, "className" | "TextFieldProps">;

// TODO: Implement infinite scroll here
export default function PopupContents({
  value = [],
  onChange,
  column,
  _rowy_ref,
}: IPopupContentsProps) {
  const projectScopeStore = useContext(ProjectScopeContext);
  const tableScopeStore = useContext(TableScopeContext);
  const [ rowyRun ] = useAtom(rowyRunAtom, { store: projectScopeStore });
  const [ tableSettings ] = useAtom(tableSettingsAtom, { store: tableScopeStore });

  const { enqueueSnackbar } = useSnackbar();
  // const url = config.url ;
  const { config } = column;
  const elementId = config.elementId;
  const multiple = Boolean(config.multiple);

  // Webservice search query
  const [ query, setQuery ] = useState("");
  // Webservice response
  const [ response, setResponse ] = useState<any | null>(null);
  const [ hits, setHits ] = useState<any[]>([]);

  useEffect(() => {
    console.log(response);
    if (response?.success === false) {
      enqueueSnackbar(response.message, { variant: "error" });
    } else if (Array.isArray(response?.hits)) {
      setHits(response.hits);
    } else {
      setHits([]);
      // enqueueSnackbar("response is not any array", { variant: "error" });
    }
  }, [ response ]);
  const search = useDebouncedCallback(
    async (query: string) => {
      const resp = await rowyRun!({
        route: { method: "POST", path: "/connector" },
        body: {
          columnKey: column.key,
          query: query,
          schemaDocPath: getTableSchemaPath(tableSettings),
          rowDocPath: _rowy_ref.path,
        },
      });
      setResponse(resp);
    },
    1000,
    { leading: true }
  );

  useEffect(() => {
    search(query);
  }, [ query ]);

  if (!response) {
    return <Loading />;
  }

  const select = (hit: any) => () => {
    if (multiple) {
      onChange([ ...value, hit ]);
    } else {
      onChange([ hit ]);
    }
  };
  const deselect = (hit: any) => () => {
    if (multiple) {
      onChange(value.filter((v) => v[elementId] !== hit[elementId]));
    } else {
      onChange([]);
    }
  };

  const selectedValues = value?.map((item) => get(item, elementId));

  const clearSelection = () => onChange([]);

  return (
    <Grid container direction="column" sx={{ p: 1, height: "100%" }}>
      <Grid>
        <TextField
          value={query}
          type="search"
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
          variant="filled"
          // label="Search items"
          hiddenLabel
          placeholder="Search items"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ className: "visually-hidden" }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        />
      </Grid>

      <Grid>
        <List sx={{ overflowY: "auto" }}>
          {hits.map((hit) => {
            const isSelected = selectedValues?.some(
              (v) => v === hit[elementId]
            );
            return (
              <MenuItem
                key={get(hit, elementId)}
                onClick={isSelected ? deselect(hit) : select(hit)}
                disabled={!isSelected && multiple && value.length >= config.max}
                disableGutters
                style={{ margin: 0, width: "100%" }}
              >
                <ListItemIcon>
                  {multiple ? (
                    <Checkbox
                      edge="start"
                      checked={isSelected}
                      tabIndex={-1}
                      color="secondary"
                      disableRipple
                      inputProps={{
                        "aria-labelledby": `label-${ get(hit, elementId) }`,
                      }}
                      sx={{ py: 0 }}
                    />
                  ) : (
                    <Radio
                      edge="start"
                      checked={isSelected}
                      tabIndex={-1}
                      color="secondary"
                      disableRipple
                      inputProps={{
                        "aria-labelledby": `label-${ get(hit, elementId) }`,
                      }}
                      sx={{ py: 0 }}
                    />
                  )}
                </ListItemIcon>
                <ListItemText
                  id={`label-${ get(hit, elementId) }`}
                  primary={getLabel(config, hit)}
                />
              </MenuItem>
            );
          })}
        </List>
      </Grid>

      {multiple && (
        <Grid>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="button" color="textSecondary" sx={{ ml: 1 }}>
              {value?.length} of {hits?.length}
            </Typography>

            <Button
              disabled={!value || value.length === 0}
              onClick={clearSelection}
              color="primary"
              variant="text"
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
