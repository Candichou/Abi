"use client";

import { useId, useState } from "react";

export function SearchCombobox({
  name,
  placeholder,
  suggestions,
  defaultValue,
  icon,
  inputClassName,
}: {
  name: string;
  placeholder: string;
  suggestions: string[];
  defaultValue?: string;
  icon: React.ReactNode;
  inputClassName?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = useId();

  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(new RegExp("[̀-ͯ]", "g"), "")
      .toLowerCase();

  const normalizedValue = normalize(value);
  const filtered = suggestions.filter((s) =>
    normalize(s).startsWith(normalizedValue)
  );

  const showList = open && value.length >= 1 && filtered.length > 0;
  const activeId =
    activeIndex >= 0 && activeIndex < filtered.length
      ? `${listboxId}-option-${activeIndex}`
      : undefined;

  function selectSuggestion(suggestion: string) {
    setValue(suggestion);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showList) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? filtered.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        selectSuggestion(filtered[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div className="relative flex-1">
      {/* Icône */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/70 pointer-events-none">
        {icon}
      </div>

      {/* Input */}
      <input
        name={name}
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listboxId}
        aria-activedescendant={activeId}
        onChange={(e) => {
          setValue(e.target.value);
          setActiveIndex(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={handleKeyDown}
        className={inputClassName ?? "w-full bg-cream pl-9 pr-4 py-2.5 rounded-full text-sm border border-transparent outline-none focus:border-forest/20"}
      />

      {/* Liste de suggestions */}
      {showList && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-forest/10 rounded-2xl shadow-lg z-20 overflow-hidden max-h-48 overflow-y-auto"
        >
          {filtered.map((suggestion, index) => (
            <li
              key={suggestion}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={() => selectSuggestion(suggestion)}
              className={`px-4 py-2.5 text-sm text-forest cursor-pointer font-body ${
                index === activeIndex ? "bg-lavender/30" : "hover:bg-lavender/30"
              }`}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
