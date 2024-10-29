import { useAtom } from "jotai";
import { useContext } from "react";

import { Grid2 as Grid, Typography, Button, Link, Divider } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Discord as DiscordIcon } from "@src/assets/icons";
import TwitterIcon from "@mui/icons-material/Twitter";

import Logo from "@src/assets/Logo";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import meta from "@root/package.json";
import { ProjectScopeContext, projectIdAtom } from "@src/atoms/projectScope";
import { EXTERNAL_LINKS } from "@src/constants/externalLinks";

export default function About() {
  const projectScopeStore = useContext(ProjectScopeContext);
  const [ projectId ] = useAtom(projectIdAtom, { store: projectScopeStore });

  return (
    <>
      <Logo
        style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
      />

      <div style={{ marginTop: 12 }}>
        <Grid container justifyContent="center" spacing={1}>
          <Grid>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<GitHubIcon viewBox="-1 -1 26 26" color="action" />}
              href={EXTERNAL_LINKS.gitHub}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Button>
          </Grid>

          <Grid>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<DiscordIcon color="action" />}
              href={EXTERNAL_LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
            </Button>
          </Grid>

          <Grid>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<TwitterIcon color="action" />}
              href={EXTERNAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </Button>
          </Grid>
        </Grid>
      </div>

      <Divider />

      <div>
        <Grid container spacing={1} alignItems="center" direction="row">
          <Grid>
            <Typography display="block" color="textSecondary">
              Rowy v{meta.version}
            </Typography>
          </Grid>
        </Grid>
      </div>

      <Divider />

      <div>
        <Grid
          container
          spacing={1}
          alignItems="baseline"
          justifyContent="space-between"
        >
          <Grid>
            <Typography>Firebase project: {projectId}</Typography>
          </Grid>

          <Grid>
            <Link
              href={`https://console.firebase.google.com/project/${ projectId }`}
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
            >
              Firebase Console
              <InlineOpenInNewIcon />
            </Link>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
