import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { AdminProvider } from "./context/AdminContext";
import { ContentProvider } from "./context/ContentContext";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppErrorBoundary>
      <ContentProvider>
        <AdminProvider>
          <App />
        </AdminProvider>
      </ContentProvider>
    </AppErrorBoundary>
  </StrictMode>,
);
