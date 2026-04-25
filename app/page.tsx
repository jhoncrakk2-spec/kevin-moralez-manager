'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Disc3 } from 'lucide-react';
import { BottomNav, type TabId } from '@/components/BottomNav';
import { HomeScreen } from '@/components/HomeScreen';
import { CoversScreen } from '@/components/CoversScreen';
import { AgendaScreen } from '@/components/AgendaScreen';
import { RedesScreen } from '@/components/RedesScreen';
import { MasScreen } from '@/components/MasScreen';
import { useCovers, useAgenda, usePosts, useMetricas, useContactos, useArtist } from '@/lib/hooks';
import { useAuth } from '@/components/AuthGate';

export default function HomePage() {
  const router = useRouter();
  const { user, loading: loadingAuth } = useAuth();
  const [tab, setTab] = useState<TabId>('home');

  const { covers, loading: loadingCovers, add: addCover, update: updateCover, remove: removeCover } = useCovers();
  const { eventos, loading: loadingAgenda, add: addEvento, update: updateEvento, remove: removeEvento, toggleHecho } = useAgenda();
  const { posts, loading: loadingPosts, add: addPost, update: updatePost, remove: removePost, togglePublicado } = usePosts();
  const { metricas, loading: loadingMetricas, add: addMetrica, remove: removeMetrica } = useMetricas();
  const { contactos, loading: loadingContactos, add: addContacto, update: updateContacto, remove: removeContacto } = useContactos();
  const { artist, loading: loadingArtist, updatePhoto } = useArtist();

  const loading = loadingAuth || loadingCovers || loadingAgenda || loadingPosts || loadingMetricas || loadingContactos || loadingArtist;

  // Redirigir a login si no hay usuario
  if (!loadingAuth && !user) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-yellow-400 font-body">
        <div className="text-center">
          <Disc3 className="w-10 h-10 mx-auto animate-spin text-yellow-400" />
          <div className="mt-4 font-display text-2xl tracking-wider">Cargando datos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-body text-zinc-100 bg-black">
      <div className="max-w-md mx-auto relative pb-28">
        {/* Top decorative bar */}
        <div className="h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

        {tab === 'home' && (
          <HomeScreen
            covers={covers}
            agenda={eventos}
            posts={posts}
            artist={artist}
            onPhotoChange={updatePhoto}
            go={setTab}
          />
        )}
        {tab === 'covers' && (
          <CoversScreen
            covers={covers}
            onAdd={addCover}
            onUpdate={updateCover}
            onDelete={removeCover}
          />
        )}
        {tab === 'agenda' && (
          <AgendaScreen
            eventos={eventos}
            onAdd={addEvento}
            onUpdate={updateEvento}
            onDelete={removeEvento}
            onToggleHecho={toggleHecho}
          />
        )}
        {tab === 'redes' && (
          <RedesScreen
            posts={posts}
            onAdd={addPost}
            onUpdate={updatePost}
            onDelete={removePost}
            onTogglePublicado={togglePublicado}
          />
        )}
        {tab === 'mas' && (
          <MasScreen
            metricas={metricas}
            contactos={contactos}
            onAddMetrica={addMetrica}
            onDeleteMetrica={removeMetrica}
            onAddContacto={addContacto}
            onUpdateContacto={updateContacto}
            onDeleteContacto={removeContacto}
          />
        )}

        <BottomNav tab={tab} setTab={setTab} />
      </div>
    </div>
  );
}
