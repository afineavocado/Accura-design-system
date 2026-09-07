"use client";

import * as React from "react";
import { Combobox } from "@base-ui/react/combobox";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  description?: string;
  options?: ComboboxOption[];
  type?: "basic" | "search" | "tag-input";
  state?: "default" | "open" | "filled" | "filled-chips" | "invalid" | "disabled";
  multiple?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[] | null) => void;
  className?: string;
  "aria-invalid"?: boolean | "true" | "false";
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const itemClass = cn(
  "flex h-8 w-full cursor-default select-none items-center px-2",
  "rounded-[var(--radius-md)]",
  "text-sm text-[var(--color-background-default-foreground)]",
  "data-[highlighted]:bg-[var(--color-background-accent)]",
  "data-[highlighted]:text-[var(--color-background-accent-foreground)]",
  "data-[selected]:text-[var(--color-brand-primary)]",
  "outline-none"
);

const popupClass = cn(
  // Width is owned by the Positioner (w-[var(--anchor-width)], the element Base UI sets
  // the var on); the Popup just fills it. This avoids relying on the var cascading to a child.
  "z-20 w-full rounded-[var(--radius-lg)]",
  "border border-[var(--color-border-default)]",
  "bg-[var(--color-surface-overlay)]",
  "p-0.5 shadow-[var(--shadow-md)]",
  "outline-none"
);

// ─── Filtered items list — must render inside Combobox.Root context ───────────

function FilteredList({
  options,
  inputValue,
  filterable,
}: {
  options: ComboboxOption[];
  inputValue: string;
  filterable: boolean;
}) {
  const visible = filterable && inputValue.trim()
    ? options.filter((o) =>
        o.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    : options;

  return (
    <>
      <Combobox.List className="flex flex-col gap-0.5 max-h-60 overflow-y-auto">
        {visible.map((opt) => (
          <Combobox.Item key={opt.value} value={opt.value} className={itemClass}>
            {opt.label}
          </Combobox.Item>
        ))}
      </Combobox.List>
      {visible.length === 0 && (
        <p className="h-8 flex items-center px-2 text-sm text-[var(--color-text-secondary)]">
          No results
        </p>
      )}
    </>
  );
}

// ─── Trigger shared classes ───────────────────────────────────────────────────

function triggerClass(invalid: boolean, disabled: boolean) {
  return cn(
    "flex w-full items-center gap-2 rounded-[var(--radius-lg)]",
    "border text-sm outline-none transition-colors",
    "bg-[var(--color-input-bg)] border-[var(--color-input-border)]",
    "hover:border-[var(--color-border-hover)]",
    "data-[popup-open]:border-[var(--color-border-focus)]",
    "data-[popup-open]:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-ring)_20%,transparent)]",
    invalid && [
      "border-[var(--color-border-error)]",
      "hover:border-[var(--color-border-error)]",
      "[&[data-popup-open]]:border-[var(--color-border-error)]",
      "[&[data-popup-open]]:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--color-border-error)_20%,transparent)]",
      "shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-border-error)_20%,transparent)]",
    ],
    disabled && [
      "cursor-not-allowed",
      "bg-[var(--color-surface-muted)]",
      "border-[var(--color-border-disabled)]",
      "opacity-[calc(var(--opacity-disabled)/100)]",
    ]
  );
}

const inputClass = cn(
  "flex-1 min-w-0 bg-transparent outline-none",
  "placeholder:text-[var(--color-input-placeholder)]",
  "text-[var(--color-background-default-foreground)]",
  "disabled:cursor-not-allowed disabled:text-[var(--color-text-disabled)]"
);

// ─── Label ────────────────────────────────────────────────────────────────────

function FieldLabel({
  htmlFor,
  invalid,
  disabled,
  children,
}: {
  htmlFor: string;
  invalid: boolean;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium",
        invalid
          ? "text-[var(--color-text-invalid)]"
          : "text-[var(--color-background-default-foreground)]",
        disabled && "text-[var(--color-text-disabled)]"
      )}
    >
      {children}
    </label>
  );
}

// ─── Description ──────────────────────────────────────────────────────────────

function FieldDescription({
  invalid,
  disabled,
  children,
}: {
  invalid: boolean;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "text-xs",
        invalid
          ? "text-[var(--color-text-invalid)]"
          : "text-[var(--color-text-secondary)]",
        disabled && "text-[var(--color-text-disabled)]"
      )}
    >
      {children}
    </p>
  );
}

// ─── Tag Input ────────────────────────────────────────────────────────────────
// Free-form chip creation. Enter or comma confirms a tag. Backspace removes
// the last chip when input is empty. Duplicates are silently ignored.
// Optional `options` prop shows a filtered suggestions dropdown.

interface TagInputFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  description?: string;
  options?: ComboboxOption[];
  invalid: boolean;
  disabled: boolean;
  className?: string;
}

