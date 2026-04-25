'use client';

import { useState, useEffect } from 'react';
import { Check, Clock } from 'lucide-react';
import { Sheet } from './Sheet';
import { WhatsAppIcon, ArtistPhoto, Label } from '@/components/ui';
import { buildWhatsAppUrl, copyToClipboard } from '@/lib/format';
import { ARTIST_DEFAULT } from '@/lib/constants';

interface ShareWhatsAppSheetProps {
  message: string;
  phone?: string;
  onClose: () => void;
}

export function ShareWhatsAppSheet({ message, phone, onClose }: ShareWhatsAppSheetProps) {
  const [copied, setCopied] = useState(false);
  const actualPhone = phone || ARTIST_DEFAULT.whatsapp;
  const isKevin = !phone;
  const url = buildWhatsAppUrl(message, actualPhone);

  useEffect(() => {
    copyToClipboard(message).then((success) => {
      if (success) setCopied(true);
    });
  }, [message]);

  async function handleCopy() {
    const success = await copyToClipboard(message);
    if (success) setCopied(true);
  }

  return (
    <Sheet
      title="Enviar a WhatsApp"
      onClose={onClose}
      footer={
        <div className="space-y-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold uppercase tracking-wider text-sm rounded-xl py-3 flex items-center justify-center gap-2 active:scale-[0.98] transition"
          >
            <WhatsAppIcon className="w-4 h-4" />
            {isKevin ? 'Abrir chat con Kevin' : 'Abrir WhatsApp'}
          </a>
          <button
            onClick={handleCopy}
            className="w-full border border-zinc-800/50 text-yellow-400 font-semibold uppercase tracking-wider text-xs rounded-xl py-2.5 active:scale-[0.98] transition"
          >
            {copied ? '✓ Mensaje copiado' : 'Copiar mensaje otra vez'}
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        {isKevin && (
          <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800/40">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-yellow-400/60 shrink-0">
              <ArtistPhoto
                src={ARTIST_DEFAULT.foto_url}
                alt="Kevin"
                className="w-full h-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-yellow-400 font-bold uppercase text-[10px] tracking-wider">
                Enviando a
              </div>
              <div className="text-zinc-100 font-semibold">Kevin Moralez</div>
            </div>
            <div className="text-[10px] text-zinc-500">{ARTIST_DEFAULT.whatsapp}</div>
          </div>
        )}

        <div
          className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${
            copied
              ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
              : 'bg-zinc-900 border-zinc-800/50 text-yellow-400'
          }`}
        >
          {copied ? (
            <Check className="w-4 h-4 shrink-0" />
          ) : (
            <Clock className="w-4 h-4 shrink-0" />
          )}
          <span>
            {copied
              ? 'Mensaje copiado. Solo pegalo en el chat.'
              : 'Toca "Copiar mensaje" y luego abre WhatsApp.'}
          </span>
        </div>

        <div>
          <Label>Mensaje listo para enviar</Label>
          <div className="bg-black border border-zinc-800 rounded-xl p-3 whitespace-pre-wrap text-sm text-zinc-200 leading-relaxed font-body">
            {message}
          </div>
        </div>

        <div className="text-[11px] text-zinc-500 leading-relaxed">
          <strong className="text-zinc-400">Tip:</strong> al abrir WhatsApp, manten presionado
          el cuadro de texto y toca <strong>Pegar</strong>.
        </div>
      </div>
    </Sheet>
  );
}
