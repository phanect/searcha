import GoIcon from "@mui/icons-material/ChevronRight";
import DownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Link, Typography } from "@mui/material";
import { currentUserAtom, ProjectScopeContext } from "@src/atoms/projectScope";
import {
  tableSchemaAtom,
  TableScopeContext,
  tableSettingsAtom,
  updateTableSchemaAtom,
} from "@src/atoms/tableScope";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import Modal from "@src/components/Modal";

import { WIKI_LINKS } from "@src/constants/externalLinks";
import { deleteField } from "firebase/firestore";
import { useAtom } from "jotai";
import { useContext, useState } from "react";
import { sparkToExtensionObjects } from "./utils";

export type IExtensionMigrationProps = {
  handleClose: () => void;
  handleUpgradeComplete: () => void;
};

export default function ExtensionMigration({
  handleClose,
  handleUpgradeComplete,
}: IExtensionMigrationProps) {
  const projectScopeStore = useContext(ProjectScopeContext);
  const tableScopeStore = useContext(TableScopeContext);
  const [ currentUser ] = useAtom(currentUserAtom, { store: projectScopeStore });
  const [ tableSettings ] = useAtom(tableSettingsAtom, { store: tableScopeStore });
  const [ tableSchema ] = useAtom(tableSchemaAtom, { store: tableScopeStore });
  const [ updateTableSchema ] = useAtom(updateTableSchemaAtom, { store: tableScopeStore });

  const [ isSaved, setIsSaved ] = useState(false);
  const [ isUpgrading, setIsUpgrading ] = useState(false);

  const currentEditor = () => ({
    displayName: currentUser?.displayName ?? "Unknown user",
    photoURL: currentUser?.photoURL ?? "",
    lastUpdate: Date.now(),
  });

  const downloadSparkFile = () => {
    const tablePathTokens
      = tableSettings.collection.split("/").filter((_, i) =>
        // replace IDs with dash that appears at even indexes
        i % 2 === 0
      ) ?? [];
    const tablePath = tablePathTokens.join("-");

    // https://medium.com/front-end-weekly/text-file-download-in-react-a8b28a580c0d
    const element = document.createElement("a");
    const file = new Blob([ tableSchema.sparks ?? "" ], {
      type: "text/plain;charset=utf-8",
    });
    element.href = URL.createObjectURL(file);
    element.download = `sparks-${ tablePath }.ts`;
    document.body.appendChild(element);
    element.click();
    setIsSaved(true);
  };

  const upgradeToExtensions = async () => {
    setIsUpgrading(true);
    const extensionObjects = sparkToExtensionObjects(
      tableSchema.sparks ?? "[]",
      currentEditor()
    );
    console.log(extensionObjects);
    if (updateTableSchema) {
      await updateTableSchema({
        extensionObjects,
        sparks: deleteField() as any,
      });
    }
    setTimeout(handleUpgradeComplete, 500);
  };

  return (
    <Modal
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      disableBackdropClick
      disableEscapeKeyDown
      title="Welcome to Extensions"
      children={(
        <>
          <div>
            <Typography paragraph>
              It looks like you have Sparks configured for this table.
            </Typography>
            <Typography>
              Sparks have been revamped to Extensions, with a brand new UI. Your
              existing Sparks are not compatible with this change, but you can
              migrate your Sparks to Extensions.
            </Typography>
          </div>

          <div>
            <Typography variant="subtitle1" component="h3" gutterBottom>
              1. Back up existing Sparks
            </Typography>
            <Typography paragraph>
              Back up your existing Sparks to a .ts file.
            </Typography>
            <Button
              variant={isSaved ? "outlined" : "contained"}
              color={isSaved ? "secondary" : "primary"}
              onClick={downloadSparkFile}
              endIcon={<DownloadIcon />}
              style={{ width: "100%" }}
            >
              Save Sparks
            </Button>
          </div>

          <div>
            <Typography variant="subtitle1" component="h3" gutterBottom>
              2. Migrate Sparks to Extensions
            </Typography>

            <Typography gutterBottom>
              After the upgrade, Sparks will be removed from this table. You may
              need to make manual changes to your Extensions code.
            </Typography>

            <Link
              href={WIKI_LINKS.extensions}
              target="_blank"
              rel="noopener noreferrer"
              paragraph
              display="block"
            >
              Read the Extensions documentation
              <InlineOpenInNewIcon />
            </Link>

            <LoadingButton
              variant="contained"
              color="primary"
              loading={isUpgrading}
              loadingPosition="end"
              onClick={upgradeToExtensions}
              disabled={!isSaved || isUpgrading}
              endIcon={<GoIcon />}
              style={{ width: "100%" }}
            >
              Migrate to Extensions
            </LoadingButton>
          </div>
        </>
      )}
    />
  );
}
