'use client';

import { ReactNode } from 'react';

interface LabelProps {
  children: ReactNode;
}

export function Label({ children }: LabelProps) {
  return (
    <label className="text-[10px] uppercase tracking-[0.2em] text-yellow-400 font-bold block mb-1.5">
      {children}
    </label>
  );
}
