import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertTriangle, Fingerprint } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Development Backdoor (Remove in Production)
    if (email === 'admin@aegis.com' && password === 'admin') {
      setTimeout(() => {
        onLoginSuccess();
      }, 1000);
      return;
    }

    try {
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        onLoginSuccess();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(t('auth.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-bg-primary flex items-center justify-center relative overflow-hidden">
      {/* Background Grid & Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-transparent to-bg-primary"></div>
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-bg-secondary border border-border-color shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-sm animate-in fade-in zoom-in duration-500">
        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent-blue"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-accent-blue"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-accent-blue"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent-blue"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-blue/10 border border-accent-blue/30 mb-4 shadow-[0_0_15px_rgba(0,212,255,0.3)]">
            <ShieldCheck size={32} className="text-accent-blue" />
          </div>
          <h1 className="text-3xl font-tactical font-bold text-text-primary tracking-[0.2em] mb-2">
            {t('auth.title')}
          </h1>
          <p className="text-xs font-mono text-accent-red tracking-widest animate-pulse">
            {t('auth.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-accent-blue uppercase tracking-wider flex items-center gap-2">
              <Mail size={12} /> {t('auth.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg-tertiary border border-border-color p-3 text-text-primary font-mono focus:border-accent-blue focus:outline-none focus:shadow-[0_0_10px_rgba(0,212,255,0.2)] transition-all"
              placeholder="operator@aegis.system"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-accent-blue uppercase tracking-wider flex items-center gap-2">
              <Lock size={12} /> {t('auth.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-tertiary border border-border-color p-3 text-text-primary font-mono focus:border-accent-blue focus:outline-none focus:shadow-[0_0_10px_rgba(0,212,255,0.2)] transition-all"
              placeholder="••••••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-accent-red/10 border border-accent-red/30 flex items-center gap-3 text-accent-red text-xs font-mono">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-accent-blue hover:bg-accent-blue/80 text-bg-primary font-tactical font-bold text-lg tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
            {loading ? (
              <>
                <Fingerprint className="animate-pulse" />
                {t('auth.loading')}
              </>
            ) : (
              <>
                {t('auth.login')}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-[10px] font-mono text-text-secondary opacity-50">
            AEGIS PRIME v2.0 // SECURE CONNECTION // IP LOGGED
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
