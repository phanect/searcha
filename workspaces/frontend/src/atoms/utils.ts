import { useEffect, type ReactElement } from "react";
import { useSetAtom, type createStore, type SetStateAction, type WritableAtom } from "jotai";
import { useHydrateAtoms } from "jotai/react/utils";
import { useAtomsDebugValue } from "jotai-devtools";
import useMemoValue from "@phanect/use-memo-value";
import { isEqual } from "lodash-es";

export function DebugAtoms(
  options: NonNullable<Parameters<typeof useAtomsDebugValue>[0]>
) {
  useAtomsDebugValue(options);
  return null;
}

export const HydrateAtoms = (options: {
  readonly initialValues?: Iterable<[ WritableAtom<unknown, never[], unknown>, unknown ]>;
  children: ReactElement | ReactElement[];
}): ReactElement | ReactElement[] => {
  if (options.initialValues) {
    useHydrateAtoms(
      new Map<WritableAtom<unknown, never[], unknown>, unknown>(options.initialValues)
    );
  }

  return options.children;
};

/**
 * Sets an atom’s value when the `value` prop changes.
 * Useful when setting an atom’s initialValue and you want to keep it in sync.
 */
export function SyncAtomValue<T extends unknown>({
  atom,
  store,
  value,
}: {
  atom: WritableAtom<T, SetStateAction<T>[], void>;
  store?: ReturnType<typeof createStore>;
  value: T;
}) {
  const memoized = useMemoValue<T>(value, isEqual);
  const setAtom = useSetAtom(atom, { store });

  useEffect(() => {
    setAtom(memoized);
  }, [setAtom, memoized]);

  return null;
}
