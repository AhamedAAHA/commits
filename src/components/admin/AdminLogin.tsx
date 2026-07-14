import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";

export function AdminLogin() {
  const { showLogin, closeLogin, login } = useAdmin();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showLogin) return;

    inputRef.current?.focus();
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeLogin();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showLogin, closeLogin]);

  if (!showLogin) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (login(code)) {
      setCode("");
      setError("");
      return;
    }
    setError("Invalid admin code.");
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeLogin}
        aria-hidden="true"
      />
      <div ref={dialogRef} className="glass relative z-10 w-full max-w-sm rounded-2xl p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="admin-login-title" className="font-display text-xl text-[var(--ink)]">Admin access</h2>
          <button
            type="button"
            onClick={closeLogin}
            aria-label="Close admin login"
            className="focus-ring rounded-lg p-1 text-[var(--ink-faint)] hover:text-[var(--ink)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-4 text-sm text-[var(--ink-soft)]">
          Enter the admin code to edit portfolio content.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label>
            <span className="mb-1 block text-xs font-medium text-[var(--ink-faint)]">
              Admin code
            </span>
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              autoComplete="off"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              className="focus-ring w-full rounded-lg border border-[var(--line)] bg-black/30 px-3 py-2.5 text-sm text-[var(--ink)]"
              placeholder="Enter code"
            />
          </label>
          {error ? (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="focus-ring mt-1 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[#0b0716] transition hover:opacity-90"
          >
            Unlock admin
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
