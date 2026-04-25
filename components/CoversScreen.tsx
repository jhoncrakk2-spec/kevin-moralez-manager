'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Header, EmptyHint, FilterChip, StatusPill, CoverArt, FAB } from '@/components/ui';
import { CoverFormSheet, CoverDetailSheet } from '@/components/sheets';
import { useAuth } from '@/components/AuthGate';
import { COVER_STATUSES, CHECKLIST_BASE } from '@/lib/constants';
import type { Cover, CoverStatus } from '@/lib/types';

interface CoversScreenProps {
  covers: Cover[];
  onAdd: (cover: Omit<Cover, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdate: (cover: Cover) => void;
  onDelete: (id: string) => void;
}

export function CoversScreen({ covers, onAdd, onUpdate, onDelete }: CoversScreenProps) {
  const { isAdmin } = useAuth();
  const [filter, setFilter] = useState<CoverStatus | 'todos'>('todos');
  const [editing, setEditing] = useState<Cover | null>(null);
  const [adding, setAdding] = useState(false);

  const filtered = filter === 'todos' ? covers : covers.filter((c) => c.status === filter);
  const counts = COVER_STATUSES.reduce(
    (acc, s) => ({ ...acc, [s.id]: covers.filter((c) => c.status === s.id).length }),
    { todos: covers.length } as Record<string, number>
  );

  function handleAdd(data: {
    titulo: string;
    artista_original: string;
    status: CoverStatus;
    notas: string;
    imagen_url: string;
    link_externo: string;
  }) {
    onAdd({
      titulo: data.titulo,
      artista_original: data.artista_original,
      status: data.status,
      fecha_publicacion: null,
      link_externo: data.link_externo,
      imagen_url: data.imagen_url,
      notas: data.notas,
      checklist: {},
    });
    setAdding(false);
  }

  function handleUpdate(cover: Cover | Omit<Cover, 'id' | 'created_at'>) {
    onUpdate(cover as Cover);
    setEditing(null);
  }

  function handleDelete(id: string) {
    onDelete(id);
    setEditing(null);
  }

  return (
    <div className="fade-in">
      <Header title="CATALOGO" subtitle="todos los covers de Kevin" />

      {/* Filter tabs */}
      <div className="px-5 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 pb-1">
          <FilterChip
            active={filter === 'todos'}
            onClick={() => setFilter('todos')}
            label="Todos"
            count={counts.todos}
          />
          {COVER_STATUSES.map((s) => (
            <FilterChip
              key={s.id}
              active={filter === s.id}
              onClick={() => setFilter(s.id)}
              label={s.label}
              count={counts[s.id]}
            />
          ))}
        </div>
      </div>

      <div className="px-5 mt-4 space-y-2">
        {filtered.length === 0 ? (
          <EmptyHint text="Sin covers en esta categoria. Toca + para agregar." />
        ) : (
          filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setEditing(c)}
              className="w-full text-left bg-zinc-900 border border-zinc-800 hover:border-zinc-800/60 rounded-xl p-3 flex items-center gap-3 active:scale-[0.98] transition"
            >
              <CoverArt src={c.imagen_url} alt={c.titulo} className="w-14 h-14 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-zinc-100 truncate">{c.titulo}</div>
                {c.status === 'publicado' && (
                  <div className="text-xs text-zinc-500 italic truncate">Kevin Moralez</div>
                )}
                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                  <StatusPill status={c.status} />
                  {c.status === 'publicado' && c.fecha_publicacion && (
                    <span className="text-[10px] text-yellow-400/80 font-bold">
                      {c.fecha_publicacion}
                    </span>
                  )}
                  <span className="text-[10px] text-zinc-600">
                    {Object.values(c.checklist).filter(Boolean).length}/{CHECKLIST_BASE.length}{' '}
                    tareas
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </button>
          ))
        )}
      </div>

      {isAdmin && <FAB onClick={() => setAdding(true)} />}

      {adding && <CoverFormSheet onClose={() => setAdding(false)} onSave={handleAdd} />}
      {editing && (
        <CoverDetailSheet
          cover={editing}
          onClose={() => setEditing(null)}
          onSave={handleUpdate}
          onDelete={handleDelete}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
