import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import FilterIcon from "@mui/icons-material/FilterList";
import WebhookIcon from "@mui/icons-material/Webhook";
import { Button, Stack, Tooltip, Typography } from "@mui/material";
import {
  CloudLogs as CloudLogsIcon,
  Export as ExportIcon,
  Extension as ExtensionIcon,
  Import as ImportIcon,
} from "@src/assets/icons";

import {
  altPressAtom,
  compatibleRowyRunVersionAtom,
  confirmDialogAtom,
  ProjectScopeContext,
  projectSettingsAtom,
  rowyRunModalAtom,
  userRolesAtom,
} from "@src/atoms/projectScope";
import {
  deleteRowAtom,
  serverDocCountAtom,
  tableModalAtom,
  tableSchemaAtom,
  TableScopeContext,
  tableSettingsAtom,
  tableSortsAtom,
} from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
import { useAtom, useSetAtom } from "jotai";
import { lazy, Suspense, useContext } from "react";

import AddRow, { AddRowArraySubTable } from "./AddRow";
import HiddenFields from "./HiddenFields";
import LoadedRowsStatus from "./LoadedRowsStatus";
import RowHeight from "./RowHeight";
import TableInformation from "./TableInformation";
import TableSettings from "./TableSettings";
import TableToolbarButton from "./TableToolbarButton";
import { ButtonSkeleton } from "./TableToolbarSkeleton";
import type { TableToolsType } from "@src/types/table";
import type { RowSelectionState } from "@tanstack/react-table";

const Sort = lazy(() => import("./Sort"));

const Filters = lazy(() => import("./Filters"));
const ImportData = lazy(() => import("./ImportData/ImportData"));

const ReExecute = lazy(() => import("./ReExecute"));

export const TABLE_TOOLBAR_HEIGHT = 44;

const StyledStack = ({ children }: React.PropsWithChildren) => (
  <Stack
    direction="row"
    alignItems="center"
    spacing={1}
    sx={{
      pl: (theme) => `max(env(safe-area-inset-left), ${ theme.spacing(2) })`,
      pb: 1.5,
      height: TABLE_TOOLBAR_HEIGHT,
      scrollbarWidth: "thin",
      overflowX: "auto",
      "&": { overflowX: "overlay" },
      overflowY: "hidden",
      "& > *": { flexShrink: 0 },

      "& > .end-spacer": {
        width: (theme) =>
          `max(env(safe-area-inset-right), ${ theme.spacing(2) })`,
        height: "100%",
        ml: 0,
      },
    }}
  >
    {children}
  </Stack>
);

function RowSelectedToolBar({
  selectedRows,
  resetSelectedRows,
}: {
  selectedRows: RowSelectionState;
  resetSelectedRows: () => void;
}) {
  const projectScopeStore = useContext(ProjectScopeContext);
  const tableScopeStore = useContext(TableScopeContext);
  const [ serverDocCount ] = useAtom(serverDocCountAtom, { store: tableScopeStore });
  const deleteRow = useSetAtom(deleteRowAtom, { store: tableScopeStore });
  const [ altPress ] = useAtom(altPressAtom, { store: projectScopeStore });
  const confirm = useSetAtom(confirmDialogAtom, { store: projectScopeStore });

  const handleDelete = async () => {
    await deleteRow({ path: Object.keys(selectedRows) });
    resetSelectedRows();
  };

  return (
    <StyledStack>
      <Typography>
        {Object.values(selectedRows).length} of {serverDocCount} rows selected
      </Typography>
      <Tooltip title="Delete row">
        <Button
          variant="outlined"
          startIcon={<DeleteIcon fontSize="small" />}
          color="error"
          onClick={
            altPress
              ? handleDelete
              : () => {
                confirm({
                  title: `Delete ${
                    Object.values(selectedRows).length
                  } of ${ serverDocCount } selected rows?`,
                  confirm: "Delete",
                  confirmColor: "error",
                  handleConfirm: handleDelete,
                });
              }
          }
        >
          Delete
        </Button>
      </Tooltip>
    </StyledStack>
  );
}

