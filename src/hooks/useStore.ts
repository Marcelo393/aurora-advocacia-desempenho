import { useSyncExternalStore } from "react";
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
} from "@/lib/mockStore";
import type { StoreState } from "@/lib/types";

export function useStore<T>(selector: (s: StoreState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot()),
    () => selector(getServerSnapshot()),
  );
}

export function useStoreState(): StoreState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
