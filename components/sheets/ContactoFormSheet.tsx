'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Sheet } from './Sheet';
import { Input, Textarea, Label, PrimaryBtn, DangerBtn } from '@/components/ui';
import type { Contacto } from '@/lib/types';

interface ContactoFormSheetProps {
  initial?: Contacto;
  onClose: () => void;
  onSave: (contacto: Omit<Contacto, 'id' | 'created_at'> | Contacto) => void;
  onDelete?: (id: string) => void;
}

export function ContactoFormSheet({ initial, onClose, onSave, onDelete }: ContactoFormSheetProps) {
  const [data, setData] = useState<Omit<Contacto, 'id' | 'created_at'>>({
    nombre: initial?.nombre || '',
    rol: initial?.rol || '',
    telefono: initial?.telefono || '',
    email: initial?.email || '',
    notas: initial?.notas || '',
  });
  const [confirmDel, setConfirmDel] = useState(false);
  const isEdit = !!initial;

  function handleSave() {
    if (!data.nombre) return;
    if (isEdit && initial) {
      onSave({ ...data, id: initial.id, created_at: initial.created_at });
    } else {
      onSave(data);
    }
  }

  return (
    <Sheet
      title={isEdit ? 'Editar contacto' : 'Nuevo contacto'}
      onClose={onClose}
      footer={
        <div className="space-y-2">
          <PrimaryBtn onClick={handleSave}>{isEdit ? 'Guardar' : 'Agregar'}</PrimaryBtn>
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
        <div>
          <Label>Nombre</Label>
          <Input
            value={data.nombre}
            onChange={(e) => setData({ ...data, nombre: e.target.value })}
          />
        </div>
        <div>
          <Label>Rol</Label>
          <Input
            value={data.rol}
            onChange={(e) => setData({ ...data, rol: e.target.value })}
            placeholder="Productor, editor, fotografo..."
          />
        </div>
        <div>
          <Label>Telefono</Label>
          <Input
            value={data.telefono}
            onChange={(e) => setData({ ...data, telefono: e.target.value })}
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>
        <div>
          <Label>Notas</Label>
          <Textarea
            rows={3}
            value={data.notas}
            onChange={(e) => setData({ ...data, notas: e.target.value })}
          />
        </div>
      </div>
    </Sheet>
  );
}