export default function TableToolbar({
  disabledTools,
  selectedRows,
  resetSelectedRows,
}: {
  disabledTools?: TableToolsType[];
  selectedRows?: RowSelectionState;
  resetSelectedRows?: () => void;
}) {
  const projectScopeStore = useContext(ProjectScopeContext);
  const tableScopeStore = useContext(TableScopeContext);
  const [ projectSettings ] = useAtom(projectSettingsAtom, { store: projectScopeStore });
  const [ userRoles ] = useAtom(userRolesAtom, { store: projectScopeStore });
  const [ compatibleRowyRunVersion ] = useAtom(
    compatibleRowyRunVersionAtom,
    { store: projectScopeStore }
  );
  const openRowyRunModal = useSetAtom(rowyRunModalAtom, { store: projectScopeStore });
  const [ tableSettings ] = useAtom(tableSettingsAtom, { store: tableScopeStore });
  const [ tableSchema ] = useAtom(tableSchemaAtom, { store: tableScopeStore });
  const openTableModal = useSetAtom(tableModalAtom, { store: tableScopeStore });
  const [ tableSorts ] = useAtom(tableSortsAtom, { store: tableScopeStore });
  const hasDerivatives
    = Object.values(tableSchema.columns ?? {}).filter(
      (column) => column.type === FieldType.derivative
    ).length > 0;

  const hasExtensions
    = tableSchema.compiledExtension
    && tableSchema.compiledExtension.replace(/\W/g, "")?.length > 0;

  disabledTools = disabledTools ?? [];

  if (selectedRows && Object.keys(selectedRows).length > 0 && resetSelectedRows) {
    return (
      <RowSelectedToolBar
        selectedRows={selectedRows}
        resetSelectedRows={resetSelectedRows}
      />
    );
  }

  return (
    <StyledStack>
      {tableSettings.isCollection === false ? (
        <AddRowArraySubTable />
      ) : (
        <AddRow />
      )}
      <div /> {/* Spacer */}
      <HiddenFields />
      {tableSettings.isCollection === false ? (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<FilterIcon />}
          disabled={true}
        >
          Filter
        </Button>
      ) : (
        <Suspense fallback={<ButtonSkeleton />}>
          <Filters />
        </Suspense>
      )}
      {tableSorts.length > 0 && tableSettings.isCollection !== false && (
        <Suspense fallback={<ButtonSkeleton />}>
          <Sort />
        </Suspense>
      )}
      <div /> {/* Spacer */}
      <LoadedRowsStatus />
      <div style={{ flexGrow: 1, minWidth: 64 }} />
      <RowHeight />
      <div /> {/* Spacer */}
      {disabledTools.includes("import") ? (
        <TableToolbarButton
          title="Import data"
          icon={<ImportIcon />}
          disabled={true}
        />
      ) : (
        tableSettings.tableType !== "collectionGroup" && (
          <Suspense fallback={<ButtonSkeleton />}>
            <ImportData />
          </Suspense>
        )
      )}
      {(!projectSettings.exporterRoles
        || projectSettings.exporterRoles.length === 0
        || userRoles.some((role) =>
          projectSettings.exporterRoles?.includes(role)
        )) && (
        <Suspense fallback={<ButtonSkeleton />}>
          <TableToolbarButton
            title="Export/Download"
            onClick={() => openTableModal("export")}
            icon={<ExportIcon />}
            disabled={disabledTools.includes("export")}
          />
        </Suspense>
      )}
      {userRoles.includes("ADMIN") && (
        <>
          <div /> {/* Spacer */}
          <TableToolbarButton
            title="Webhooks"
            onClick={() => {
              if (compatibleRowyRunVersion({ minVersion: "1.2.0" })) {
                openTableModal("webhooks");
              } else {
                openRowyRunModal({ feature: "Webhooks", version: "1.2.0" });
              }
            }}
            icon={<WebhookIcon />}
            disabled={disabledTools.includes("webhooks")}
          />
          <TableToolbarButton
            title="Extensions"
            onClick={() => {
              if (projectSettings.rowyRunUrl) {
                openTableModal("extensions");
              } else {
                openRowyRunModal({ feature: "Extensions" });
              }
            }}
            icon={<ExtensionIcon />}
            disabled={disabledTools.includes("extensions")}
          />
          <TableToolbarButton
            title="Cloud logs"
            icon={<CloudLogsIcon />}
            onClick={() => {
              if (projectSettings.rowyRunUrl) {
                openTableModal("cloudLogs");
              } else {
                openRowyRunModal({ feature: "Cloud logs" });
              }
            }}
            disabled={disabledTools.includes("cloud_logs")}
          />
          {(hasDerivatives || hasExtensions) && (
            <Suspense fallback={<ButtonSkeleton />}>
              <ReExecute />
            </Suspense>
          )}
          <div /> {/* Spacer */}
          <TableSettings />
        </>
      )}
      <TableInformation />
      <div className="end-spacer" />
    </StyledStack>
  );
}
