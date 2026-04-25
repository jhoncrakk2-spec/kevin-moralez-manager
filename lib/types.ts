// Tipos basados en el esquema de Supabase

export interface Artist {
  id: string;
  nombre: string;
  bio: string;
  whatsapp: string;
  spotify_url: string;
  youtube_url: string;
  instagram_url: string;
  foto_url: string;
  updated_at?: string;
}

export interface Cover {
  id: string;
  titulo: string;
  artista_original: string;
  status: CoverStatus;
  fecha_publicacion: string | null;
  link_externo: string;
  imagen_url: string;
  notas: string;
  checklist: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
}

export type CoverStatus = 'ideas' | 'ensayo' | 'grabado' | 'editado' | 'publicado';

export interface Evento {
  id: string;
  fecha: string;
  hora: string;
  titulo: string;
  tipo: TipoEvento;
  notas: string;
  hecho: boolean;
  created_at?: string;
}

export type TipoEvento =
  | 'Ensayo'
  | 'Presentación'
  | 'Grabación audio'
  | 'Grabación video'
  | 'Edición'
  | 'Publicación'
  | 'Promo'
  | 'Reunión'
  | 'Otro';

export interface Post {
  id: string;
  fecha: string;
  plataforma: Plataforma;
  tipo: TipoPost;
  contenido: string;
  hashtags: string;
  publicado: boolean;
  created_at?: string;
}

export type Plataforma = 'TikTok' | 'Instagram' | 'YouTube';

export type TipoPost =
  | 'Teaser del cover'
  | 'Detrás de cámaras'
  | 'Fragmento de cover'
  | 'Trend viral'
  | 'Interacción con fans'
  | 'Live / Q&A'
  | 'Anuncio'
  | 'Otro';

export interface Metrica {
  id: string;
  fecha: string;
  plataforma: Plataforma;
  vistas: number;
  likes: number;
  seguidores: number;
  created_at?: string;
}

export interface Contacto {
  id: string;
  nombre: string;
  rol: string;
  telefono: string;
  email: string;
  notas: string;
  created_at?: string;
}

export interface Profile {
  id: string;
  email: string;
  role: 'admin' | 'viewer';
  created_at?: string;
}

// Tipo para el status con estilos
export interface StatusConfig {
  id: CoverStatus;
  label: string;
  accent: string;
}
