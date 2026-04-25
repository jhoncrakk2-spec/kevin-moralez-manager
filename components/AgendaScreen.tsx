'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Header, EmptyHint, FAB, WhatsAppButton } from '@/components/ui';
import { EventFormSheet } from '@/components/sheets';
import { useAuth } from '@/components/AuthGate';
import { getTodayISO, splitTime12h, formatEventMessage } from '@/lib/format';
import type { Evento } from '@/lib/types';

interface AgendaScreenProps {
  eventos: Evento[];
  onAdd: (evento: Omit<Evento, 'id' | 'created_at'>) => void;
  onUpdate: (evento: Evento) => void;
  onDelete: (id: string) => void;
  onToggleHecho: (evento: Evento) => void;
}

export function AgendaScreen({
  eventos,
  onAdd,
  onUpdate,
  onDelete,
  onToggleHecho,
}: AgendaScreenProps) {
  const { isAdmin } = useAuth();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Evento | null>(null);

  // Agrupar por fecha y ordenar
  const grouped = eventos.reduce((acc, e) => {
    (acc[e.fecha] = acc[e.fecha] || []).push(e);
    return acc;
  }, {} as Record<string, Evento[]>);
  const fechas = Object.keys(grouped).sort();

  function handleAdd(data: Omit<Evento, 'id' | 'created_at'>) {
    onAdd(data);
    setAdding(false);
  }

  function handleUpdate(evento: Evento | Omit<Evento, 'id' | 'created_at'>) {
    onUpdate(evento as Evento);
    setEditing(null);
  }

  function handleDelete(id: string) {
    onDelete(id);
    setEditing(null);
  }

  return (
    <div className="fade-in">
      <Header title="AGENDA" subtitle="horarios, ensayos, grabaciones" />

      <div className="px-5 mt-2 space-y-5">
        {fechas.length === 0 && <EmptyHint text="Agenda vacia. Toca + para programar." />}
        {fechas.map((f) => {
          const d = new Date(f + 'T12:00');
          const isToday = f === getTodayISO();
          const sorted = [...grouped[f]].sort((a, b) => a.hora.localeCompare(b.hora));
          return (
            <div key={f}>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`font-display text-3xl leading-none ${
                    isToday ? 'text-yellow-400' : 'text-zinc-300'
                  }`}
                >
                  {d.getDate()}
                </div>
                <div>
                  <div
                    className={`text-xs uppercase tracking-[0.2em] font-bold ${
                      isToday ? 'text-yellow-400' : 'text-zinc-500'
                    }`}
                  >
                    {d.toLocaleDateString('es-MX', { weekday: 'long' })} {isToday && '· Hoy'}
                  </div>
                  <div className="text-[10px] text-zinc-600 uppercase tracking-wider">
                    {d.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div className="flex-1 h-px bg-zinc-800" />
              </div>
              <div className="space-y-2">
                {sorted.map((e) => {
                  const t = splitTime12h(e.hora);
                  return (
                    <div
                      key={e.id}
                      className="flex items-stretch bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => isAdmin && onToggleHecho(e)}
                        className={`w-1.5 shrink-0 ${
                          e.hecho ? 'bg-emerald-500' : 'bg-yellow-400'
                        }`}
                        disabled={!isAdmin}
                      />
                      <button
                        onClick={() => isAdmin && setEditing(e)}
                        className="flex-1 flex items-center gap-3 py-3 pl-3 text-left min-w-0"
                        disabled={!isAdmin}
                      >
                        <div className="w-14 shrink-0 text-center">
                          <div
                            className={`font-display text-lg leading-none ${
                              e.hecho ? 'text-zinc-500' : 'text-zinc-100'
                            }`}
                          >
                            {t.time}
                          </div>
                          <div className="text-[9px] text-yellow-400/70 font-bold tracking-widest mt-0.5">
                            {t.period}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] text-yellow-400 uppercase font-bold tracking-wider truncate">
                            {e.tipo}
                          </div>
                          <div
                            className={`text-sm font-semibold truncate mt-0.5 ${
                              e.hecho ? 'line-through text-zinc-500' : 'text-zinc-100'
                            }`}
                          >
                            {e.titulo}
                          </div>
                          {e.notas && (
                            <div className="text-xs text-zinc-500 truncate">{e.notas}</div>
                          )}
                        </div>
                        {e.hecho && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </button>
                      <div className="flex items-center pr-3">
                        <WhatsAppButton message={formatEventMessage(e)} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {isAdmin && <FAB onClick={() => setAdding(true)} />}
      {adding && <EventFormSheet onClose={() => setAdding(false)} onSave={handleAdd} />}
      {editing && (
        <EventFormSheet
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
