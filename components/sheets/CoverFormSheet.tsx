'use client';

import { useState } from 'react';
import { Sheet } from './Sheet';
import { Input, Textarea, Select, Label, ImageInput, PrimaryBtn } from '@/components/ui';
import { COVER_STATUSES } from '@/lib/constants';
import type { CoverStatus } from '@/lib/types';
import { Loader2, Search } from 'lucide-react';

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

  async function fetchMetadata() {
    if (!linkExterno || fetching) return;

    const url = linkExterno;

    // Detectar YouTube (varios formatos)
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/i);
    // Detectar Spotify
    const spotifyMatch = url.match(/open\.spotify\.com\/(?:track|intl-[a-z]+\/track)\/([a-zA-Z0-9]+)/i);

    if (!youtubeMatch && !spotifyMatch) {
      return;
    }

    setFetching(true);

    try {
      const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.json();

        if (data.title) {
          // Intentar separar titulo y artista
          const parts = data.title.split(' - ');
          if (parts.length >= 2) {
            setArtista(parts[0].trim());
            setTitulo(parts.slice(1).join(' - ').trim());
          } else {
            setTitulo(data.title);
            if (data.author_name) {
              setArtista(data.author_name);
            }
          }
        }

        if (data.thumbnail_url) {
          setImagen(data.thumbnail_url);
        }
      }
    } catch (e) {
      console.error('Error:', e);
    }

    // Para YouTube, usar thumbnail directo (mejor calidad)
    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      setImagen(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
    }

    setFetching(false);
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
          <Label>Link de YouTube o Spotify</Label>
          <div className="flex gap-2">
            <Input
              value={linkExterno}
              onChange={(e) => setLinkExterno(e.target.value)}
              placeholder="Pega link aqui..."
              className="flex-1"
            />
            <button
              type="button"
              onClick={fetchMetadata}
              disabled={fetching || !linkExterno}
              className="px-4 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black rounded-xl transition flex items-center justify-center"
            >
              {fetching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-1">Pega el link y presiona el boton para llenar automaticamente</p>
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
