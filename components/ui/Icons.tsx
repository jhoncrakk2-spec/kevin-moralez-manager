'use client';

import type { Plataforma } from '@/lib/types';

interface IconProps {
  className?: string;
}

export function TikTokIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.971-1.166-1.957-1.282-2.647h.004C16.369.5 16.42 0 16.431 0h-3.439v13.31c0 .18 0 .356-.008.531l-.006.058-.002.023v.007a3.713 3.713 0 0 1-1.87 2.945 3.658 3.658 0 0 1-1.815.48c-2.033 0-3.681-1.661-3.681-3.715 0-2.053 1.648-3.715 3.681-3.715.386 0 .758.06 1.108.171V6.566a7.13 7.13 0 0 0-5.804 1.625 7.52 7.52 0 0 0-1.646 2.026C2.369 11.17 2 12.288 2 13.65c0 1.368.374 2.652 1.038 3.756a7.53 7.53 0 0 0 1.659 2.022 7.125 7.125 0 0 0 4.637 1.692c.15 0 .298-.008.447-.022a7.165 7.165 0 0 0 4.198-1.67c.43-.358.81-.762 1.142-1.202.85-1.118 1.319-2.456 1.319-3.88 0-.08-.001-.158-.003-.237V7.944c.12.09.249.176.384.26.36.225.737.425 1.129.596.54.238 1.117.411 1.722.515.24.042.484.074.731.094V5.977c-.35-.023-.693-.098-1.022-.224a3.6 3.6 0 0 1-.06-.19z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
    </svg>
  );
}

export function InstagramIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function YoutubeIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

interface PlataformaIconProps {
  p: Plataforma;
}

export function PlataformaIcon({ p }: PlataformaIconProps) {
  if (p === 'TikTok') return <TikTokIcon className="w-5 h-5 text-yellow-400" />;
  if (p === 'Instagram') return <InstagramIcon className="w-5 h-5 text-yellow-400" />;
  if (p === 'YouTube') return <YoutubeIcon className="w-5 h-5 text-yellow-400" />;
  return null;
}
