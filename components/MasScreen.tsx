'use client';

import { useState } from 'react';
import { Plus, Trash2, Phone, Mail, ChevronRight, Users } from 'lucide-react';
import { Header, EmptyHint, PlataformaIcon, WhatsAppButton } from '@/components/ui';
import { MetricaFormSheet, ContactoFormSheet } from '@/components/sheets';
import { useAuth } from '@/components/AuthGate';
import { PLATAFORMAS } from '@/lib/constants';
import type { Metrica, Contacto, Plataforma } from '@/lib/types';

interface MasScreenProps {
  metricas: Metrica[];
  contactos: Contacto[];
  onAddMetrica: (data: Omit<Metrica, 'id' | 'created_at'>) => void;
  onDeleteMetrica: (id: string) => void;
  onAddContacto: (data: Omit<Contacto, 'id' | 'created_at'>) => void;
  onUpdateContacto: (contacto: Contacto) => void;
  onDeleteContacto: (id: string) => void;
}

function MetricBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-black rounded-lg p-2 border border-zinc-800">
      <div className="font-display text-lg text-zinc-100 leading-none">
        {Number(value || 0).toLocaleString('es-MX')}
      </div>
      <div className="text-[9px] uppercase tracking-wider text-zinc-500 mt-0.5">{label}</div>
    </div>
  );
}

export function MasScreen({
  metricas,
  contactos,
  onAddMetrica,
  onDeleteMetrica,
  onAddContacto,
  onUpdateContacto,
  onDeleteContacto,
}: MasScreenProps) {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState<'metricas' | 'contactos'>('metricas');
  const [addingMetrica, setAddingMetrica] = useState(false);
  const [addingContacto, setAddingContacto] = useState(false);
  const [editingContacto, setEditingContacto] = useState<Contacto | null>(null);

  const sorted = [...metricas].sort((a, b) => b.fecha.localeCompare(a.fecha));

  // Totales por plataforma (ultimo registro)
  const ultimos = PLATAFORMAS.map((p) => {
    const list = metricas
      .filter((m) => m.plataforma === p)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
    return { plataforma: p as Plataforma, ultimo: list[0] };
  });

  function handleAddMetrica(data: Omit<Metrica, 'id' | 'created_at'>) {
    onAddMetrica(data);
    setAddingMetrica(false);
  }

  function handleAddContacto(data: Omit<Contacto, 'id' | 'created_at'>) {
    onAddContacto(data);
    setAddingContacto(false);
  }

  function handleUpdateContacto(contacto: Contacto | Omit<Contacto, 'id' | 'created_at'>) {
    onUpdateContacto(contacto as Contacto);
    setEditingContacto(null);
  }

  function handleDeleteContacto(id: string) {
    onDeleteContacto(id);
    setEditingContacto(null);
  }

  return (
    <div className="fade-in">
      <Header title="MAS" subtitle="metricas y contactos" />
      <div className="px-5">
        <div className="flex gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setTab('metricas')}
            className={`flex-1 py-2 rounded-lg text-xs uppercase tracking-wider font-bold ${
              tab === 'metricas' ? 'bg-yellow-400 text-black' : 'text-zinc-400'
            }`}
          >
            Metricas
          </button>
          <button
            onClick={() => setTab('contactos')}
            className={`flex-1 py-2 rounded-lg text-xs uppercase tracking-wider font-bold ${
              tab === 'contactos' ? 'bg-yellow-400 text-black' : 'text-zinc-400'
            }`}
          >
            Contactos
          </button>
        </div>
      </div>

      {tab === 'metricas' ? (
        <div className="px-5 mt-4">
          {/* Resumen */}
          <div className="space-y-2 mb-5">
            {ultimos.map(({ plataforma, ultimo }) => (
              <div
                key={plataforma}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center gap-3"
              >
                <PlataformaIcon p={plataforma} />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-zinc-100">{plataforma}</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    {ultimo ? `Ultimo: ${ultimo.fecha}` : 'Sin registros'}
                  </div>
                </div>
                {ultimo && (
                  <div className="text-right">
                    <div className="font-display text-2xl text-yellow-400 leading-none">
                      {Number(ultimo.seguidores || 0).toLocaleString('es-MX')}
                    </div>
                    <div className="text-[9px] text-zinc-500 uppercase tracking-wider">
                      seguidores
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-xl tracking-wider text-zinc-100">Historial</h3>
            {isAdmin && (
              <button
                onClick={() => setAddingMetrica(true)}
                className="text-xs uppercase tracking-wider font-bold text-yellow-400 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Registrar
              </button>
            )}
          </div>

          {sorted.length === 0 ? (
            <EmptyHint text="Registra vistas, likes y seguidores cada semana para ver el crecimiento." />
          ) : (
            <div className="space-y-2">
              {sorted.map((m) => (
                <div key={m.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-yellow-400">
                        {m.plataforma}
                      </span>
                      <span className="text-[10px] text-zinc-500">{m.fecha}</span>
                    </div>
                    {isAdmin && (
                      <button onClick={() => onDeleteMetrica(m.id)} className="text-zinc-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <MetricBox label="Vistas" value={m.vistas} />
                    <MetricBox label="Likes" value={m.likes} />
                    <MetricBox label="Seguidores" value={m.seguidores} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {addingMetrica && (
            <MetricaFormSheet onClose={() => setAddingMetrica(false)} onSave={handleAddMetrica} />
          )}
        </div>
      ) : (
        <div className="px-5 mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-xl tracking-wider text-zinc-100">Equipo y aliados</h3>
            {isAdmin && (
              <button
                onClick={() => setAddingContacto(true)}
                className="text-xs uppercase tracking-wider font-bold text-yellow-400 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            )}
          </div>
          {contactos.length === 0 ? (
            <EmptyHint text="Agrega productores, editores, fotografos, otros artistas..." />
          ) : (
            <div className="space-y-2">
              {contactos.map((c) => (
                <div
                  key={c.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-2 overflow-hidden"
                >
                  <button
                    onClick={() => isAdmin && setEditingContacto(c)}
                    className="flex-1 text-left p-3 flex items-center gap-3 active:bg-zinc-900 transition min-w-0"
                    disabled={!isAdmin}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800/60 to-zinc-800 border border-zinc-800/40 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-zinc-100 truncate">{c.nombre}</div>
                      <div className="text-xs text-zinc-500 truncate">{c.rol}</div>
                      <div className="flex gap-3 mt-1 text-[11px] text-yellow-400/80">
                        {c.telefono && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {c.telefono}
                          </span>
                        )}
                        {c.email && (
                          <span className="flex items-center gap-1 truncate">
                            <Mail className="w-3 h-3" />
                            {c.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </button>
                  {c.telefono && (
                    <div className="pr-3">
                      <WhatsAppButton
                        phone={c.telefono}
                        message={`Hola ${c.nombre.split(' ')[0]}, te escribo del equipo de Kevin Moralez.`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {addingContacto && (
            <ContactoFormSheet onClose={() => setAddingContacto(false)} onSave={handleAddContacto} />
          )}
          {editingContacto && (
            <ContactoFormSheet
              initial={editingContacto}
              onClose={() => setEditingContacto(null)}
              onSave={handleUpdateContacto}
              onDelete={handleDeleteContacto}
            />
          )}
        </div>
      )}
    </div>
  );
}
