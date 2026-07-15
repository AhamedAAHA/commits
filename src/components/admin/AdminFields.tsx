interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "url" | "email" | "tel";
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-[var(--ink-faint)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="focus-ring w-full rounded-lg border border-[var(--line)] bg-[var(--overlay-base)]/30 px-3 py-2 text-sm text-[var(--ink)]"
      />
    </label>
  );
}

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export function TextArea({ label, value, onChange, rows = 4 }: TextAreaProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-[var(--ink-faint)]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="focus-ring w-full resize-y rounded-lg border border-[var(--line)] bg-[var(--overlay-base)]/30 px-3 py-2 text-sm text-[var(--ink)]"
      />
    </label>
  );
}

interface StringListProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export function StringList({
  label,
  items,
  onChange,
  placeholder = "Add item",
}: StringListProps) {
  return (
    <div>
      <span className="mb-2 block text-xs font-medium text-[var(--ink-faint)]">
        {label}
      </span>
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[index] = e.target.value;
                onChange(next);
              }}
              className="focus-ring min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-[var(--overlay-base)]/30 px-3 py-2 text-sm text-[var(--ink)]"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="focus-ring shrink-0 rounded-lg border border-[var(--line)] px-2 text-xs text-[var(--ink-faint)] hover:text-red-400"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="focus-ring self-start rounded-lg border border-dashed border-[var(--line)] px-3 py-1.5 text-xs text-[var(--ink-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          + Add
        </button>
        {items.length === 0 ? (
          <p className="text-xs text-[var(--ink-faint)]">{placeholder}</p>
        ) : null}
      </div>
    </div>
  );
}

interface CardProps {
  title: string;
  onRemove?: () => void;
  children: React.ReactNode;
}

export function EditorCard({ title, onRemove, children }: CardProps) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--overlay-base)]/25 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-[var(--ink)]">{title}</h4>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="focus-ring text-xs text-red-400 hover:underline"
          >
            Delete
          </button>
        ) : null}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
