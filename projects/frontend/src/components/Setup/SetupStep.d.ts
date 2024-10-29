export type ISetupStep = {
  id: string;
  layout?: "centered";
  shortTitle: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  body: React.ComponentType<ISetupStepBodyProps>;
};

export type ISetupStepBodyProps = {
  completion: Record<string, boolean>;
  setCompletion: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  isComplete: boolean;
  setComplete: (value: boolean = true) => void;
};