function TagInputField({
  id,
  label,
  placeholder,
  description,
  options,
  invalid,
  disabled,
  className,
}: TagInputFieldProps) {
  const [tags, setTags] = React.useState<string[]>([]);
  const [inputVal, setInputVal] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const hasSuggestions = options && options.length > 0;

  const suggestions = hasSuggestions
    ? options!.filter(
        (o) =>
          inputVal.trim() &&
          o.label.toLowerCase().includes(inputVal.toLowerCase()) &&
          !tags.includes(o.label)
      )
    : [];

  const addTag = (val: string) => {
    const trimmed = val.trim().replace(/,$/, "");
    if (!trimmed || tags.includes(trimmed)) {
      setInputVal("");
      return;
    }
    setTags((prev) => [...prev, trimmed]);
    setInputVal("");
    setShowSuggestions(false);
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (suggestions.length > 0 && showSuggestions) {
        addTag(suggestions[0].label);
      } else {
        addTag(inputVal);
      }
    }
    if (e.key === "Backspace" && !inputVal) {
      setTags((prev) => prev.slice(0, -1));
    }
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Close suggestions on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={cn("flex flex-col gap-[var(--spacing-component-xs)]", className)} ref={containerRef}>
      <FieldLabel htmlFor={id} invalid={invalid} disabled={disabled}>
        {label}
      </FieldLabel>

      <div className="relative">
        {/* Trigger container */}
        <div
          role="group"
          aria-invalid={invalid || undefined}
          onClick={() => !disabled && inputRef.current?.focus()}
          className={cn(
            "flex flex-wrap items-center gap-1 w-full rounded-[var(--radius-lg)]",
            "border min-h-9 px-[var(--spacing-component-xs-plus)] py-[var(--spacing-component-xs-plus)]",
            "bg-[var(--color-input-bg)] border-[var(--color-input-border)]",
            "transition-colors cursor-text",
            // Focus ring — blue when valid, red when invalid
            !invalid && "focus-within:border-[var(--color-border-focus)]",
            !invalid && "focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-ring)_20%,transparent)]",
            invalid && "border-[var(--color-border-error)]",
            invalid && "focus-within:border-[var(--color-border-error)]",
            invalid && "focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-border-error)_20%,transparent)]",
            disabled && [
              "cursor-not-allowed",
              "bg-[var(--color-surface-muted)]",
              "border-[var(--color-border-disabled)]",
              "opacity-[calc(var(--opacity-disabled)/100)]",
            ]
          )}
        >
          {/* Chips */}
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-[var(--radius-md)] bg-[var(--color-background-muted)] px-2 py-0.5 text-xs text-[var(--color-background-muted-foreground)]"
            >
              {tag}
              <span
                role="button"
                tabIndex={disabled ? -1 : 0}
                onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); removeTag(tag); }
                }}
                className="cursor-pointer opacity-60 hover:opacity-100 outline-none rounded-sm"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </span>
            </span>
          ))}

          {/* Inline input */}
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={inputVal}
            placeholder={tags.length === 0 ? placeholder : undefined}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            onChange={(e) => {
              const val = e.target.value;
              // Comma triggers tag creation inline
              if (val.endsWith(",")) {
                addTag(val);
              } else {
                setInputVal(val);
                setShowSuggestions(hasSuggestions ? val.trim().length > 0 : false);
              }
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (hasSuggestions && inputVal.trim()) setShowSuggestions(true);
            }}
            className={cn(
              "flex-1 min-w-[80px] bg-transparent outline-none text-sm",
              "placeholder:text-[var(--color-input-placeholder)]",
              "text-[var(--color-background-default-foreground)]",
              "disabled:cursor-not-allowed disabled:text-[var(--color-text-disabled)]"
            )}
          />
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className={cn(
            "absolute top-full left-0 right-0 z-20 mt-1",
            "rounded-[var(--radius-lg)] border border-[var(--color-border-default)]",
            "bg-[var(--color-surface-overlay)]",
            "flex flex-col gap-0.5 p-0.5 shadow-[var(--shadow-md)]"
          )}>
            {suggestions.map((opt) => (
              <div
                key={opt.value}
                onMouseDown={(e) => { e.preventDefault(); addTag(opt.label); }}
                className={cn(
                  "flex h-8 cursor-default select-none items-center px-2",
                  "rounded-[var(--radius-md)]",
                  "text-sm text-[var(--color-background-default-foreground)]",
                  "hover:bg-[var(--color-background-accent)]",
                  "hover:text-[var(--color-background-accent-foreground)]",
                  "outline-none"
                )}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {description && (
        <FieldDescription invalid={invalid} disabled={disabled}>
          {description}
        </FieldDescription>
      )}
    </div>
  );
}

// ─── ComboboxField ────────────────────────────────────────────────────────────

export function ComboboxField({
  id,
  label,
  placeholder,
  description,
  options,
  type = "basic",
  state = "default",
  multiple = false,
  defaultValue,
  value,
  onValueChange,
  className,
  "aria-invalid": ariaInvalid,
}: ComboboxFieldProps) {
  const disabled = state === "disabled";
  const invalid =
    state === "invalid" || ariaInvalid === true || ariaInvalid === "true";
  const isTagInput = type === "tag-input";
  const isMultiple = multiple || state === "filled-chips";
  const isSearch = type === "search";
  // Anchor the dropdown to the full Trigger box (not Base UI's default Input anchor,
  // which is ~50px narrower because of padding + chevron). Makes --anchor-width = trigger width.
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // ── Tag Input ────────────────────────────────────────────────────────────────
  if (isTagInput) {
    return (
      <TagInputField
        id={id}
        label={label}
        placeholder={placeholder}
        description={description}
        options={options}
        invalid={invalid}
        disabled={disabled}
        className={className}
      />
    );
  }

  // Track input for manual filtering (search + multi-select only)
  const [inputValue, setInputValue] = React.useState("");

  // ── Multi-select ────────────────────────────────────────────────────────────
  if (isMultiple) {
    const [selected, setSelected] = React.useState<string[]>(
      (defaultValue as string[] | undefined) ?? []
    );
    const activeValues = value !== undefined ? (value as string[]) : selected;

    const removeChip = (val: string, e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      const next = activeValues.filter((v) => v !== val);
      setSelected(next);
      onValueChange?.(next);
    };

    return (
      <div className={cn("flex flex-col gap-[var(--spacing-component-xs)]", className)}>
        <FieldLabel htmlFor={id} invalid={invalid} disabled={disabled}>
          {label}
        </FieldLabel>

        <Combobox.Root
          multiple
          value={activeValues}
          onValueChange={(v) => {
            const next = v ?? [];
            setSelected(next);
            setInputValue("");
            onValueChange?.(next);
          }}
          onInputValueChange={(v) => setInputValue(v)}
          autoHighlight
          disabled={disabled}
        >
          <Combobox.Trigger
            ref={triggerRef}
            className={cn(
              triggerClass(invalid, disabled),
              "flex-wrap min-h-9 p-[var(--spacing-component-xs-plus)]"
            )}
          >
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {activeValues.map((val) => {
                const opt = options?.find((o) => o.value === val);
                return (
                  <span
                    key={val}
                    className="inline-flex items-center gap-1 rounded-[var(--radius-md)] bg-[var(--color-background-muted)] px-2 py-0.5 text-xs text-[var(--color-background-muted-foreground)]"
                  >
                    {opt?.label ?? val}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => removeChip(val, e)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") removeChip(val, e);
                      }}
                      className="cursor-pointer opacity-60 hover:opacity-100 outline-none rounded-sm"
                      aria-label={`Remove ${opt?.label ?? val}`}
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </span>
                );
              })}
              <Combobox.Input
                id={id}
                placeholder={activeValues.length === 0 ? placeholder : undefined}
                className={cn(inputClass, "h-5 text-xs min-w-[60px]")}
                aria-invalid={invalid || undefined}
              />
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0",
                disabled
                  ? "text-[var(--color-icon-disabled)]"
                  : "text-[var(--color-icon-default)]"
              )}
            />
          </Combobox.Trigger>

          <Combobox.Portal>
            <Combobox.Positioner anchor={triggerRef} sideOffset={4} className="w-[var(--anchor-width)] min-w-[200px]">
              <Combobox.Popup className={popupClass}>
                <FilteredList options={options ?? []} inputValue={inputValue} filterable />
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>

        {description && (
          <FieldDescription invalid={invalid} disabled={disabled}>
            {description}
          </FieldDescription>
        )}
      </div>
    );
  }

  // ── Single select ────────────────────────────────────────────────────────────
  return (
    <div className={cn("flex flex-col gap-[var(--spacing-component-xs)]", className)}>
      <FieldLabel htmlFor={id} invalid={invalid} disabled={disabled}>
        {label}
      </FieldLabel>

      <Combobox.Root
        defaultValue={defaultValue as string | undefined}
        value={value as string | undefined}
        onValueChange={onValueChange as ((v: string | null) => void) | undefined}
        onInputValueChange={(v) => setInputValue(v)}
        autoHighlight={isSearch}
        disabled={disabled}
      >
        <Combobox.Trigger
          ref={triggerRef}
          className={cn(
            triggerClass(invalid, disabled),
            "h-9",
            isSearch
              ? "px-[var(--spacing-component-sm)]"
              : "px-[var(--spacing-component-md)]"
          )}
        >
          {isSearch && (
            <Search
              className={cn(
                "h-4 w-4 shrink-0",
                disabled
                  ? "text-[var(--color-icon-disabled)]"
                  : "text-[var(--color-icon-default)]"
              )}
            />
          )}
          <Combobox.Input
            id={id}
            placeholder={placeholder}
            className={inputClass}
            aria-invalid={invalid || undefined}
            readOnly={!isSearch}
          />
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0",
              disabled
                ? "text-[var(--color-icon-disabled)]"
                : "text-[var(--color-icon-default)]"
            )}
          />
        </Combobox.Trigger>

        <Combobox.Portal>
          <Combobox.Positioner anchor={triggerRef} sideOffset={4} className="w-[var(--anchor-width)] min-w-[200px]">
            <Combobox.Popup className={popupClass}>
              <FilteredList
                options={options ?? []}
                inputValue={inputValue}
                filterable={isSearch}
              />
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>

      {description && (
        <FieldDescription invalid={invalid} disabled={disabled}>
          {description}
        </FieldDescription>
      )}
    </div>
  );
}
