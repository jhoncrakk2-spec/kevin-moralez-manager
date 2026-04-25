'use client';

import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { COVER_STATUSES } from '@/lib/constants';
import type { CoverStatus } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';

interface StatusPillProps {
  status: CoverStatus;
}

export function StatusPill({ status }: StatusPillProps) {
  const s = COVER_STATUSES.find((x) => x.id === status) || COVER_STATUSES[0];
  return (
    <span
      className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${s.accent}`}
    >
      {s.label}
    </span>
  );
}

interface FilterChipProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}

export function FilterChip({ active, onClick, label, count }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold border whitespace-nowrap ${
        active
          ? 'bg-yellow-400 text-black border-yellow-400'
          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
      }`}
    >
      {label}{' '}
      {count != null && (
        <span className={active ? 'text-zinc-500' : 'text-zinc-600'}>({count})</span>
      )}
    </button>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: 'amber' | 'emerald' | 'red' | 'stone';
}

export function StatCard({ label, value, icon: Icon, tone }: StatCardProps) {
  const tones = {
    amber: 'text-yellow-400',
    emerald: 'text-emerald-400',
    red: 'text-rose-400',
    stone: 'text-zinc-300',
  };

  return (
    <div className="bg-zinc-900 rounded-2xl p-4 relative overflow-hidden">
      <div className="absolute top-3 right-3">
        <Icon className={`w-4 h-4 ${tones[tone]} opacity-80`} />
      </div>
      <div className="font-display text-4xl text-white leading-none mt-1">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-semibold mt-2">
        {label}
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  action?: { label: string; onClick: () => void };
  children: ReactNode;
}

export function Section({ title, action, children }: SectionProps) {
  return (
    <div className="px-5 mt-6">
      <div className="flex items-end justify-between mb-3">
        <h2 className="font-display text-2xl text-zinc-100 tracking-wider">{title}</h2>
        {action && (
          <button
            onClick={action.onClick}
            className="text-xs text-yellow-400 uppercase tracking-wider font-semibold flex items-center gap-0.5"
          >
            {action.label} <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="px-5 pt-6 pb-4">
      <div className="flex items-center gap-2 text-yellow-400 text-[11px] uppercase tracking-[0.25em]">
        <div className="h-px w-6 bg-yellow-400" />
        Moralez Mgmt
      </div>
      <h1 className="font-display text-5xl mt-1 text-white leading-none">{title}</h1>
      {subtitle && (
        <p className="text-zinc-400 text-sm mt-1 font-serif-display italic">{subtitle}</p>
      )}
    </div>
  );
}

interface EmptyHintProps {
  text: string;
}

export function EmptyHint({ text }: EmptyHintProps) {
  return (
    <div className="text-sm text-zinc-500 italic font-serif-display border border-dashed border-zinc-800 rounded-xl p-4 text-center">
      {text}
    </div>
  );
}

interface QuickActionProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

export function QuickAction({ label, icon: Icon, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="bg-zinc-900 border border-zinc-800/30 rounded-xl p-4 flex flex-col items-start gap-2 active:scale-95 transition"
    >
      <Icon className="w-5 h-5 text-yellow-400" />
      <span className="text-sm font-semibold text-zinc-100">{label}</span>
    </button>
  );
}

interface SocialLinkProps {
  href: string;
  label: string;
}

export function SocialLink({ href, label }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full py-2.5 text-center text-[11px] uppercase tracking-[0.15em] font-bold text-white active:scale-95 active:border-yellow-400 transition"
    >
      {label}
    </a>
  );
}
