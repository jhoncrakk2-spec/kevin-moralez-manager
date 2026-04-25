'use client';

import { useState } from 'react';
import { WhatsAppIcon } from './Icons';
import { ShareWhatsAppSheet } from '@/components/sheets/ShareWhatsAppSheet';

interface WhatsAppButtonProps {
  message: string;
  phone?: string;
  stopProp?: boolean;
  size?: 'sm' | 'md';
}

export function WhatsAppButton({
  message,
  phone,
  stopProp = true,
  size = 'sm',
}: WhatsAppButtonProps) {
  const [open, setOpen] = useState(false);
  const dim = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const iconDim = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <>
      <button
        onClick={(e) => {
          if (stopProp) e.stopPropagation();
          setOpen(true);
        }}
        className={`shrink-0 rounded-full bg-emerald-600/15 border border-emerald-700/40 text-emerald-400 ${dim} flex items-center justify-center active:scale-90 transition`}
        aria-label="Compartir por WhatsApp"
      >
        <WhatsAppIcon className={iconDim} />
      </button>
      {open && (
        <ShareWhatsAppSheet message={message} phone={phone} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
