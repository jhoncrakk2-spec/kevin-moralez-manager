'use client';

interface SelectOption {
  id: string;
  label: string;
}

interface SelectProps {
  options: (string | SelectOption)[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Select({ options, value, onChange, className = '' }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-100 outline-none ${className}`}
    >
      {options.map((o) => {
        const optValue = typeof o === 'string' ? o : o.id;
        const optLabel = typeof o === 'string' ? o : o.label;
        return (
          <option key={optValue} value={optValue}>
            {optLabel}
          </option>
        );
      })}
    </select>
  );
}
