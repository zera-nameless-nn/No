import React, { useState } from 'react';
import { Lock, ArrowRight, AlertCircle, Key } from 'lucide-react';

interface LoginProps {
  onSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network check
    setTimeout(() => {
      if (key === 'Nameless') {
        onSuccess();
      } else {
        setError(true);
        setKey('');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-sans text-zinc-200">
      {/* Abstract Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-10 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-zinc-900 rounded-xl flex items-center justify-center mb-6 border border-zinc-800 shadow-inner">
            <Lock className="w-6 h-6 text-zinc-100" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Authentication</h2>
          <p className="text-zinc-500 text-sm">Enter your security key to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Access Key</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key size={16} className="text-zinc-600 group-focus-within:text-zinc-400 transition-colors" />
              </div>
              <input
                type="password"
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                  setError(false);
                }}
                className={`w-full bg-[#111] border ${error ? 'border-red-900/50 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-500'} rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-700 focus:outline-none transition-all`}
                placeholder="••••••••••••"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-950/20 border border-red-900/30 p-3 rounded-lg animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={14} />
              <span>Invalid authentication key. Please try again.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black font-semibold py-3.5 rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-zinc-400 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                Login to Dashboard
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
