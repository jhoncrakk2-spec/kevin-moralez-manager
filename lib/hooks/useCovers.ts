'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Cover } from '@/lib/types';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export function useCovers() {
  const [covers, setCovers] = useState<Cover[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar datos iniciales
    supabase
      .from('covers')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setCovers(data || []);
        setLoading(false);
      });

    // Suscribirse a cambios en tiempo real
    const channel = supabase
      .channel('covers-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'covers' },
        (payload: RealtimePostgresChangesPayload<Cover>) => {
          if (payload.eventType === 'INSERT') {
            setCovers((prev) => [payload.new as Cover, ...prev]);
          }
          if (payload.eventType === 'UPDATE') {
            setCovers((prev) =>
              prev.map((c) => (c.id === (payload.new as Cover).id ? (payload.new as Cover) : c))
            );
          }
          if (payload.eventType === 'DELETE') {
            setCovers((prev) => prev.filter((c) => c.id !== (payload.old as Cover).id));
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  async function add(cover: Omit<Cover, 'id' | 'created_at' | 'updated_at'>) {
    const { error } = await supabase.from('covers').insert(cover);
    if (error) {
      console.error('Error adding cover:', error);
      alert(`Error al guardar: ${error.message}`);
    }
  }

  async function update(cover: Cover) {
    const { id, created_at, ...rest } = cover;
    const { error } = await supabase
      .from('covers')
      .update({ ...rest, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) console.error('Error updating cover:', error);
  }

  async function remove(id: string) {
    const { error } = await supabase.from('covers').delete().eq('id', id);
    if (error) console.error('Error deleting cover:', error);
  }

  return { covers, loading, add, update, remove };
}
