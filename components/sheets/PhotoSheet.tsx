'use client';

import { useState } from 'react';
import { Check, Camera } from 'lucide-react';
import { Sheet } from './Sheet';
import { ArtistPhoto, Label, Input } from '@/components/ui';
import { resizeImage } from '@/lib/format';

interface PhotoSheetProps {
  currentPhoto: string;
  hasOverride: boolean;
  onClose: () => void;
  onSave: (value: string | null) => void;
}

export function PhotoSheet({ currentPhoto, hasOverride, onClose, onSave }: PhotoSheetProps) {
  const [preview, setPreview] = useState(currentPhoto || '');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await resizeImage(file, 500, 0.85);
      setPreview(dataUrl);
    } catch {
      alert('No se pudo cargar la imagen. Intenta con otra.');
    } finally {
      setBusy(false);
    }
  }

  function handleSave() {
    if (!preview) return;
    onSave(preview);
    setSaved(true);
    setTimeout(onClose, 700);
  }

  return (
    <Sheet
      title="Foto de Kevin"
      onClose={onClose}
      footer={
        <div className="space-y-2">
          <button
            onClick={handleSave}
            disabled={!preview || saved}
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold uppercase tracking-wider rounded-xl py-3 active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" /> Guardado
              </>
            ) : (
              'Guardar foto'
            )}
          </button>
          {hasOverride && (
            <button
              onClick={() => onSave(null)}
              className="w-full border border-zinc-700 text-zinc-400 font-semibold uppercase tracking-wider text-xs rounded-xl py-2.5"
            >
              Volver a la foto de Spotify
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex justify-center">
          <div className="w-40 h-40 rounded-2xl overflow-hidden border-2 border-yellow-400/60 shadow-xl shadow-zinc-800/40">
            <ArtistPhoto src={preview} alt="preview" className="w-full h-full" />
          </div>
        </div>

        <div>
          <Label>Desde tu telefono</Label>
          <label className="w-full flex items-center justify-center gap-2 bg-zinc-900 border border-dashed border-zinc-700 rounded-xl py-4 cursor-pointer active:scale-[0.98] active:border-yellow-400 transition">
            <Camera className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">
              {busy ? 'Procesando...' : 'Elegir foto'}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                setSaved(false);
                handleFile(e.target.files?.[0]);
              }}
            />
          </label>
          <p className="text-[11px] text-zinc-500 mt-2">Se optimiza automaticamente.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-[10px] uppercase tracking-wider text-zinc-600">o pegar URL</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <div>
          <Input
            value={preview && preview.startsWith('http') ? preview : ''}
            onChange={(e) => {
              setSaved(false);
              setPreview(e.target.value);
            }}
            placeholder="https://..."
          />
        </div>

        {preview && !saved && (
          <div className="text-[11px] text-amber-400 text-center">
            ↓ Toca "Guardar foto" abajo para confirmar
          </div>
        )}
      </div>
    </Sheet>
  );
}
