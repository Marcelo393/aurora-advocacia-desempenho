import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "flowdesk:me";
const DEFAULT_ME_ID = "a-ana";

type MeContextValue = {
  meId: string;
  setMeId: (id: string) => void;
};

const MeContext = createContext<MeContextValue | null>(null);

export function MeProvider({ children }: { children: ReactNode }) {
  const [meId, setMeIdState] = useState<string>(DEFAULT_ME_ID);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setMeIdState(saved);
  }, []);

  const setMeId = useCallback((id: string) => {
    setMeIdState(id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, id);
    }
  }, []);

  const value = useMemo(() => ({ meId, setMeId }), [meId, setMeId]);
  return <MeContext.Provider value={value}>{children}</MeContext.Provider>;
}

export function useMe(): MeContextValue {
  const ctx = useContext(MeContext);
  if (!ctx) throw new Error("useMe deve ser usado dentro de MeProvider");
  return ctx;
}
