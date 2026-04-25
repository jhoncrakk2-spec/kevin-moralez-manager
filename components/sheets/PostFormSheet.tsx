'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Sheet } from './Sheet';
import { Input, Textarea, Select, Label, PrimaryBtn, DangerBtn } from '@/components/ui';
import { TIPOS_POST, PLATAFORMAS } from '@/lib/constants';
import { getTodayISO } from '@/lib/format';
import type { Post, TipoPost, Plataforma } from '@/lib/types';

interface PostFormSheetProps {
  initial?: Post;
  onClose: () => void;
  onSave: (post: Omit<Post, 'id' | 'created_at'> | Post) => void;
  onDelete?: (id: string) => void;
}

export function PostFormSheet({ initial, onClose, onSave, onDelete }: PostFormSheetProps) {
  const [data, setData] = useState<Omit<Post, 'id' | 'created_at'>>({
    fecha: initial?.fecha || getTodayISO(),
    plataforma: initial?.plataforma || 'TikTok',
    tipo: initial?.tipo || 'Teaser del cover',
    contenido: initial?.contenido || '',
    hashtags: initial?.hashtags || '',
    publicado: initial?.publicado || false,
  });
  const [confirmDel, setConfirmDel] = useState(false);
  const isEdit = !!initial;

  function handleSave() {
    if (!data.contenido) return;
    if (isEdit && initial) {
      onSave({ ...data, id: initial.id, created_at: initial.created_at });
    } else {
      onSave(data);
    }
  }

  return (
    <Sheet
      title={isEdit ? 'Editar publicacion' : 'Nueva publicacion'}
      onClose={onClose}
      footer={
        <div className="space-y-2">
          <PrimaryBtn onClick={handleSave}>{isEdit ? 'Guardar' : 'Programar'}</PrimaryBtn>
          {isEdit && onDelete && (
            <>
              {confirmDel ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDel(false)}
                    className="flex-1 border border-zinc-700 text-zinc-300 font-semibold uppercase text-xs rounded-xl py-2.5"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => onDelete(initial!.id)}
                    className="flex-1 bg-rose-900 text-rose-100 font-semibold uppercase text-xs rounded-xl py-2.5"
                  >
                    Si, borrar
                  </button>
                </div>
              ) : (
                <DangerBtn onClick={() => setConfirmDel(true)}>
                  <Trash2 className="w-3.5 h-3.5" /> Eliminar
                </DangerBtn>
              )}
            </>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Plataforma</Label>
            <Select
              options={PLATAFORMAS}
              value={data.plataforma}
              onChange={(v) => setData({ ...data, plataforma: v as Plataforma })}
            />
          </div>
          <div>
            <Label>Fecha</Label>
            <Input
              type="date"
              value={data.fecha}
              onChange={(e) => setData({ ...data, fecha: e.target.value })}
            />
          </div>
        </div>
        <div>
          <Label>Tipo de contenido</Label>
          <Select
            options={TIPOS_POST}
            value={data.tipo}
            onChange={(v) => setData({ ...data, tipo: v as TipoPost })}
          />
        </div>
        <div>
          <Label>Descripcion / idea</Label>
          <Textarea
            rows={3}
            value={data.contenido}
            onChange={(e) => setData({ ...data, contenido: e.target.value })}
            placeholder="¿De que va el post?"
          />
        </div>
        <div>
          <Label>Hashtags</Label>
          <Textarea
            rows={2}
            value={data.hashtags}
            onChange={(e) => setData({ ...data, hashtags: e.target.value })}
            placeholder="#corridos #regionalmexicano #cover"
          />
        </div>
      </div>
    </Sheet>
  );
}
