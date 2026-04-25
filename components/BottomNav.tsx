'use client';

import { Home, Music2, Calendar, Radio, MoreHorizontal } from 'lucide-react';

export type TabId = 'home' | 'covers' | 'agenda' | 'redes' | 'mas';

interface BottomNavProps {
  tab: TabId;
  setTab: (tab: TabId) => void;
}

const items: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'covers', label: 'Covers', icon: Music2 },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'redes', label: 'Redes', icon: Radio },
  { id: 'mas', label: 'Mas', icon: MoreHorizontal },
];

export function BottomNav({ tab, setTab }: BottomNavProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-5 pt-2 pb-3">
          {items.map((it) => {
            const active = tab === it.id;
            const Icon = it.icon;
            return (
              <button
                key={it.id}
                onClick={() => setTab(it.id)}
                className="flex flex-col items-center gap-0.5 py-1.5 px-1 transition relative"
              >
                {active && (
                  <div className="absolute top-0 w-8 h-0.5 bg-yellow-400 rounded-full" />
                )}
                <Icon
                  className={`w-5 h-5 ${active ? 'text-yellow-400' : 'text-zinc-500'}`}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                <span
                  className={`text-[10px] tracking-wide uppercase font-semibold ${
                    active ? 'text-yellow-400' : 'text-zinc-500'
                  }`}
                >
                  {it.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
