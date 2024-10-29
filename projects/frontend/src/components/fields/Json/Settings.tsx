import { Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import type { ISettingsProps } from "@src/components/fields/types";

const Settings = ({ config, onChange }: ISettingsProps) => (
  <>
    <FormControlLabel
      control={(
        <Checkbox
          checked={config.isArray}
          onChange={() => onChange("isArray")(!config.isArray)}
          name="isArray"
        />
      )}
      label={(
        <>
          Default as array
          <FormHelperText>
            You can still set individual field values as a JSON object or
            array using the code editor
          </FormHelperText>
        </>
      )}
    />
  </>
);
export default Settings;
