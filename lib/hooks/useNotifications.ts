'use client';

import { useEffect, useRef } from 'react';
import type { Evento } from '@/lib/types';

export function useNotifications(eventos: Evento[]) {
  const notifiedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Pedir permiso de notificaciones
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const checkNotifications = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM

      eventos.forEach((evento) => {
        // Solo eventos de hoy que no estén hechos
        if (evento.fecha !== today || evento.hecho) return;

        // Crear ID único para este evento + hora
        const notifId = `${evento.id}-${evento.hora}`;

        // Si ya notificamos, saltar
        if (notifiedRef.current.has(notifId)) return;

        // Comparar hora (notificar si es la hora exacta o hasta 1 min después)
        const eventTime = evento.hora.slice(0, 5);
        if (eventTime === currentTime) {
          notifiedRef.current.add(notifId);

          new Notification(`${evento.tipo}: ${evento.titulo}`, {
            body: evento.notas || 'Es hora de tu actividad programada',
            icon: '/icon-192.png',
            tag: notifId,
          });
        }
      });
    };

    // Revisar cada 30 segundos
    checkNotifications();
    const interval = setInterval(checkNotifications, 30000);

    return () => clearInterval(interval);
  }, [eventos]);
}
