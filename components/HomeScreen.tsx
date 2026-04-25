'use client';

import { useState } from 'react';
import { Video, Upload, Clock, Disc3, Music2, Calendar, Radio, BarChart3, ChevronRight, Camera } from 'lucide-react';
import {
  StatCard,
  Section,
  EmptyHint,
  QuickAction,
  SocialLink,
  ArtistPhoto,
  CoverArt,
  StatusPill,
  WhatsAppButton,
  PlataformaIcon,
  YoutubeIcon,
} from '@/components/ui';
import { PhotoSheet } from '@/components/sheets';
import { useAuth } from '@/components/AuthGate';
import { getTodayISO, splitTime12h, formatEventMessage, formatPostMessage } from '@/lib/format';
import type { Cover, Evento, Post, Artist } from '@/lib/types';
import type { TabId } from './BottomNav';

interface HomeScreenProps {
  covers: Cover[];
  agenda: Evento[];
  posts: Post[];
  artist: Artist;
  onPhotoChange: (url: string | null) => void;
  go: (tab: TabId) => void;
}

export function HomeScreen({
  covers,
  agenda,
  posts,
  artist,
  onPhotoChange,
  go,
}: HomeScreenProps) {
  const { isAdmin } = useAuth();
  const today = getTodayISO();
  const pubCount = covers.filter((c) => c.status === 'publicado').length;
  const proxCount = covers.filter((c) => c.status === 'editado' || c.status === 'grabado').length;
  const eventosHoy = agenda
    .filter((a) => a.fecha === today)
    .sort((a, b) => a.hora.localeCompare(b.hora));
  const postsHoy = posts.filter((p) => p.fecha === today);
  const pendHoy =
    eventosHoy.filter((e) => !e.hecho).length + postsHoy.filter((p) => !p.publicado).length;
  const [photoSheet, setPhotoSheet] = useState(false);

  const hasCustomPhoto = artist.foto_url !== 'https://images.weserv.nl/?url=i.scdn.co/image/ab67616100005174893a84fa2d1b9ae008fe1eaa';

  return (
    <div className="fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 papel opacity-40" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-400/[0.07] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 -left-20 w-48 h-48 bg-yellow-400/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="relative px-5 pt-6 pb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="text-yellow-400 text-[10px] uppercase tracking-[0.3em] font-bold">
              Manager Dashboard
            </div>
            <div className="text-zinc-500 text-[10px] uppercase tracking-widest">
              {new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <button
              onClick={() => isAdmin && setPhotoSheet(true)}
              className={`relative shrink-0 mb-4 ${isAdmin ? 'active:scale-95' : ''} transition`}
              disabled={!isAdmin}
            >
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-yellow-400 ring-offset-4 ring-offset-black shadow-2xl shadow-yellow-900/30">
                <ArtistPhoto src={artist.foto_url} alt={artist.nombre} className="w-full h-full" />
              </div>
              {isAdmin && (
                <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-yellow-400 rounded-full border-[3px] border-black flex items-center justify-center shadow-lg">
                  <Camera className="w-4 h-4 text-black" strokeWidth={2.75} />
                </div>
              )}
            </button>

            <h1 className="font-display text-5xl text-white leading-[0.9] tracking-wide">
              KEVIN MORALEZ
            </h1>
            <p className="text-zinc-400 text-sm mt-2 font-serif-display italic">{artist.bio}</p>
          </div>

          <div className="mt-5 flex gap-2">
            <SocialLink href={artist.spotify_url} label="Spotify" />
            <SocialLink href={artist.youtube_url} label="YouTube" />
            <SocialLink href={artist.instagram_url} label="Instagram" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 grid grid-cols-2 gap-3 mt-2">
        <StatCard label="Covers publicados" value={pubCount} icon={Video} tone="amber" />
        <StatCard label="Listos para salir" value={proxCount} icon={Upload} tone="emerald" />
        <StatCard label="Pendientes hoy" value={pendHoy} icon={Clock} tone="red" />
        <StatCard label="Total canciones" value={covers.length} icon={Disc3} tone="stone" />
      </div>

      {/* Hoy */}
      <Section
        title="Hoy"
        action={
          eventosHoy.length > 0 ? { label: 'Ver agenda', onClick: () => go('agenda') } : undefined
        }
      >
        {eventosHoy.length === 0 && postsHoy.length === 0 ? (
          <EmptyHint text="Sin actividades programadas. Buen momento para planear el proximo cover." />
        ) : (
          <div className="space-y-2">
            {eventosHoy.map((e) => {
              const t = splitTime12h(e.hora);
              return (
                <div
                  key={e.id}
                  className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-3"
                >
                  <div className="w-12 shrink-0 text-center">
                    <div className="font-display text-xl text-yellow-400 leading-none">
                      {t.time}
                    </div>
                    <div className="text-[9px] text-yellow-400/70 font-bold tracking-widest mt-0.5">
                      {t.period}
                    </div>
                  </div>
                  <div className="w-px h-10 bg-zinc-800/50 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase text-yellow-400/90 tracking-wider font-bold truncate">
                      {e.tipo}
                    </div>
                    <div
                      className={`text-sm font-semibold truncate mt-0.5 ${
                        e.hecho ? 'line-through text-zinc-500' : 'text-zinc-100'
                      }`}
                    >
                      {e.titulo}
                    </div>
                    {e.notas && <div className="text-xs text-zinc-500 truncate">{e.notas}</div>}
                  </div>
                  <WhatsAppButton message={formatEventMessage(e)} stopProp={false} />
                </div>
              );
            })}
            {postsHoy.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-3"
              >
                <div className="w-12 flex justify-center">
                  <PlataformaIcon p={p.plataforma} />
                </div>
                <div className="w-px h-10 bg-zinc-800/50" />
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-semibold truncate ${
                      p.publicado ? 'line-through text-zinc-500' : 'text-zinc-100'
                    }`}
                  >
                    {p.tipo}
                  </div>
                  <div className="text-xs text-zinc-500 truncate">{p.contenido}</div>
                </div>
                {p.publicado ? (
                  <div className="w-4 h-4 text-emerald-400">✓</div>
                ) : (
                  <WhatsAppButton message={formatPostMessage(p)} stopProp={false} />
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Proximo cover */}
      <Section title="Proximo lanzamiento">
        {(() => {
          const next =
            covers.find((c) => c.status === 'editado') ||
            covers.find((c) => c.status === 'grabado');
          if (!next) return <EmptyHint text="Ningun cover listo aun." />;
          return (
            <button
              onClick={() => go('covers')}
              className="w-full text-left bg-gradient-to-br from-zinc-800/40 via-zinc-900 to-zinc-900 border border-zinc-800/50 rounded-2xl p-4 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-400/10 rounded-full blur-2xl" />
              <div className="flex items-center gap-4">
                <CoverArt src={next.imagen_url} alt={next.titulo} className="w-16 h-16 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-yellow-400 font-bold">
                    Proxima salida
                  </div>
                  <div className="font-display text-2xl mt-0.5 text-white leading-tight truncate">
                    {next.titulo}
                  </div>
                  <div className="text-zinc-400 text-xs font-serif-display italic truncate">
                    {next.artista_original}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-yellow-400 shrink-0" />
              </div>
              <div className="mt-3">
                <StatusPill status={next.status} />
              </div>
            </button>
          );
        })()}
      </Section>

      {/* Acciones rapidas */}
      <Section title="Accesos rapidos">
        <div className="grid grid-cols-2 gap-3">
          <QuickAction label="Nuevo cover" icon={Music2} onClick={() => go('covers')} />
          <QuickAction label="Agendar" icon={Calendar} onClick={() => go('agenda')} />
          <QuickAction label="Publicacion" icon={Radio} onClick={() => go('redes')} />
          <QuickAction label="Metricas" icon={BarChart3} onClick={() => go('mas')} />
        </div>
      </Section>

      {photoSheet && (
        <PhotoSheet
          currentPhoto={artist.foto_url}
          hasOverride={hasCustomPhoto}
          onClose={() => setPhotoSheet(false)}
          onSave={(v) => {
            onPhotoChange(v);
          }}
        />
      )}
    </div>
  );
}
