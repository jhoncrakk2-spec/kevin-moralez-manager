import type { Cover, Evento, Post } from './types';
import { CHECKLIST_BASE, COVER_STATUSES } from './constants';

// Genera un ID único
export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

// Fecha de hoy en formato ISO (YYYY-MM-DD)
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

// Fecha de mañana en formato ISO
export function getTomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

// Formatea hora HH:MM (24h) a 12h con AM/PM
export function formatTime12h(time24: string): string {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return time24;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

// Devuelve { time, period } para mostrar separados en UI
export function splitTime12h(time24: string): { time: string; period: string } {
  if (!time24) return { time: '', period: '' };
  const [h, m] = time24.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return { time: time24, period: '' };
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return { time: `${h12}:${String(m).padStart(2, '0')}`, period };
}

// Mensaje de WhatsApp para evento
export function formatEventMessage(e: Evento): string {
  const d = new Date(e.fecha + 'T12:00');
  const fecha = d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  const hora = formatTime12h(e.hora);
  let msg = `*Recordatorio — Kevin Moralez*\n\n*${e.titulo}*`;
  msg += `\n\n• Fecha: ${fecha}`;
  msg += `\n• Hora: ${hora}`;
  msg += `\n• Tipo: ${e.tipo}`;
  if (e.notas) msg += `\n• Lugar / notas: ${e.notas}`;
  return msg;
}

// Mensaje de WhatsApp para post
export function formatPostMessage(p: Post): string {
  const d = new Date(p.fecha + 'T12:00');
  const fecha = d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  let msg = `*Publicación programada*\n\n*${p.plataforma} — ${p.tipo}*`;
  msg += `\n• Fecha: ${fecha}`;
  msg += `\n\n${p.contenido}`;
  if (p.hashtags) msg += `\n\n${p.hashtags}`;
  return msg;
}

// Mensaje de WhatsApp para cover
export function formatCoverMessage(c: Cover): string {
  const checkObj = c.checklist || {};
  const done = Object.values(checkObj).filter(Boolean).length;
  const pct = Math.round((done / CHECKLIST_BASE.length) * 100);
  const statusLabel = COVER_STATUSES.find(s => s.id === c.status)?.label || c.status;
  let msg = `*${c.titulo}*`;
  if (c.artista_original) msg += `\n_${c.artista_original}_`;
  msg += `\n\n• Estado: ${statusLabel}`;
  msg += `\n• Progreso: ${pct}% (${done}/${CHECKLIST_BASE.length} tareas)`;
  if (c.fecha_publicacion) msg += `\n• Fecha publicación: ${c.fecha_publicacion}`;
  if (c.link_externo) msg += `\n• Link: ${c.link_externo}`;
  if (c.notas) msg += `\n\nNotas: ${c.notas}`;
  return msg;
}

// Construye URL de WhatsApp
export function buildWhatsAppUrl(message: string, phone?: string): string {
  const encoded = encodeURIComponent(message);
  const cleanPhone = phone ? phone.replace(/[^\d]/g, '') : '';
  return cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}

// Redimensiona una imagen manteniendo proporción y exporta a JPEG
export function resizeImage(file: File, maxSize = 500, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context failed'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        try {
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('Invalid image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Read failed'));
    reader.readAsDataURL(file);
  });
}

// Copia texto al portapapeles con fallback
export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return fallbackCopy(text);
    }
  }
  return fallbackCopy(text);
}

function fallbackCopy(text: string): boolean {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}
