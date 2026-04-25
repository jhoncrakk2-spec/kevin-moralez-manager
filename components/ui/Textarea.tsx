'use client';

import { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={`w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-100 outline-none placeholder:text-zinc-600 resize-none ${className}`}
    />
  );
}
