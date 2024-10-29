import { useEffect, type Dispatch, type SetStateAction } from "react";
import Modal from "@src/components/Modal";
import DeleteIcon from "@mui/icons-material/Delete";
import { default as Content } from "./ConditionModalContent";
import { EMPTY_STATE, type IConditionModal } from "./Settings";

type ConditionModalProps = {
  modal: IConditionModal;
  setModal: Dispatch<SetStateAction<IConditionModal>>;
  conditions: IConditionModal["condition"][];
  setConditions: Dispatch<SetStateAction<IConditionModal["condition"][]>>;
};

export default function ConditionModal({
  modal,
  setModal,
  conditions,
  setConditions,
}: ConditionModalProps) {
  const handleClose = () => setModal(EMPTY_STATE);
  const handleSave = () => {
    const _conditions: IConditionModal["condition"][] = [ ...conditions ];
    if (typeof modal.index === "number") {
      _conditions[modal.index] = modal.condition;
    }
    setConditions(_conditions);
    setModal(EMPTY_STATE);
  };
  const handleAdd = () => {
    function setConditionHack(type: any, condition: any) {
      let rCondition = condition;
      if (type === "undefined") {
        rCondition = { ...condition, value: undefined };
      }
      if (type === "boolean" && typeof condition.value === "object") {
        rCondition = { ...condition, value: false };
      } // Again 'rowy's multiselect does not accept default value'
      return rCondition;
    }
    const modalCondition = setConditionHack(
      modal.condition.type,
      modal.condition
    );
    const noConditions = Boolean(conditions?.length === 0 || !conditions);
    const arr = noConditions
      ? [ modalCondition ]
      : [ ...conditions, modalCondition ];
    setConditions(arr);
    setModal(EMPTY_STATE);
  };
  const handleRemove = () => {
    const _newConditions = conditions.filter(
      (_, index) => index !== modal.index
    );
    setConditions(_newConditions);
    setModal(EMPTY_STATE);
  };
  const handleUpdate = (key: string) => (value: any) => {
    const newState = {
      ...modal,
      condition: { ...modal.condition, [key]: value },
    };
    setModal(newState);
  };
  const primaryAction = (index: any) => index === null
    ? {
      children: "Add condition",
      onClick: () => handleAdd(),
      disabled: false,
    }
    : {
      children: "Save changes",
      onClick: () => handleSave(),
      disabled: false,
    };
  const secondaryAction = (index: any) => index === null
    ? {
      children: "Cancel",
      onClick: () => setModal(EMPTY_STATE),
    }
    : {
      startIcon: <DeleteIcon />,
      children: "Remove condition",
      onClick: () => handleRemove(),
    };

  useEffect(() => {
    handleUpdate("operator")(modal.condition.operator ?? "==");
  }, [ modal.condition.type ]);
  return (
    <Modal
      open={modal.isOpen}
      title={`${ modal.index ? "Edit" : "Add" } condition`}
      maxWidth="xs"
      onClose={handleClose}
      actions={{
        primary: primaryAction(modal.index),
        secondary: secondaryAction(modal.index),
      }}
      children={
        <Content condition={modal.condition} handleUpdate={handleUpdate} />
      }
    />
  );
}
