'use client';

import { useState } from 'react';
import { Check, Video, Film, Sparkles, ImageIcon } from 'lucide-react';
import { Header, EmptyHint, FilterChip, FAB, PlataformaIcon, WhatsAppButton, Section } from '@/components/ui';
import { PostFormSheet } from '@/components/sheets';
import { useAuth } from '@/components/AuthGate';
import { PLATAFORMAS } from '@/lib/constants';
import { formatPostMessage } from '@/lib/format';
import type { Post, Plataforma } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';

interface RedesScreenProps {
  posts: Post[];
  onAdd: (post: Omit<Post, 'id' | 'created_at'>) => void;
  onUpdate: (post: Post) => void;
  onDelete: (id: string) => void;
  onTogglePublicado: (post: Post) => void;
}

function Idea({ icon: Icon, titulo, desc }: { icon: LucideIcon; titulo: string; desc: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800/40 flex items-center justify-center">
        <Icon className="w-4 h-4 text-yellow-400" />
      </div>
      <div>
        <div className="text-sm font-semibold text-zinc-100">{titulo}</div>
        <div className="text-xs text-zinc-500">{desc}</div>
      </div>
    </div>
  );
}

export function RedesScreen({
  posts,
  onAdd,
  onUpdate,
  onDelete,
  onTogglePublicado,
}: RedesScreenProps) {
  const { isAdmin } = useAuth();
  const [plat, setPlat] = useState<Plataforma | 'Todas'>('Todas');
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);

  const filtered = plat === 'Todas' ? posts : posts.filter((p) => p.plataforma === plat);
  const sorted = [...filtered].sort((a, b) => b.fecha.localeCompare(a.fecha));

  const counts = {
    Todas: posts.length,
    TikTok: posts.filter((p) => p.plataforma === 'TikTok').length,
    Instagram: posts.filter((p) => p.plataforma === 'Instagram').length,
    YouTube: posts.filter((p) => p.plataforma === 'YouTube').length,
  };

  function handleAdd(data: Omit<Post, 'id' | 'created_at'>) {
    onAdd(data);
    setAdding(false);
  }

  function handleUpdate(post: Post | Omit<Post, 'id' | 'created_at'>) {
    onUpdate(post as Post);
    setEditing(null);
  }

  function handleDelete(id: string) {
    onDelete(id);
    setEditing(null);
  }

  return (
    <div className="fade-in">
      <Header title="REDES" subtitle="contenido para TikTok, IG, YouTube" />

      <div className="px-5 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 pb-1">
          {(['Todas', ...PLATAFORMAS] as const).map((p) => (
            <FilterChip
              key={p}
              active={plat === p}
              onClick={() => setPlat(p)}
              label={p}
              count={counts[p]}
            />
          ))}
        </div>
      </div>

      <div className="px-5 mt-4 space-y-2">
        {sorted.length === 0 ? (
          <EmptyHint text="Sin publicaciones programadas. Toca + para agregar." />
        ) : (
          sorted.map((p) => (
            <div
              key={p.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-2 overflow-hidden"
            >
              <button
                onClick={() => isAdmin && setEditing(p)}
                className="flex-1 text-left p-3 flex gap-3 active:bg-zinc-900 transition min-w-0"
                disabled={!isAdmin}
              >
                <div className="shrink-0">
                  <PlataformaIcon p={p.plataforma} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-yellow-400">
                      {p.tipo}
                    </span>
                    <span className="text-[10px] text-zinc-600">·</span>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(p.fecha + 'T12:00').toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                  <div
                    className={`text-sm mt-0.5 ${
                      p.publicado ? 'line-through text-zinc-500' : 'text-zinc-100'
                    }`}
                  >
                    {p.contenido}
                  </div>
                  {p.hashtags && (
                    <div className="text-[11px] text-yellow-500/70 mt-1 truncate">
                      {p.hashtags}
                    </div>
                  )}
                </div>
              </button>
              <div className="flex items-center gap-2 pr-3 shrink-0">
                <WhatsAppButton message={formatPostMessage(p)} />
                {isAdmin && (
                  <button
                    onClick={() => onTogglePublicado(p)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      p.publicado ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'
                    }`}
                  >
                    {p.publicado && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ideas sugeridas */}
      <Section title="Ideas que funcionan">
        <div className="grid grid-cols-1 gap-2">
          <Idea icon={Video} titulo="Cover acustico en 60 seg" desc="TikTok · fragmento emocional del cover" />
          <Idea icon={Film} titulo="Detras de camaras" desc="IG Reel · ensayos, tomas falladas" />
          <Idea icon={Sparkles} titulo="Responder a comentario" desc="TikTok · usar funcion 'responder a'" />
          <Idea icon={ImageIcon} titulo="Foto estudio / carrusel" desc="IG Post · 3-5 fotos del dia de grabacion" />
        </div>
      </Section>

      {isAdmin && <FAB onClick={() => setAdding(true)} />}
      {adding && <PostFormSheet onClose={() => setAdding(false)} onSave={handleAdd} />}
      {editing && (
        <PostFormSheet
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
