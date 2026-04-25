'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Despues de registrar, hacer login automatico
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          setError('Email o contraseña incorrectos');
        } else {
          setError(error.message);
        }
        setLoading(false);
        return;
      }
    }

    router.push('/');
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-5 fade-in">
      <div className="max-w-sm w-full">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="font-display text-3xl text-black">KM</span>
          </div>
        </div>

        <h1 className="font-display text-4xl text-white text-center">
          {mode === 'login' ? 'INICIAR SESION' : 'CREAR CUENTA'}
        </h1>
        <p className="text-zinc-400 text-sm mt-2 mb-6 text-center">
          Kevin Moralez Manager
        </p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-rose-950/40 border border-rose-800 text-rose-300 p-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-yellow-400/50 rounded-xl px-4 py-3 text-white outline-none placeholder:text-zinc-600"
              disabled={loading}
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-yellow-400/50 rounded-xl px-4 py-3 text-white outline-none placeholder:text-zinc-600 pr-12"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!email || !password || loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold uppercase tracking-wider py-3 rounded-xl transition mt-4"
          >
            {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          {mode === 'login' ? (
            <p className="text-zinc-500 text-sm">
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => { setMode('register'); setError(''); }}
                className="text-yellow-400 hover:underline"
              >
                Registrate
              </button>
            </p>
          ) : (
            <p className="text-zinc-500 text-sm">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className="text-yellow-400 hover:underline"
              >
                Inicia sesion
              </button>
            </p>
          )}
        </div>

        <p className="text-zinc-600 text-xs mt-6 text-center">
          Solo usuarios autorizados pueden acceder al modo admin
        </p>
      </div>
    </div>
  );
}
