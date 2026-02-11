import React, { useState, useRef } from 'react';
import { ScriptData } from '../types';
import { Upload, FileCode, Play, Eye, Terminal, Save, CheckCircle, FileUp, Shield, Gift, Link as LinkIcon, Copy, AlertCircle } from 'lucide-react';

interface DashboardProps {
  onSimulate: (mode: 'executor' | 'browser', script: ScriptData) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSimulate }) => {
  const [scriptContent, setScriptContent] = useState<string>("-- Write your protected script here\nprint('Hello from Nameless')");
  const [scriptName, setScriptName] = useState<string>("script.lua");
  const [isSaving, setIsSaving] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  
  // Redeem & Custom Link State
  const [redeemCode, setRedeemCode] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [redeemError, setRedeemError] = useState("");
  const [apiError, setApiError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSimulate = (type: 'executor' | 'browser') => {
    onSimulate(type, { name: scriptName, content: scriptContent });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setScriptName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          setScriptContent(text);
          setGeneratedLink(null);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleRedeem = () => {
    if (redeemCode === 'NameLessFree') {
      setIsPremiumUnlocked(true);
      setRedeemError("");
    } else {
      setRedeemError("Invalid license code.");
    }
  };

  const handleSaveToCloud = async () => {
    setIsSaving(true);
    setApiError("");
    setGeneratedLink(null);

    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: scriptContent,
          alias: isPremiumUnlocked ? customAlias : undefined,
          redeemCode: isPremiumUnlocked ? redeemCode : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save script');
      }

      // Construct full URL
      const fullUrl = `${window.location.origin}${data.url}`;
      setGeneratedLink(fullUrl);

    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-red-500/30 selection:text-red-200">
      <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-rose-900 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/20">
              <Shield size={18} className="text-white" />
            </div>
            <span className="font-bold text-white tracking-tight text-lg">
              Nameless<span className="text-red-500">Guard</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              SYSTEM OPERATIONAL
            </div>
            <div className="text-xs font-mono text-zinc-400">v2.6.0</div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Editor Section */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-[#121215] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
              {/* Editor Toolbar */}
              <div className="bg-[#18181b] border-b border-zinc-800 p-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-900/50 px-3 py-1.5 rounded-md border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                    <FileCode size={14} className="text-blue-400" />
                    <input 
                      type="text" 
                      value={scriptName}
                      onChange={(e) => setScriptName(e.target.value)}
                      className="bg-transparent border-none focus:outline-none focus:text-white w-32 md:w-48 font-mono text-xs"
                      placeholder="filename.lua"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".lua,.txt" 
                    onChange={handleFileUpload}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                  >
                    <FileUp size={14} />
                    Import
                  </button>
                  <button 
                    onClick={handleSaveToCloud}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-300 ${
                      generatedLink 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/20'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSaving ? (
                        <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                    ) : generatedLink ? <CheckCircle size={14} /> : <Save size={14} />}
                    {generatedLink ? 'Deployed' : 'Deploy Script'}
                  </button>
                </div>
              </div>

              {/* Text Area */}
              <div className="relative flex-grow">
                 <textarea
                  value={scriptContent}
                  onChange={(e) => {
                    setScriptContent(e.target.value);
                    setGeneratedLink(null);
                  }}
                  className="w-full h-full bg-[#0c0c0e] p-4 font-mono text-sm text-zinc-300 focus:outline-none resize-none leading-relaxed"
                  spellCheck={false}
                  placeholder="-- Paste your script here..."
                />
                <div className="absolute bottom-4 right-4 text-xs text-zinc-600 font-mono pointer-events-none">
                  Lua 5.1 Compatible
                </div>
              </div>
            </div>

            {/* Deployment Result */}
            {generatedLink && (
              <div className="bg-emerald-950/10 border border-emerald-900/30 rounded-xl p-4 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <LinkIcon size={16} />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-bold text-emerald-500 uppercase">Deployment Success</span>
                    <a href={generatedLink} target="_blank" rel="noreferrer" className="text-sm text-zinc-300 truncate font-mono hover:text-white hover:underline decoration-emerald-500">
                      {generatedLink}
                    </a>
                  </div>
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-emerald-500/20 text-emerald-500 rounded-lg transition-colors"
                  title="Copy Link"
                >
                  <Copy size={18} />
                </button>
              </div>
            )}
            
            {apiError && (
              <div className="bg-red-950/10 border border-red-900/30 rounded-xl p-4 flex items-center gap-3 text-red-400 animate-in fade-in">
                <AlertCircle size={18} />
                <span className="text-sm">{apiError}</span>
              </div>
            )}
          </div>

          {/* Controls Section */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Custom Link / Redeem Section */}
            <div className="bg-[#121215] border border-zinc-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-4">
                <Gift size={16} className="text-purple-500" />
                Premium Features
              </h3>

              <div className="space-y-4">
                {!isPremiumUnlocked ? (
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Redeem Code</label>
                     <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={redeemCode}
                          onChange={(e) => setRedeemCode(e.target.value)}
                          placeholder="Enter code..." 
                          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-purple-500/50 transition-colors"
                        />
                        <button 
                          onClick={handleRedeem}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 rounded-lg transition-colors"
                        >
                          Unlock
                        </button>
                     </div>
                     {redeemError && <p className="text-xs text-red-500">{redeemError}</p>}
                     <p className="text-[10px] text-zinc-600">Enter "NameLessFree" to unlock custom aliases.</p>
                  </div>
                ) : (
                  <div className="space-y-2 animate-in fade-in">
                    <div className="flex items-center gap-2 text-xs text-purple-400 bg-purple-500/10 p-2 rounded border border-purple-500/20 mb-3">
                      <CheckCircle size={12} />
                      Premium Unlocked
                    </div>
                    <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Custom Alias</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-zinc-600 text-sm">/api/</span>
                      <input 
                        type="text" 
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value)}
                        placeholder="Zee-Hub" 
                        className="bg-zinc-900 border border-zinc-800 rounded-lg pl-12 pr-3 py-2 text-sm w-full focus:outline-none focus:border-purple-500/50 transition-colors text-white"
                      />
                    </div>
                    <p className="text-[10px] text-zinc-500">Leaving this blank will generate a random ID.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Simulation Controls */}
            <div className="bg-[#121215] border border-zinc-800 rounded-xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-4">
                <Upload size={16} className="text-red-500" />
                Simulation Control
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleSimulate('executor')}
                  className="w-full group relative overflow-hidden bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-950/30 rounded-lg flex items-center justify-center border border-emerald-900/50 text-emerald-500">
                        <Terminal size={20} />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-zinc-200">Executor</div>
                        <div className="text-[10px] text-zinc-500 font-mono">User-Agent: Synapse/Krnl</div>
                      </div>
                    </div>
                    <Play size={16} className="text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </button>

                <button
                  onClick={() => handleSimulate('browser')}
                  className="w-full group relative overflow-hidden bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-950/30 rounded-lg flex items-center justify-center border border-red-900/50 text-red-500">
                        <Eye size={20} />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-zinc-200">Browser</div>
                        <div className="text-[10px] text-zinc-500 font-mono">User-Agent: Chrome/Mozilla</div>
                      </div>
                    </div>
                    <Play size={16} className="text-zinc-600 group-hover:text-red-500 transition-colors" />
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-5">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Security Metrics</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                   <span className="text-zinc-400">Anti-Tamper</span>
                   <span className="text-emerald-500 font-mono">ACTIVE</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                   <div className="w-full h-full bg-emerald-500/50 animate-pulse"></div>
                </div>
                
                <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-800/50">
                   <span className="text-zinc-400">Request Integrity</span>
                   <span className="text-emerald-500 font-mono">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;