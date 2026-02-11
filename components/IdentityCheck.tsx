import React, { useEffect, useState } from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';

interface IdentityCheckProps {
  onComplete: () => void;
}

const IdentityCheck: React.FC<IdentityCheckProps> = ({ onComplete }) => {
  const [statusText, setStatusText] = useState("Checking your browser...");
  const [rayId, setRayId] = useState("");

  useEffect(() => {
    // Generate a fake Ray ID
    setRayId(Math.random().toString(16).substr(2, 16));

    const sequence = [
      { text: "Checking your browser...", time: 0 },
      { text: "Verifying connection security...", time: 1000 },
      { text: "Checking request signature...", time: 2000 },
      { text: "Granting access...", time: 3500 }
    ];

    sequence.forEach(({ text, time }) => {
      setTimeout(() => setStatusText(text), time);
    });

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => clearTimeout(completeTimer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center font-sans p-4">
      <div className="max-w-md w-full bg-[#111] border border-zinc-800 rounded-lg p-8 shadow-2xl relative overflow-hidden">
        {/* Top Loading Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
           <div className="h-full bg-white animate-[progress_4s_ease-in-out_forwards]"></div>
        </div>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-zinc-800 border-t-white animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Nameless Protector</h1>
            <p className="text-lg text-zinc-300 animate-pulse">{statusText}</p>
          </div>

          <div className="text-sm text-zinc-500 max-w-xs leading-relaxed">
            Please stand by, while we are checking your browser...
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-600 font-mono">
          <div>Ray ID: <span className="text-zinc-400">{rayId}</span></div>
          <div>Performance & Security by Nameless</div>
        </div>
      </div>
      
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default IdentityCheck;