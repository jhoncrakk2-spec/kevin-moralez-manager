'use client';

import { useState } from 'react';
import { Sheet } from './Sheet';
import { Input, Textarea, Select, Label, ImageInput, PrimaryBtn } from '@/components/ui';
import { COVER_STATUSES } from '@/lib/constants';
import type { CoverStatus } from '@/lib/types';

interface CoverFormData {
  titulo: string;
  artista_original: string;
  status: CoverStatus;
  notas: string;
  imagen_url: string;
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

  function handleSave() {
    if (!titulo) return;
    onSave({
      titulo,
      artista_original: artista,
      status,
      notas,
      imagen_url: imagen,
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
