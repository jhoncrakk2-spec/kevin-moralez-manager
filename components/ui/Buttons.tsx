'use client';

import { ReactNode } from 'react';
import { Plus } from 'lucide-react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function PrimaryBtn({ children, onClick, disabled }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold uppercase tracking-wider rounded-xl py-3 active:scale-[0.98] transition"
    >
      {children}
    </button>
  );
}

export function DangerBtn({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full border border-rose-900/60 text-rose-400 font-semibold uppercase tracking-wider text-xs rounded-xl py-2.5 active:scale-[0.98] transition flex items-center justify-center gap-2"
    >
      {children}
    </button>
  );
}

interface FABProps {
  onClick: () => void;
}

export function FAB({ onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-4 z-30 w-14 h-14 rounded-full bg-yellow-400 text-black shadow-2xl shadow-yellow-900/50 flex items-center justify-center active:scale-95 transition"
    >
      <Plus className="w-6 h-6" strokeWidth={3} />
    </button>
  );
}
