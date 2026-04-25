'use client';

import { useState } from 'react';
import { Sheet } from './Sheet';
import { Input, Select, Label, PrimaryBtn } from '@/components/ui';
import { PLATAFORMAS } from '@/lib/constants';
import { getTodayISO } from '@/lib/format';
import type { Plataforma } from '@/lib/types';

interface MetricaFormSheetProps {
  onClose: () => void;
  onSave: (data: {
    fecha: string;
    plataforma: Plataforma;
    vistas: number;
    likes: number;
    seguidores: number;
  }) => void;
}

export function MetricaFormSheet({ onClose, onSave }: MetricaFormSheetProps) {
  const [data, setData] = useState({
    fecha: getTodayISO(),
    plataforma: 'TikTok' as Plataforma,
    vistas: '',
    likes: '',
    seguidores: '',
  });

  function handleSave() {
    onSave({
      fecha: data.fecha,
      plataforma: data.plataforma,
      vistas: Number(data.vistas) || 0,
      likes: Number(data.likes) || 0,
      seguidores: Number(data.seguidores) || 0,
    });
  }

  return (
    <Sheet
      title="Nuevo registro"
      onClose={onClose}
      footer={<PrimaryBtn onClick={handleSave}>Guardar</PrimaryBtn>}
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
          <Label>Vistas totales</Label>
          <Input
            type="number"
            value={data.vistas}
            onChange={(e) => setData({ ...data, vistas: e.target.value })}
            placeholder="0"
          />
        </div>
        <div>
          <Label>Likes totales</Label>
          <Input
            type="number"
            value={data.likes}
            onChange={(e) => setData({ ...data, likes: e.target.value })}
            placeholder="0"
          />
        </div>
        <div>
          <Label>Seguidores</Label>
          <Input
            type="number"
            value={data.seguidores}
            onChange={(e) => setData({ ...data, seguidores: e.target.value })}
            placeholder="0"
          />
        </div>
      </div>
    </Sheet>
  );
}
