import { Settings2 } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";

export function AdminButton() {
  const { openPanel, isAuthenticated } = useAdmin();

  return (
    <button
      type="button"
      onClick={openPanel}
      title={isAuthenticated ? "Open admin panel" : "Admin login"}
      className="focus-ring fixed bottom-4 right-4 z-50 flex h-9 items-center gap-1.5 rounded-full border border-[var(--line)] bg-black/50 px-3 py-1.5 text-xs text-[var(--ink-faint)] backdrop-blur-md transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
    >
      <Settings2 className="h-3.5 w-3.5" aria-hidden />
      <span>Admin</span>
    </button>
  );
}
