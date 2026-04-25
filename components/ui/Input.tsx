'use client';

import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-100 outline-none placeholder:text-zinc-600 ${className}`}
    />
  );
}
