import SetupLayout from "@src/components/Setup/SetupLayout";
import StepFinish from "@src/components/Setup/Steps/StepFinish";
import StepRules from "@src/components/Setup/Steps/StepRules";
import StepStorageRules from "@src/components/Setup/Steps/StepStorageRules";
import StepWelcome from "@src/components/Setup/Steps/StepWelcome";
import { useState } from "react";

const steps = [ StepWelcome, StepRules, StepStorageRules, StepFinish ];

export default function SetupPage() {
  const [ completion, setCompletion ] = useState<Record<string, boolean>>({
    welcome: false,
    rules: false,
    storageRules: false,
  });

  return (
    <SetupLayout
      steps={steps}
      completion={completion}
      setCompletion={setCompletion}
    />
  );
}
