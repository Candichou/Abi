"use client";

import { useState } from "react";

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

  return (
    <div className="relative flex-1">
      {/* Icône */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/50 pointer-events-none">
        {icon}
      </div>

      {/* Input */}
      <input
        name={name}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className={inputClassName ?? "w-full bg-cream pl-9 pr-4 py-2.5 rounded-full text-sm border border-transparent outline-none focus:border-forest/20"}
      />

      {/* Liste de suggestions */}
      {showList && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-forest/10 rounded-2xl shadow-lg z-20 overflow-hidden max-h-48 overflow-y-auto">
          {filtered.map((suggestion) => (
            <li
              key={suggestion}
              onMouseDown={() => {
                setValue(suggestion);
                setOpen(false);
              }}
              className="px-4 py-2.5 text-sm text-forest cursor-pointer hover:bg-lavender/30 font-body"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
