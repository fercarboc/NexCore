import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Mail, Key, XCircle, ChevronRight } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

export const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (authError) {
      setError('Credenciales incorrectas o acceso no autorizado.');
      setIsLoading(false);
    } else {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      {/* Technical Background */}
      <div className="absolute inset-0 bg-grid opacity-5" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/20 via-transparent to-slate-950" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-xl mb-6">
              <Zap className="text-slate-950 w-7 h-7" fill="currentColor" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">StayNexApp Internal</h1>
            <p className="text-slate-500 text-sm font-medium">Panel de Control de Plataforma SaaS</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@staynexapp.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono text-sm text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Access Key</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  type="password" 
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono text-sm text-white"
                  required
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-3 text-rose-400 text-xs font-bold"
                >
                  <XCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-white text-slate-950 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <>Autenticar <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
        <p className="text-center mt-8 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          Acceso restringido a personal autorizado de StayNexApp
        </p>
      </motion.div>
    </div>
  );
};
