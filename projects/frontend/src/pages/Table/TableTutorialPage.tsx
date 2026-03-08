import { Box, Button, Typography } from "@mui/material";
import { Import as ImportIcon } from "@src/assets/icons";

import { currentUserAtom, ProjectScopeContext } from "@src/atoms/projectScope";
import {
  importCsvAtom,
  tableColumnsOrderedAtom,
  tableIdAtom,
  tableModalAtom,
  tableRowsAtom,
  tableSchemaAtom,
  TableScopeContext,
  tableSettingsAtom,
} from "@src/atoms/tableScope";
import { HydrateAtoms } from "@src/atoms/utils.ts";
import EmptyState from "@src/components/EmptyState";
import ErrorFallback from "@src/components/ErrorFallback";
import TableSkeleton from "@src/components/Table/TableSkeleton";
import TableModals from "@src/components/TableModals";
import TableToolbarSkeleton from "@src/components/TableToolbar/TableToolbarSkeleton";
import TableTutorial from "@src/components/TableTutorial";

import * as csvData from "@src/components/TableTutorial/data";
import {
  TableSourceTutorial,
  TUTORIAL_COLLECTION,
  TUTORIAL_TABLE_SCHEMA,
  TUTORIAL_TABLE_SETTINGS,
} from "@src/components/TableTutorial/TableSourceTutorial";
import { TOP_BAR_HEIGHT } from "@src/layouts/Navigation/TopBar";
import { useAtom, useSetAtom } from "jotai";
import { Suspense, useContext } from "react";
import { ErrorBoundary } from "react-error-boundary";
import TablePage from "./TablePage";

const tableScopeStore = useContext(TableScopeContext);

/**
 * Wraps `TablePage` with the data for a top-level table.
 */
export default function TableTutorialPage() {
  const projectScopeStore = useContext(ProjectScopeContext);

  const [ currentUser ] = useAtom(currentUserAtom, { store: projectScopeStore });

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense
        fallback={(
          <>
            <TableToolbarSkeleton />
            <TableSkeleton />
          </>
        )}
      >
        <TableScopeContext.Provider
          key={"tableScopeStore/" + TUTORIAL_COLLECTION}
          value={tableScopeStore}
        >
          <HydrateAtoms initialValues={[
            [ currentUserAtom, currentUser ],
            [ tableIdAtom, TUTORIAL_COLLECTION ],
            [ tableSettingsAtom, TUTORIAL_TABLE_SETTINGS ],
            [ tableSchemaAtom, TUTORIAL_TABLE_SCHEMA ],
          ]}
          >
            <TableSourceTutorial />
            <Suspense
              fallback={(
                <>
                  <TableToolbarSkeleton />
                  <TableSkeleton />
                </>
              )}
            >
              <Box
                component="main"
                sx={{
                  ".empty-state--full-screen, #empty-table": {
                    height: `calc(100vh - ${ TOP_BAR_HEIGHT }px - min(50vh, 440px)) !important`,
                  },
                  ".table-container > .rdg": {
                    paddingBottom:
                      "max(env(safe-area-inset-bottom), min(50vh, 440px))",
                    width: "100%",

                    ".rdg-row, .rdg-header-row": {
                      marginRight: "env(safe-area-inset-right)",
                    },
                  },
                }}
              >
                <Content />
                <TableTutorial />
              </Box>
            </Suspense>
          </HydrateAtoms>
        </TableScopeContext.Provider>
      </Suspense>
    </ErrorBoundary>
  );
}

function Content() {
  const [ tableColumnsOrdered ] = useAtom(tableColumnsOrderedAtom, { store: tableScopeStore });
  const [ tableRows ] = useAtom(tableRowsAtom, { store: tableScopeStore });
  const openTableModal = useSetAtom(tableModalAtom, { store: tableScopeStore });
  const setImportCsv = useSetAtom(importCsvAtom, { store: tableScopeStore });

  if (tableColumnsOrdered.length === 0 || tableRows.length === 0) {
    return (
      <EmptyState
        Icon={(() => null) as any}
        message="Get started"
        description={(
          <>
            <Typography>There is no data in this table.</Typography>

            <Typography>You can import our sample CSV file:</Typography>

            <Button
              variant="contained"
              color="primary"
              startIcon={<ImportIcon />}
              onClick={() => {
                setImportCsv({ importType: "csv", csvData });
                openTableModal("importCsv");
              }}
            >
              Import CSV
            </Button>

            <TableModals />
          </>
        )}
      />
    );
  }

  return <TablePage disableSideDrawer />;
}
