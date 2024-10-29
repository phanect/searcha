import { InputLabel, Grid2 as Grid, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";

import { createValueLabel } from "./utils/conditionListHelper";
import type { IConditionModal } from "./Settings";

type I_ConditionList = {
  config: Record<string, any>;
  setModal: React.Dispatch<React.SetStateAction<IConditionModal>>;
};

export default function ConditionList({ config, setModal }: I_ConditionList) {
  const conditions = config?.conditions ?? [];
  if (conditions?.length === 0) {
    return (
      <>
        No conditions set yet
        <br />
      </>
    );
  }
  return (
    <>
      <InputLabel>Conditions</InputLabel>
      {conditions.map((condition: any, index: number) => (
        <>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
          >
            <GridItem
              index={index}
              condition={condition}
              setModal={setModal}
            />
          </Grid>
          <Divider />
        </>
      ))}
    </>
  );
}

const GridItem = ({ condition, setModal, index }: any) => {
  if (!condition) {
    return <></>;
  }
  return (
    <>
      <span>{condition?.label}</span>
      <Grid>
        <span>{createValueLabel(condition)}</span>
        <IconButton
          onClick={() => setModal({ isOpen: true, condition, index })}
        >
          <EditIcon />
        </IconButton>
      </Grid>
    </>
  );
};
