import { useRef, useSyncExternalStore } from "react";
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
} from "@/lib/mockStore";
import type { StoreState } from "@/lib/types";

export function useStore<T>(selector: (s: StoreState) => T): T {
  const cacheRef = useRef<{ state: StoreState | null; value: T }>({
    state: null,
    value: undefined as unknown as T,
  });
  return useSyncExternalStore(
    subscribe,
    () => {
      const s = getSnapshot();
      if (cacheRef.current.state !== s) {
        cacheRef.current = { state: s, value: selector(s) };
      }
      return cacheRef.current.value;
    },
    () => selector(getServerSnapshot()),
  );
}

export function useStoreState(): StoreState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
