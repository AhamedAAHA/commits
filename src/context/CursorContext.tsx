import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface CursorContextValue {
  cursorEnabled: boolean;
  toggleCursor: () => void;
}

const CursorContext = createContext<CursorContextValue | null>(null);

function readInitial(): boolean {
  if (typeof localStorage === "undefined") return true;
  try {
    return localStorage.getItem("cursorEnabled") !== "false";
  } catch {
    return true;
  }
}

export function CursorProvider({ children }: { children: ReactNode }) {
  const [cursorEnabled, setCursorEnabled] = useState<boolean>(readInitial);

  useEffect(() => {
    try {
      localStorage.setItem("cursorEnabled", String(cursorEnabled));
    } catch {
      /* storage unavailable */
    }
  }, [cursorEnabled]);

  const toggleCursor = useCallback(() => {
    setCursorEnabled((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({ cursorEnabled, toggleCursor }),
    [cursorEnabled, toggleCursor],
  );

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
}

export function useCursorSetting() {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error("useCursorSetting must be used within CursorProvider");
  return ctx;
}
