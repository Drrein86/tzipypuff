import { useSyncExternalStore } from "react";

/** true only after client hydration — avoids SSR/localStorage mismatches */
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
