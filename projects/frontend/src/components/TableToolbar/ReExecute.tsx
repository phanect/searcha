import { useContext, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import {
  collection,
  collectionGroup,
  getDocs,
  writeBatch,
} from "firebase/firestore";

import LoopIcon from "@mui/icons-material/Loop";
import Modal from "@src/components/Modal";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

import {
  ProjectScopeContext,
  projectSettingsAtom,
  rowyRunModalAtom,
} from "@src/atoms/projectScope";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import { TableScopeContext, tableSettingsAtom } from "@src/atoms/tableScope";
import TableToolbarButton from "./TableToolbarButton";

/**
 * NOTE: This is Firestore-specific
 */
export default function ReExecute() {
  const [ open, setOpen ] = useState(false);
  const [ updating, setUpdating ] = useState(false);
  const handleClose = () => setOpen(false);

  const projectScopeStore = useContext(ProjectScopeContext);
  const tableScopeStore = useContext(TableScopeContext);
  const [ projectSettings ] = useAtom(projectSettingsAtom, { store: projectScopeStore });
  const openRowyRunModal = useSetAtom(rowyRunModalAtom, { store: projectScopeStore });
  const [ tableSettings ] = useAtom(tableSettingsAtom, { store: tableScopeStore });
  const [ firebaseDb ] = useAtom(firebaseDbAtom, { store: projectScopeStore });

  if (!firebaseDb) {
    return null;
  }

  if (!projectSettings.rowyRunUrl) {
    return (
      <TableToolbarButton
        title="Force refresh"
        onClick={() => openRowyRunModal({ feature: "Force refresh" })}
        icon={<LoopIcon />}
      />
    );
  }

  const query
    = tableSettings.tableType === "collectionGroup"
      ? collectionGroup(firebaseDb, tableSettings.collection!)
      : collection(firebaseDb, tableSettings.collection);

  const handleConfirm = async () => {
    setUpdating(true);
    const _forcedUpdateAt = new Date();
    const querySnapshot = await getDocs(query);
    const docs = [ ...querySnapshot.docs ];
    while (docs.length) {
      const batch = writeBatch(firebaseDb);
      const temp = docs.splice(0, 499);
      temp.forEach((doc) => {
        batch.update(doc.ref, { _forcedUpdateAt });
      });
      await batch.commit();
    }
    setTimeout(() => {
      setUpdating(false);
      setOpen(false);
    }, 3000); // give time to for function to run
  };

  return (
    <>
      <TableToolbarButton
        title="Force refresh"
        onClick={() => setOpen(true)}
        icon={<LoopIcon />}
      />

      {open && (
        <Modal
          onClose={handleClose}
          maxWidth="xs"
          fullWidth
          fullScreen={false}
          hideCloseButton
          title="Force refresh?"
          children="All Extensions and Derivatives in this table will re-execute."
          actions={{
            primary: {
              children: "Confirm",
              onClick: handleConfirm,
              startIcon: updating && <CircularProgressOptical size={16} />,
              disabled: updating,
            },
            secondary: {
              children: "Cancel",
              onClick: handleClose,
            },
          }}
        />
      )}
    </>
  );
}
