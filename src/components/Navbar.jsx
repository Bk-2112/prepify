import React from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Key, 
  User, 
  Zap, 
  Flame, 
  History, 
  Cpu
} from 'lucide-react';
import { CYBER_ROLES } from '../data/roles';

export default function Navbar({ userProfile, onOpenProfile, onOpenHistory, isInterviewActive }) {
  const currentRole = CYBER_ROLES.find(r => r.id === userProfile.roleId) || CYBER_ROLES[0];
  const hasKey = Boolean(userProfile.apiKey && userProfile.apiKey.trim().length > 10);
  const displayName = userProfile.name?.trim() || 'Candidate';
  const initials = displayName
    .split(' ')
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'CA';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyber-border/80 bg-cyber-bg/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-cyan via-cyber-blue to-cyber-purple p-[1px] shadow-glow-cyan">
              <div className="w-full h-full bg-cyber-card rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyber-cyan" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-cyber-bg animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-wider font-mono">
                PREPIFY<span className="text-cyber-cyan">.AI</span>
              </span>
              <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 font-mono font-semibold">
                MNC BAR-RAISER
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden md:flex items-center gap-1 font-mono">
              <Cpu className="w-3 h-3 text-cyber-accent" />
              Lead HR Engine • Textbook Perfection Mode
            </p>
          </div>
        </div>

        {/* Center: Current Target Role Pill */}
        <div className="hidden lg:flex items-center gap-2 bg-cyber-card/80 border border-cyber-border px-3.5 py-1.5 rounded-full">
          <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
          <span className="text-xs text-gray-400">Targeting:</span>
          <span className="text-xs font-semibold text-white max-w-[280px] truncate">
            {currentRole.title}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
            currentRole.isFresher 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
          }`}>
            {currentRole.isFresher ? 'FRESHER' : 'EXP'}
          </span>
        </div>

        {/* Right: Actions & Profile Bubble */}
        <div className="flex items-center gap-3">
          
          {/* API Key Status Pill */}
          <button
            onClick={onOpenProfile}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
              hasKey
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/50'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-300 hover:bg-rose-950/50 animate-pulse'
            }`}
            title="Click to configure Gemini API Key"
          >
            <Key className="w-3.5 h-3.5" />
            {hasKey ? 'Gemini API Active' : 'Set Gemini Key'}
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border border-cyber-border bg-cyber-card hover:bg-cyber-surface text-gray-300 hover:text-white transition-all shadow-md"
            title="View Candidate Telemetry History"
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>

          {/* Top-Right Profile Bubble */}
          <button
            onClick={onOpenProfile}
            className="group relative flex items-center gap-2.5 p-1.5 pl-2.5 rounded-full bg-cyber-card hover:bg-cyber-surface border border-cyber-border hover:border-cyber-cyan/50 transition-all shadow-md"
            title="Candidate Profile & Settings (Cookie Stored)"
            id="profile-bubble-btn"
          >
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-white group-hover:text-cyber-cyan transition-colors max-w-[120px] truncate">
                {displayName}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                {userProfile.apiKey ? 'Key Ready' : 'No Key'}
              </span>
            </div>

            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-cyber-cyan via-cyber-blue to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-glow-cyan">
              {initials}
              <div 
                className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-cyber-bg ${
                  hasKey ? 'bg-emerald-400' : 'bg-rose-500 animate-ping'
                }`} 
              />
            </div>
          </button>

        </div>

      </div>
    </header>
  );
}
