'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Metrica } from '@/lib/types';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export function useMetricas() {
  const [metricas, setMetricas] = useState<Metrica[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('metricas')
      .select('*')
      .order('fecha', { ascending: false })
      .then(({ data }) => {
        setMetricas(data || []);
        setLoading(false);
      });

    const channel = supabase
      .channel('metricas-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'metricas' },
        (payload: RealtimePostgresChangesPayload<Metrica>) => {
          if (payload.eventType === 'INSERT') {
            setMetricas((prev) => [payload.new as Metrica, ...prev]);
          }
          if (payload.eventType === 'UPDATE') {
            setMetricas((prev) =>
              prev.map((m) => (m.id === (payload.new as Metrica).id ? (payload.new as Metrica) : m))
            );
          }
          if (payload.eventType === 'DELETE') {
            setMetricas((prev) => prev.filter((m) => m.id !== (payload.old as Metrica).id));
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  async function add(metrica: Omit<Metrica, 'id' | 'created_at'>) {
    const { error } = await supabase.from('metricas').insert(metrica);
    if (error) console.error('Error adding metrica:', error);
  }

  async function remove(id: string) {
    const { error } = await supabase.from('metricas').delete().eq('id', id);
    if (error) console.error('Error deleting metrica:', error);
  }

  return { metricas, loading, add, remove };
}
