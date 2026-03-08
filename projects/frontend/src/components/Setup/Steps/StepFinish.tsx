import ThumbDownIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOffIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffIcon from "@mui/icons-material/ThumbUpOffAlt";
import {
  Button,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";

import { analytics, logEvent } from "@src/analytics";
import { ProjectScopeContext } from "@src/atoms/projectScope";
import { SETTINGS } from "@src/config/dbPaths.ts";
import { ROUTES } from "@src/constants/routes";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import { doc, updateDoc } from "firebase/firestore";
import { useAtom } from "jotai";
import { useSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type {
  RadioGroupProps } from "@mui/material";
import type { ISetupStep } from "@src/components/Setup/SetupStep";

export default {
  id: "finish",
  layout: "centered",
  shortTitle: "Finish",
  title: "You’re all set up!",
  description:
    "You can now continue to Rowy and create a table from your Firestore collections.",
  body: StepFinish,
} as ISetupStep;

function StepFinish() {
  const projectScopeStore = useContext(ProjectScopeContext);
  const [ firebaseDb ] = useAtom(firebaseDbAtom, { store: projectScopeStore });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    updateDoc(doc(firebaseDb, SETTINGS), { setupCompleted: true });
  }, [ firebaseDb ]);
  const [ rating, setRating ] = useState<"up" | "down" | undefined>();

  const handleRate: RadioGroupProps["onChange"] = (e) => {
    setRating(e.target.value as typeof rating);
    logEvent(analytics, "setup_rating", { rating: e.target.value });
    enqueueSnackbar("Thanks for your feedback!");
  };

  return (
    <>
      <Stack
        component="fieldset"
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ appearance: "none", p: 0, m: 0, border: "none" }}
      >
        <Typography variant="body1" component="legend">
          How was your setup experience?
        </Typography>

        <RadioGroup
          style={{ flexDirection: "row" }}
          value={rating}
          onChange={handleRate}
        >
          <Radio
            checkedIcon={<ThumbUpIcon />}
            icon={<ThumbUpOffIcon />}
            inputProps={{ "aria-label": "Thumbs up" }}
            value="up"
            color="secondary"
            disabled={rating !== undefined}
          />
          <Radio
            checkedIcon={<ThumbDownIcon />}
            icon={<ThumbDownOffIcon />}
            inputProps={{ "aria-label": "Thumbs down" }}
            value="down"
            color="secondary"
            disabled={rating !== undefined}
          />
        </RadioGroup>
      </Stack>

      <Button
        variant="contained"
        color="primary"
        size="large"
        component={Link}
        to={ROUTES.auth}
      >
        Sign in to your Rowy project
      </Button>
    </>
  );
}
