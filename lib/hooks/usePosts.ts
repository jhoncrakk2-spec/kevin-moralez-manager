'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Post } from '@/lib/types';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('posts')
      .select('*')
      .order('fecha', { ascending: false })
      .then(({ data }) => {
        setPosts(data || []);
        setLoading(false);
      });

    const channel = supabase
      .channel('posts-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        (payload: RealtimePostgresChangesPayload<Post>) => {
          if (payload.eventType === 'INSERT') {
            setPosts((prev) => [payload.new as Post, ...prev]);
          }
          if (payload.eventType === 'UPDATE') {
            setPosts((prev) =>
              prev.map((p) => (p.id === (payload.new as Post).id ? (payload.new as Post) : p))
            );
          }
          if (payload.eventType === 'DELETE') {
            setPosts((prev) => prev.filter((p) => p.id !== (payload.old as Post).id));
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  async function add(post: Omit<Post, 'id' | 'created_at'>) {
    const { error } = await supabase.from('posts').insert(post);
    if (error) console.error('Error adding post:', error);
  }

  async function update(post: Post) {
    const { id, created_at, ...rest } = post;
    const { error } = await supabase.from('posts').update(rest).eq('id', id);
    if (error) console.error('Error updating post:', error);
  }

  async function remove(id: string) {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) console.error('Error deleting post:', error);
  }

  async function togglePublicado(post: Post) {
    const { error } = await supabase
      .from('posts')
      .update({ publicado: !post.publicado })
      .eq('id', post.id);
    if (error) console.error('Error toggling publicado:', error);
  }

  return { posts, loading, add, update, remove, togglePublicado };
}
