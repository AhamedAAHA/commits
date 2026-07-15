import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { AdminProvider } from "./context/AdminContext";
import { ContentProvider } from "./context/ContentContext";
import { CursorProvider } from "./context/CursorContext";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppErrorBoundary>
      <ThemeProvider>
        <CursorProvider>
          <ContentProvider>
            <AdminProvider>
              <App />
            </AdminProvider>
          </ContentProvider>
        </CursorProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  </StrictMode>,
);
