'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Contacto } from '@/lib/types';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export function useContactos() {
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('contactos')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setContactos(data || []);
        setLoading(false);
      });

    const channel = supabase
      .channel('contactos-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contactos' },
        (payload: RealtimePostgresChangesPayload<Contacto>) => {
          if (payload.eventType === 'INSERT') {
            setContactos((prev) => [payload.new as Contacto, ...prev]);
          }
          if (payload.eventType === 'UPDATE') {
            setContactos((prev) =>
              prev.map((c) => (c.id === (payload.new as Contacto).id ? (payload.new as Contacto) : c))
            );
          }
          if (payload.eventType === 'DELETE') {
            setContactos((prev) => prev.filter((c) => c.id !== (payload.old as Contacto).id));
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  async function add(contacto: Omit<Contacto, 'id' | 'created_at'>) {
    const { error } = await supabase.from('contactos').insert(contacto);
    if (error) console.error('Error adding contacto:', error);
  }

  async function update(contacto: Contacto) {
    const { id, created_at, ...rest } = contacto;
    const { error } = await supabase.from('contactos').update(rest).eq('id', id);
    if (error) console.error('Error updating contacto:', error);
  }

  async function remove(id: string) {
    const { error } = await supabase.from('contactos').delete().eq('id', id);
    if (error) console.error('Error deleting contacto:', error);
  }

  return { contactos, loading, add, update, remove };
}
