'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Sheet } from './Sheet';
import { Input, Textarea, Select, Label, PrimaryBtn, DangerBtn } from '@/components/ui';
import { TIPOS_EVENTO } from '@/lib/constants';
import { getTodayISO } from '@/lib/format';
import type { Evento, TipoEvento } from '@/lib/types';

interface EventFormSheetProps {
  initial?: Evento;
  onClose: () => void;
  onSave: (evento: Omit<Evento, 'id' | 'created_at'> | Evento) => void;
  onDelete?: (id: string) => void;
}

export function EventFormSheet({ initial, onClose, onSave, onDelete }: EventFormSheetProps) {
  const [data, setData] = useState<Omit<Evento, 'id' | 'created_at'>>({
    fecha: initial?.fecha || getTodayISO(),
    hora: initial?.hora || '10:00',
    titulo: initial?.titulo || '',
    tipo: initial?.tipo || 'Ensayo',
    notas: initial?.notas || '',
    hecho: initial?.hecho || false,
  });
  const [confirmDel, setConfirmDel] = useState(false);
  const isEdit = !!initial;

  function handleSave() {
    if (!data.titulo) return;
    if (isEdit && initial) {
      onSave({ ...data, id: initial.id, created_at: initial.created_at });
    } else {
      onSave(data);
    }
  }

  return (
    <Sheet
      title={isEdit ? 'Editar evento' : 'Nuevo evento'}
      onClose={onClose}
      footer={
        <div className="space-y-2">
          <PrimaryBtn onClick={handleSave}>{isEdit ? 'Guardar' : 'Agendar'}</PrimaryBtn>
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
                  <Trash2 className="w-3.5 h-3.5" /> Eliminar evento
                </DangerBtn>
              )}
            </>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <Label>Titulo</Label>
          <Input
            value={data.titulo}
            onChange={(e) => setData({ ...data, titulo: e.target.value })}
            placeholder="Ej. Ensayo El Belicon"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Fecha</Label>
            <Input
              type="date"
              value={data.fecha}
              onChange={(e) => setData({ ...data, fecha: e.target.value })}
            />
          </div>
          <div>
            <Label>Hora</Label>
            <Input
              type="time"
              value={data.hora}
              onChange={(e) => setData({ ...data, hora: e.target.value })}
            />
          </div>
        </div>
        <div>
          <Label>Tipo</Label>
          <Select
            options={TIPOS_EVENTO}
            value={data.tipo}
            onChange={(v) => setData({ ...data, tipo: v as TipoEvento })}
          />
        </div>
        <div>
          <Label>Notas</Label>
          <Textarea
            rows={3}
            value={data.notas}
            onChange={(e) => setData({ ...data, notas: e.target.value })}
            placeholder="Lugar, materiales, etc."
          />
        </div>
      </div>
    </Sheet>
  );
}
