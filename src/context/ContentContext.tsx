import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getDefaultContent,
  loadStoredContent,
  STORAGE_KEY,
  type PortfolioContent,
} from "../lib/defaultContent";

interface ContentContextValue {
  content: PortfolioContent;
  setContent: React.Dispatch<React.SetStateAction<PortfolioContent>>;
  updateContent: (patch: Partial<PortfolioContent>) => void;
  resetContent: () => void;
  saveContent: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<PortfolioContent>(loadStoredContent);

  const updateContent = useCallback((patch: Partial<PortfolioContent>) => {
    setContent((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetContent = useCallback(() => {
    const defaults = getDefaultContent();
    setContent(defaults);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const saveContent = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const value = useMemo(
    () => ({
      content,
      setContent,
      updateContent,
      resetContent,
      saveContent,
    }),
    [content, updateContent, resetContent, saveContent],
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
