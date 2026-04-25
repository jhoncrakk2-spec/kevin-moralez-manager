'use client';

import { useState } from 'react';
import { Sheet } from './Sheet';
import { Input, Textarea, Select, Label, ImageInput, PrimaryBtn } from '@/components/ui';
import { COVER_STATUSES } from '@/lib/constants';
import type { CoverStatus } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface CoverFormData {
  titulo: string;
  artista_original: string;
  status: CoverStatus;
  notas: string;
  imagen_url: string;
  link_externo: string;
}

interface CoverFormSheetProps {
  onClose: () => void;
  onSave: (data: CoverFormData) => void;
}

export function CoverFormSheet({ onClose, onSave }: CoverFormSheetProps) {
  const [titulo, setTitulo] = useState('');
  const [artista, setArtista] = useState('');
  const [status, setStatus] = useState<CoverStatus>('ideas');
  const [notas, setNotas] = useState('');
  const [imagen, setImagen] = useState('');
  const [linkExterno, setLinkExterno] = useState('');
  const [fetching, setFetching] = useState(false);

  async function handleUrlChange(url: string) {
    setLinkExterno(url);

    // Detectar si es un link de YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);

    if (youtubeMatch && !titulo) {
      setFetching(true);
      try {
        // Usar oEmbed de YouTube para obtener el titulo
        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
        const res = await fetch(oembedUrl);
        if (res.ok) {
          const data = await res.json();
          if (data.title) {
            // Intentar separar titulo y artista (formato comun: "Artista - Cancion")
            const parts = data.title.split(' - ');
            if (parts.length >= 2) {
              setArtista(parts[0].trim());
              setTitulo(parts.slice(1).join(' - ').trim());
            } else {
              setTitulo(data.title);
            }
          }
          // Usar thumbnail de YouTube
          const videoId = youtubeMatch[1];
          setImagen(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
        }
      } catch (e) {
        console.error('Error fetching YouTube data:', e);
      }
      setFetching(false);
    }
  }

  function handleSave() {
    if (!titulo) return;
    onSave({
      titulo,
      artista_original: artista,
      status,
      notas,
      imagen_url: imagen,
      link_externo: linkExterno,
    });
  }

  return (
    <Sheet
      title="Nuevo cover"
      onClose={onClose}
      footer={<PrimaryBtn onClick={handleSave}>Guardar cover</PrimaryBtn>}
    >
      <div className="space-y-4">
        <div>
          <Label>Link de YouTube (opcional)</Label>
          <div className="relative">
            <Input
              value={linkExterno}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
            {fetching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
              </div>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Pega el link y se llenara automaticamente</p>
        </div>
        <div>
          <Label>Titulo de la cancion</Label>
          <Input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej. La Diabla"
          />
        </div>
        <div>
          <Label>Artista original</Label>
          <Input
            value={artista}
            onChange={(e) => setArtista(e.target.value)}
            placeholder="Ej. Xavi"
          />
        </div>
        <div>
          <Label>Portada</Label>
          <ImageInput value={imagen} onChange={setImagen} />
        </div>
        <div>
          <Label>Estado inicial</Label>
          <Select options={COVER_STATUSES} value={status} onChange={(v) => setStatus(v as CoverStatus)} />
        </div>
        <div>
          <Label>Notas</Label>
          <Textarea
            rows={3}
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Idea, tonalidad, referencia..."
          />
        </div>
      </div>
    </Sheet>
  );
}
