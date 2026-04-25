import type { StatusConfig, TipoEvento, TipoPost, Plataforma } from './types';

export const CHECKLIST_BASE = [
  'Elegir canción',
  'Conseguir pista instrumental',
  'Ensayo vocal',
  'Grabación de audio',
  'Grabación de video',
  'Edición de audio',
  'Edición de video',
  'Diseño de miniatura',
  'Título, descripción y hashtags',
  'Programar en YouTube',
  'Publicar cover',
  'Promo en TikTok',
  'Promo en Instagram',
] as const;

export const COVER_STATUSES: StatusConfig[] = [
  { id: 'ideas', label: 'Idea', accent: 'bg-zinc-700 text-zinc-200' },
  { id: 'ensayo', label: 'Ensayo', accent: 'bg-zinc-800/50 text-yellow-400' },
  { id: 'grabado', label: 'Grabado', accent: 'bg-orange-900/60 text-orange-200' },
  { id: 'editado', label: 'Editado', accent: 'bg-yellow-900/60 text-yellow-100' },
  { id: 'publicado', label: 'Publicado', accent: 'bg-emerald-900/60 text-emerald-200' },
];

export const TIPOS_EVENTO: TipoEvento[] = [
  'Ensayo',
  'Presentación',
  'Grabación audio',
  'Grabación video',
  'Edición',
  'Publicación',
  'Promo',
  'Reunión',
  'Otro',
];

export const TIPOS_POST: TipoPost[] = [
  'Teaser del cover',
  'Detrás de cámaras',
  'Fragmento de cover',
  'Trend viral',
  'Interacción con fans',
  'Live / Q&A',
  'Anuncio',
  'Otro',
];

export const PLATAFORMAS: Plataforma[] = ['TikTok', 'Instagram', 'YouTube'];

// Datos del artista (hardcoded, se sincroniza con tabla artist de Supabase)
export const ARTIST_DEFAULT = {
  nombre: 'Kevin Moralez',
  bio: 'Regional mexicano • Corridos • Covers',
  whatsapp: '+593998176306',
  spotify_url: 'https://open.spotify.com/artist/44Ey8qSSuDVvw5sspOj0AE',
  youtube_url: 'https://youtube.com/@kevinmoralez_',
  instagram_url: 'https://www.instagram.com/kevinmoralezoficial',
  foto_url: 'https://images.weserv.nl/?url=i.scdn.co/image/ab67616100005174893a84fa2d1b9ae008fe1eaa',
};
