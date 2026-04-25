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
    console.log('Intentando guardar cover:', cover);
    const { data, error } = await supabase.from('covers').insert(cover).select();
    console.log('Resultado:', { data, error });
    if (error) {
      console.error('Error adding cover:', error);
      alert(`Error al guardar: ${error.message}`);
    } else {
      alert('Cover guardado exitosamente!');
    }
  }

  async function update(cover: Cover) {
    const { id, created_at, ...rest } = cover;
    console.log('Actualizando cover:', { id, rest });
    const { data, error } = await supabase
      .from('covers')
      .update({ ...rest, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    console.log('Resultado update:', { data, error });
    if (error) {
      console.error('Error updating cover:', error);
      alert(`Error al actualizar: ${error.message}`);
    }
  }

  async function remove(id: string) {
    const { error } = await supabase.from('covers').delete().eq('id', id);
    if (error) console.error('Error deleting cover:', error);
  }

  return { covers, loading, add, update, remove };
}
