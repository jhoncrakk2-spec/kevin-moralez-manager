'use client';

import { useState, useEffect } from 'react';
import { Disc3, Camera } from 'lucide-react';
import { resizeImage } from '@/lib/format';

interface ArtistPhotoProps {
  src: string;
  alt: string;
  className?: string;
}

export function ArtistPhoto({ src, alt, className = '' }: ArtistPhotoProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-700 flex items-center justify-center ${className}`}
      >
        <span className="font-display text-3xl text-black tracking-wider">KM</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

interface CoverArtProps {
  src?: string;
  alt: string;
  className?: string;
  iconSize?: string;
  rounded?: string;
}

export function CoverArt({
  src,
  alt,
  className = '',
  iconSize = 'w-5 h-5',
  rounded = 'rounded-lg',
}: CoverArtProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`bg-gradient-to-br from-zinc-800/50 to-zinc-800 border border-zinc-800/40 flex items-center justify-center ${rounded} ${className}`}
      >
        <Disc3 className={`${iconSize} text-yellow-400`} />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden border border-zinc-800/40 bg-black ${rounded} ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

interface ImageInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ImageInput({ value, onChange }: ImageInputProps) {
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await resizeImage(file, 600, 0.85);
      onChange(dataUrl);
    } catch {
      alert('No se pudo cargar la imagen. Intenta con otra.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div>
          <div className="relative w-40 h-40 mx-auto rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
            <img
              src={value}
              alt="Portada"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <label className="flex-1 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg py-2.5 text-center text-xs uppercase tracking-wider font-bold cursor-pointer active:scale-[0.98] transition flex items-center justify-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              {busy ? 'Cargando...' : 'Cambiar'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </label>
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-4 bg-zinc-900 border border-rose-900/50 text-rose-400 rounded-lg text-xs uppercase tracking-wider font-bold active:scale-[0.98]"
            >
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <label className="w-full bg-zinc-900 border border-dashed border-zinc-700 rounded-xl py-6 cursor-pointer active:scale-[0.98] active:border-yellow-400 transition flex flex-col items-center gap-2">
          <Camera className="w-6 h-6 text-yellow-400" />
          <span className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
            {busy ? 'Cargando...' : 'Subir portada'}
          </span>
          <span className="text-[10px] text-zinc-500">desde tu galeria o camara</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      )}
      <div className="flex items-center gap-2 my-1">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[9px] uppercase tracking-wider text-zinc-600">o pegar URL</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>
      <input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-100 outline-none placeholder:text-zinc-600"
      />
    </div>
  );
}
