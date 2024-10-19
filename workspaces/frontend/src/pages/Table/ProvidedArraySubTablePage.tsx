import { lazy, Suspense, useContext, useMemo } from "react";
import { useAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { find, isEqual } from "lodash-es";

import Modal from "@src/components/Modal";
import BreadcrumbsSubTable from "@src/components/Table/Breadcrumbs/BreadcrumbsSubTable";
import ErrorFallback from "@src/components/ErrorFallback";
import ArraySubTableSourceFirestore from "@src/sources/TableSourceFirestore/ArraySubTableSourceFirestore";
import TableToolbarSkeleton from "@src/components/TableToolbar/TableToolbarSkeleton";
import TableSkeleton from "@src/components/Table/TableSkeleton";

import { ProjectScopeContext, currentUserAtom } from "@src/atoms/projectScope";
import {
  TableScopeContext,
  tableIdAtom,
  tableSettingsAtom,
  tableSchemaAtom,
} from "@src/atoms/tableScope";
import { ROUTES } from "@src/constants/routes";
import { HydrateAtoms } from "@src/atoms/utils.ts";
import { TOP_BAR_HEIGHT } from "@src/layouts/Navigation/TopBar";
import { TABLE_TOOLBAR_HEIGHT } from "@src/components/TableToolbar";

const TablePage = lazy(() => import("./TablePage"));

/**
 * Wraps `TablePage` with the data for a array-sub-table.
 *
 * Differences to `ProvidedTablePage`:
 * - Renders a `Modal`
 * - When this is a child of `ProvidedTablePage`, the `TablePage` rendered for
 *   the root table has its modals disabled
 */
export default function ProvidedArraySubTablePage() {
  const location = useLocation();
  const navigate = useNavigate();
  // Get params from URL: /arraySubTable/:docPath/:subTableKey
  const { docPath, subTableKey } = useParams();

  const projectScopeStore = useContext(ProjectScopeContext);
  const tableScopeStore = useContext(TableScopeContext);

  const [currentUser] = useAtom(currentUserAtom, { store: projectScopeStore });

  // Get table settings and the source column from root table
  const [rootTableSettings] = useAtom(tableSettingsAtom, { store: tableScopeStore });
  const [sourceColumn] = useAtom(
    useMemo(
      () =>
        selectAtom(
          tableSchemaAtom,
          (tableSchema) => find(tableSchema.columns, ["key", subTableKey]),
          isEqual
        ),
      [subTableKey]
    ),
    { store: tableScopeStore },
  );

  // Consumed by children as `tableSettings.collection`
  const subTableCollection = docPath ?? ""; // + "/" + (sourceColumn?.fieldName || subTableKey);

  // Must be compatible with `getTableSchemaPath`: tableId/rowId/subTableKey
  // This is why we can’t have a sub-table column fieldName !== key
  const subTableId =
    docPath?.replace(rootTableSettings.collection, rootTableSettings.id) +
    "/" +
    subTableKey;

  // Write fake tableSettings
  const subTableSettings = {
    ...rootTableSettings,
    collection: subTableCollection,
    id: subTableId,
    subTableKey,
    isCollection: false,
    tableType: "primaryCollection" as "primaryCollection",
    name: sourceColumn?.name || subTableKey || "",
  };

  const rootTableLink = location.pathname.split("/" + ROUTES.arraySubTable)[0];

  return (
    <Modal
      title={
        <BreadcrumbsSubTable
          rootTableSettings={rootTableSettings}
          subTableSettings={subTableSettings}
          rootTableLink={rootTableLink}
        />
      }
      onClose={() => navigate(rootTableLink)}
      disableBackdropClick
      disableEscapeKeyDown
      fullScreen
      sx={{
        "& > .MuiDialog-container > .MuiPaper-root": {
          bgcolor: "background.default",
          backgroundImage: "none",
        },
        "& .modal-title-row": {
          height: TOP_BAR_HEIGHT,
          "& .MuiDialogTitle-root": {
            px: 2,
            py: (TOP_BAR_HEIGHT - 28) / 2 / 8,
          },
          "& .dialog-close": { m: (TOP_BAR_HEIGHT - 40) / 2 / 8, ml: -1 },
        },
        "& .table-container": {
          height: `calc(100vh - ${TOP_BAR_HEIGHT}px - ${TABLE_TOOLBAR_HEIGHT}px - 16px)`,
        },
      }}
      ScrollableDialogContentProps={{
        disableTopDivider: true,
        disableBottomDivider: true,
        style: { "--dialog-spacing": 0, "--dialog-contents-spacing": 0 } as any,
      }}
      BackdropProps={{ key: "sub-table-modal-backdrop" }}
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense
          fallback={
            <>
              <TableToolbarSkeleton />
              <TableSkeleton />
            </>
          }
        >
          <TableScopeContext.Provider
            key={"tableScopeStore/subTable/" + subTableSettings.id}
            value={ tableScopeStore }
          >
            <HydrateAtoms initialValues={[
              [ currentUserAtom, currentUser ],
              [ tableIdAtom, subTableSettings.id ],
              [ tableSettingsAtom, subTableSettings ],
            ]}>
              <ArraySubTableSourceFirestore />
              <TablePage
                enableRowSelection={false}
                disabledTools={[
                  "import",
                  "export",
                  "webhooks",
                  "extensions",
                  "cloud_logs",
                ]}
              />
            </HydrateAtoms>
          </TableScopeContext.Provider>
        </Suspense>
      </ErrorBoundary>
    </Modal>
  );
}
