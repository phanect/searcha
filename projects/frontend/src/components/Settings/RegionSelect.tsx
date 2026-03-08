import { Grid2 as Grid } from "@mui/material";
import MultiSelect from "@phanect/searcha-multiselect";
import { Leaf as LeafIcon } from "@src/assets/icons";

import { CLOUD_RUN_REGIONS } from "@src/constants/regions";
import { sortBy } from "lodash-es";

const REGIONS = sortBy(CLOUD_RUN_REGIONS, [ "group", "value" ]);

export type ICloudRunRegionSelectProps = {
  value: string;
  onChange: (value: string) => void;
  [key: string]: any;
};

export default function CloudRunRegionSelect({
  value,
  onChange,
  ...props
}: ICloudRunRegionSelectProps) {
  return (
    <MultiSelect
      multiple={false}
      label="Region"
      labelPlural="regions"
      {...props}
      value={value}
      onChange={onChange}
      options={REGIONS}
      clearable={false}
      itemRenderer={(option: any) => (
        <Grid container spacing={0} sx={{ my: 0.5 }}>
          <Grid>
            {option.value}
          </Grid>
          <Grid>{option.city}</Grid>

          <Grid size={{ xs: 12 }} style={{ padding: 0 }} />

          <Grid sx={{ typography: "caption", color: "text.secondary" }}>
            Tier {option.pricingTier} pricing
          </Grid>
          {option.lowCO2 && (
            <Grid sx={{ typography: "caption", color: "text.secondary" }}>
              Low CO₂&nbsp;
              <LeafIcon
                color="success"
                fontSize="inherit"
                style={{ verticalAlign: "middle" }}
              />
            </Grid>
          )}
        </Grid>
      )}
      {...({
        AutocompleteProps: { groupBy: (option: any) => option.group },
      } as any)}
    />
  );
}
