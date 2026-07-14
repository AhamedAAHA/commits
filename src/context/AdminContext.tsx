import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const ADMIN_CODE = "9961";
const SESSION_KEY = "portfolio-admin-session";

interface AdminContextValue {
  isAuthenticated: boolean;
  login: (code: string) => boolean;
  logout: () => void;
  showLogin: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  showPanel: boolean;
  openPanel: () => void;
  closePanel: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

function readSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readSession);
  const [showLogin, setShowLogin] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const login = useCallback((code: string) => {
    if (code.trim() !== ADMIN_CODE) return false;
    sessionStorage.setItem(SESSION_KEY, "1");
    setIsAuthenticated(true);
    setShowLogin(false);
    setShowPanel(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setShowPanel(false);
  }, []);

  const openLogin = useCallback(() => setShowLogin(true), []);
  const closeLogin = useCallback(() => setShowLogin(false), []);
  const openPanel = useCallback(() => {
    if (readSession()) {
      setShowPanel(true);
    } else {
      setShowLogin(true);
    }
  }, []);
  const closePanel = useCallback(() => setShowPanel(false), []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      showLogin,
      openLogin,
      closeLogin,
      showPanel,
      openPanel,
      closePanel,
    }),
    [
      isAuthenticated,
      login,
      logout,
      showLogin,
      openLogin,
      closeLogin,
      showPanel,
      openPanel,
      closePanel,
    ],
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
