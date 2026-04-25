'use client';

import { useState } from 'react';
import { Check, Trash2 } from 'lucide-react';
import { Sheet } from './Sheet';
import { ShareWhatsAppSheet } from './ShareWhatsAppSheet';
import {
  Input,
  Textarea,
  Select,
  Label,
  ImageInput,
  PrimaryBtn,
  DangerBtn,
  CoverArt,
  WhatsAppIcon,
} from '@/components/ui';
import { COVER_STATUSES, CHECKLIST_BASE } from '@/lib/constants';
import { formatCoverMessage } from '@/lib/format';
import type { Cover, CoverStatus } from '@/lib/types';

interface CoverDetailSheetProps {
  cover: Cover;
  onClose: () => void;
  onSave: (cover: Cover) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

export function CoverDetailSheet({
  cover,
  onClose,
  onSave,
  onDelete,
  isAdmin,
}: CoverDetailSheetProps) {
  const [data, setData] = useState<Cover>(cover);
  const [confirmDel, setConfirmDel] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  function toggleCheck(item: string) {
    setData({
      ...data,
      checklist: { ...data.checklist, [item]: !data.checklist[item] },
    });
  }

  const done = Object.values(data.checklist).filter(Boolean).length;
  const pct = Math.round((done / CHECKLIST_BASE.length) * 100);

  return (
    <Sheet
      title={data.titulo || 'Cover'}
      onClose={onClose}
      footer={
        <div className="space-y-2">
          <button
            onClick={() => setShareOpen(true)}
            className="w-full bg-emerald-600/15 border border-emerald-700/50 text-emerald-300 font-bold uppercase tracking-wider text-xs rounded-xl py-2.5 flex items-center justify-center gap-2 active:scale-[0.98] transition"
          >
            <WhatsAppIcon className="w-4 h-4" />
            Compartir por WhatsApp
          </button>
          {isAdmin && (
            <>
              <PrimaryBtn onClick={() => onSave(data)}>Guardar cambios</PrimaryBtn>
              {confirmDel ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDel(false)}
                    className="flex-1 border border-zinc-700 text-zinc-300 font-semibold uppercase text-xs rounded-xl py-2.5"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => onDelete(cover.id)}
                    className="flex-1 bg-rose-900 text-rose-100 font-semibold uppercase text-xs rounded-xl py-2.5"
                  >
                    Si, borrar
                  </button>
                </div>
              ) : (
                <DangerBtn onClick={() => setConfirmDel(true)}>
                  <Trash2 className="w-3.5 h-3.5" /> Eliminar cover
                </DangerBtn>
              )}
            </>
          )}
        </div>
      }
    >
      <div className="space-y-5">
        {/* Hero con portada */}
        <div
          className="relative rounded-2xl overflow-hidden border border-zinc-800/40 mx-auto"
          style={{ width: '240px', height: '240px' }}
        >
          <CoverArt
            src={data.imagen_url}
            alt={data.titulo}
            className="w-full h-full"
            iconSize="w-12 h-12"
            rounded="rounded-2xl"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-8 pointer-events-none">
            <div className="text-[10px] uppercase tracking-[0.2em] text-yellow-400 font-bold">
              {data.status === 'publicado' ? 'Publicado' : 'En proceso'}
            </div>
            <div className="font-display text-xl text-white leading-tight mt-0.5">
              {data.titulo}
            </div>
          </div>
        </div>

        {/* Progreso */}
        <div className="bg-gradient-to-br from-zinc-800/30 to-zinc-900 border border-zinc-800/40 rounded-2xl p-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-yellow-400 font-bold">
            Progreso
          </div>
          <div className="font-display text-4xl text-white mt-1">
            {pct}
            <span className="text-2xl text-yellow-400">%</span>
          </div>
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-[10px] text-zinc-500 mt-1.5">
            {done} de {CHECKLIST_BASE.length} tareas completadas
          </div>
        </div>

        <div>
          <Label>Titulo</Label>
          <Input
            value={data.titulo}
            onChange={(e) => setData({ ...data, titulo: e.target.value })}
            readOnly={!isAdmin}
          />
        </div>
        <div>
          <Label>Artista original</Label>
          <Input
            value={data.artista_original}
            onChange={(e) => setData({ ...data, artista_original: e.target.value })}
            readOnly={!isAdmin}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Estado</Label>
            <Select
              options={COVER_STATUSES}
              value={data.status}
              onChange={(v) => setData({ ...data, status: v as CoverStatus })}
            />
          </div>
          <div>
            <Label>Fecha pub.</Label>
            <Input
              type="date"
              value={data.fecha_publicacion || ''}
              onChange={(e) => setData({ ...data, fecha_publicacion: e.target.value || null })}
              readOnly={!isAdmin}
            />
          </div>
        </div>
        <div>
          <Label>Link (Spotify / YouTube)</Label>
          <Input
            value={data.link_externo}
            onChange={(e) => setData({ ...data, link_externo: e.target.value })}
            placeholder="https://open.spotify.com/... o https://youtu.be/..."
            readOnly={!isAdmin}
          />
        </div>
        {isAdmin && (
          <div>
            <Label>Portada</Label>
            <ImageInput
              value={data.imagen_url}
              onChange={(v) => setData({ ...data, imagen_url: v })}
            />
          </div>
        )}
        <div>
          <Label>Notas</Label>
          <Textarea
            rows={3}
            value={data.notas}
            onChange={(e) => setData({ ...data, notas: e.target.value })}
            readOnly={!isAdmin}
          />
        </div>

        {/* Checklist */}
        <div>
          <Label>Checklist de produccion</Label>
          <div className="space-y-1.5">
            {CHECKLIST_BASE.map((item, i) => {
              const checked = !!data.checklist[item];
              return (
                <button
                  key={i}
                  onClick={() => isAdmin && toggleCheck(item)}
                  disabled={!isAdmin}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg border transition ${
                    checked
                      ? 'bg-emerald-950/40 border-emerald-900/50'
                      : 'bg-zinc-900 border-zinc-800'
                  } ${!isAdmin ? 'cursor-default' : ''}`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                      checked ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                  </div>
                  <span
                    className={`text-sm text-left ${
                      checked ? 'line-through text-zinc-500' : 'text-zinc-200'
                    }`}
                  >
                    {item}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {shareOpen && (
        <ShareWhatsAppSheet
          message={formatCoverMessage(data)}
          onClose={() => setShareOpen(false)}
        />
      )}
    </Sheet>
  );
}
