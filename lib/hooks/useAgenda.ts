'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Evento } from '@/lib/types';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export function useAgenda() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('agenda')
      .select('*')
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true })
      .then(({ data }) => {
        setEventos(data || []);
        setLoading(false);
      });

    const channel = supabase
      .channel('agenda-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agenda' },
        (payload: RealtimePostgresChangesPayload<Evento>) => {
          if (payload.eventType === 'INSERT') {
            setEventos((prev) => [...prev, payload.new as Evento].sort((a, b) =>
              a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora)
            ));
          }
          if (payload.eventType === 'UPDATE') {
            setEventos((prev) =>
              prev.map((e) => (e.id === (payload.new as Evento).id ? (payload.new as Evento) : e))
            );
          }
          if (payload.eventType === 'DELETE') {
            setEventos((prev) => prev.filter((e) => e.id !== (payload.old as Evento).id));
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  async function add(evento: Omit<Evento, 'id' | 'created_at'>) {
    const { error } = await supabase.from('agenda').insert(evento);
    if (error) {
      console.error('Error adding evento:', error);
      alert(`Error al guardar: ${error.message}`);
    }
  }

  async function update(evento: Evento) {
    const { id, created_at, ...rest } = evento;
    const { error } = await supabase.from('agenda').update(rest).eq('id', id);
    if (error) console.error('Error updating evento:', error);
  }

  async function remove(id: string) {
    const { error } = await supabase.from('agenda').delete().eq('id', id);
    if (error) console.error('Error deleting evento:', error);
  }

  async function toggleHecho(evento: Evento) {
    const { error } = await supabase
      .from('agenda')
      .update({ hecho: !evento.hecho })
      .eq('id', evento.id);
    if (error) console.error('Error toggling hecho:', error);
  }

  return { eventos, loading, add, update, remove, toggleHecho };
}
