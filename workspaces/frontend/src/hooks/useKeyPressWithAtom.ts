import { useEffect } from "react";
import { useSetAtom, type SetStateAction, type WritableAtom } from "jotai";

/**
 * A hook that listens to when the target key is pressed
 * and updates an atom value.
 * @param targetKey - The key to listen to
 * @param atom - A function to update the atom
 * @param scope - The scope of the atom
 */
export default function useKeyPressWithAtom(
  targetKey: string,
  atom: WritableAtom<boolean, SetStateAction<boolean>[], unknown>,
  scope: Parameters<typeof useSetAtom>[1]
) {
  const setAtom = useSetAtom(atom, scope);

  // Add event listeners
  useEffect(() => {
    if (!setAtom) return;

    // If pressed key is our target key then set to true
    const downHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) setAtom(true);
    };

    // If released key is our target key then set to false
    const upHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) setAtom(false);
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey, setAtom]);
}
