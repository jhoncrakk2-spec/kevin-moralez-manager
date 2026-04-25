'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Artist } from '@/lib/types';
import { ARTIST_DEFAULT } from '@/lib/constants';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export function useArtist() {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('artist')
      .select('*')
      .single()
      .then(({ data }) => {
        setArtist(data || null);
        setLoading(false);
      });

    const channel = supabase
      .channel('artist-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'artist' },
        (payload: RealtimePostgresChangesPayload<Artist>) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setArtist(payload.new as Artist);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  async function updatePhoto(foto_url: string | null) {
    const { error } = await supabase.rpc('update_artist_photo', {
      new_foto_url: foto_url || ARTIST_DEFAULT.foto_url,
    });
    if (error) console.error('Error updating photo:', error);
  }

  // Devuelve datos del artista o los defaults
  const artistData: Artist = artist || {
    id: '',
    nombre: ARTIST_DEFAULT.nombre,
    bio: ARTIST_DEFAULT.bio,
    whatsapp: ARTIST_DEFAULT.whatsapp,
    spotify_url: ARTIST_DEFAULT.spotify_url,
    youtube_url: ARTIST_DEFAULT.youtube_url,
    instagram_url: ARTIST_DEFAULT.instagram_url,
    foto_url: ARTIST_DEFAULT.foto_url,
  };

  return { artist: artistData, loading, updatePhoto };
}
