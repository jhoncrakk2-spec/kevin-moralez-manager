'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface SheetProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Sheet({ title, onClose, children, footer }: SheetProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-black border-t border-zinc-800/40 rounded-t-3xl max-h-[92vh] flex flex-col sheet-in">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-zinc-800">
          <h3 className="font-display text-2xl tracking-wider text-zinc-100">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="px-5 py-3 border-t border-zinc-800">{footer}</div>}
      </div>
    </div>
  );
}
