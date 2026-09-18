import React, { useState, useEffect } from 'react';
import { 
  User, 
  Key, 
  Briefcase, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Trash2, 
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  Play
} from 'lucide-react';
import { CYBER_ROLES } from '../data/roles';
import { saveUserProfile, getInterviewIntel, clearInterviewIntel } from '../utils/cookieManager';
import { testGeminiKey } from '../services/gemini';

export default function ProfileModal({ isOpen, onClose, userProfile, onProfileUpdate, onStartInterview }) {
  const [name, setName] = useState(userProfile?.name || '');
  const [apiKey, setApiKey] = useState(userProfile?.apiKey || '');
  const [roleId, setRoleId] = useState(userProfile?.roleId || 'fresher-soc-l1');
  const [showKey, setShowKey] = useState(false);
  
  const [testingKey, setTestingKey] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [intel, setIntel] = useState(getInterviewIntel());

  useEffect(() => {
    if (isOpen) {
      setName(userProfile?.name || '');
      setApiKey(userProfile?.apiKey || '');
      setRoleId(userProfile?.roleId || 'fresher-soc-l1');
      setTestResult(null);
      setSaveSuccess(false);
      setIntel(getInterviewIntel());
    }
  }, [isOpen, userProfile]);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, error: 'Please enter a Gemini API Key first.' });
      return;
    }
    setTestingKey(true);
    setTestResult(null);
    const res = await testGeminiKey(apiKey);
    setTestingKey(false);
    setTestResult(res);
  };

  const handleSaveOnly = (e) => {
    if (e) e.preventDefault();
    const updated = saveUserProfile({ name, apiKey, roleId });
    onProfileUpdate(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const handleSaveAndStart = (e) => {
    if (e) e.preventDefault();
    const updated = saveUserProfile({ name, apiKey, roleId });
    onProfileUpdate(updated);
    onClose();
    if (onStartInterview) {
      onStartInterview(updated);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all stored weakness history and interview outcome cookies?')) {
      const reset = clearInterviewIntel();
      setIntel(reset);
    }
  };

  const selectedRole = CYBER_ROLES.find(r => r.id === roleId) || CYBER_ROLES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-cyber-card border border-cyber-border rounded-2xl shadow-2xl shadow-cyber-cyan/10 overflow-hidden text-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-cyber-border/80 flex items-center justify-between bg-gradient-to-r from-cyber-bg to-cyber-surface/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-cyan/20 to-cyber-blue/30 border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan shadow-glow-cyan">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                Candidate Profile & Configuration
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 font-mono">
                  COOKIE ONLY
                </span>
              </h2>
              <p className="text-xs text-gray-400">Manage your identity, Gemini API key, and target role settings</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <form onSubmit={handleSaveAndStart} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Section 1: Candidate Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <User className="w-4 h-4 text-cyber-cyan" />
              Candidate Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Mercer"
              className="w-full px-4 py-3 bg-cyber-bg border border-cyber-border rounded-xl focus:border-cyber-cyan focus:outline-none focus:ring-1 focus:ring-cyber-cyan text-white placeholder-gray-500 font-medium transition-all"
            />
            <p className="text-xs text-gray-400">The Lead HR will address you by this name during high-stakes probing.</p>
          </div>

          {/* Section 2: Gemini API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Key className="w-4 h-4 text-cyber-accent" />
                Gemini API Key
                <span className="text-[10px] uppercase tracking-wider text-cyber-accent bg-cyber-accent/10 border border-cyber-accent/30 px-1.5 py-0.5 rounded">
                  Stored in Cookie
                </span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyber-cyan hover:underline flex items-center gap-1 font-mono"
              >
                Get Free Gemini Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
                placeholder="AIzaSy..."
                className="w-full pl-4 pr-24 py-3 bg-cyber-bg border border-cyber-border rounded-xl focus:border-cyber-accent focus:outline-none focus:ring-1 focus:ring-cyber-accent text-white placeholder-gray-500 font-mono text-sm transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 text-gray-400 hover:text-white rounded transition-colors"
                  title={showKey ? "Hide API Key" : "Show API Key"}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={testingKey || !apiKey}
                  className="px-2.5 py-1 text-xs bg-white/10 hover:bg-white/20 disabled:opacity-40 text-cyber-cyan rounded border border-cyber-cyan/30 transition-all font-mono flex items-center gap-1"
                >
                  {testingKey ? (
                    <span className="animate-spin text-xs">⟳</span>
                  ) : (
                    <Zap className="w-3 h-3" />
                  )}
                  Test
                </button>
              </div>
            </div>

            {/* Test Key Status */}
            {testResult && (
              <div className={`p-3 rounded-lg text-xs font-mono flex items-start gap-2 ${
                testResult.success 
                  ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' 
                  : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
              }`}>
                {testResult.success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                    <div>
                      <p className="font-bold">Gemini API Connected Successfully!</p>
                      <p className="text-[11px] opacity-90">Model: <span className="text-cyber-cyan font-bold">{testResult.model}</span> (Ready for Lead HR Bar-Raiser drills)</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                    <div>
                      <p className="font-bold">Connection Failed</p>
                      <p className="text-[11px] opacity-80">{testResult.error}</p>
                    </div>
                  </>
                )}
              </div>
            )}
            <p className="text-xs text-gray-400">
              No database is used. The API key is stored strictly in your browser cookies.
            </p>
          </div>

          {/* Section 3: Target Role Selection (Cybersecurity with (freshers) tag) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyber-cyan" />
              Target Cybersecurity Job Title
            </label>
            <div className="relative">
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full px-4 py-3 bg-cyber-bg border border-cyber-border rounded-xl focus:border-cyber-cyan focus:outline-none focus:ring-1 focus:ring-cyber-cyan text-white font-medium appearance-none cursor-pointer"
              >
                {CYBER_ROLES.map((role) => (
                  <option 
                    key={role.id} 
                    value={role.id} 
                    className="bg-gray-900 text-white py-2"
                  >
                    {role.title}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                ▼
              </div>
            </div>

            {/* Selected Role Meta card */}
            <div className="p-3.5 bg-cyber-bg/70 border border-cyber-border rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Seniority Level:</span>
                <span className={`px-2 py-0.5 rounded font-mono font-semibold ${
                  selectedRole.isFresher 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                }`}>
                  {selectedRole.level}
                </span>
              </div>
              <div>
                <p className="text-gray-400 font-medium mb-1">MNC Bar-Raiser Focus Areas:</p>
                <ul className="list-disc list-inside text-gray-300 space-y-0.5 pl-1">
                  {selectedRole.focusAreas.slice(0, 3).map((f, i) => (
                    <li key={i} className="truncate">{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4: Weakness Memory & Cookie Intel Dossier */}
          <div className="space-y-3 pt-2 border-t border-cyber-border/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyber-rose" />
                <h3 className="text-sm font-semibold text-gray-200">
                  Adaptive Weakness Dossier (Cookie Intel)
                </h3>
              </div>
              {intel?.weaknessCatalog?.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-mono transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Purge Memory
                </button>
              )}
            </div>

            <div className="p-4 bg-cyber-bg/90 border border-cyber-border rounded-xl">
              <div className="grid grid-cols-3 gap-2 pb-3 mb-3 border-b border-cyber-border/60 text-center">
                <div>
                  <div className="text-xs text-gray-400">Total Drills</div>
                  <div className="text-base font-bold text-white font-mono">{intel?.totalSessions || 0}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Avg Placement Score</div>
                  <div className={`text-base font-bold font-mono ${
                    (intel?.avgScore || 0) >= 80 ? 'text-emerald-400' : (intel?.avgScore || 0) >= 50 ? 'text-amber-400' : 'text-cyber-rose'
                  }`}>
                    {intel?.avgScore || 0}/100
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Pass Rate</div>
                  <div className="text-base font-bold text-cyber-cyan font-mono">
                    {intel?.totalSessions ? Math.round(((intel.passedSessions || 0) / intel.totalSessions) * 100) : 0}%
                  </div>
                </div>
              </div>

              {intel?.weaknessCatalog && intel.weaknessCatalog.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-cyber-rose font-medium flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Topics Lead HR will aggressively target in next interview:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {intel.weaknessCatalog.map((w, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-md bg-rose-950/40 border border-rose-500/30 text-rose-300 font-mono flex items-center gap-1"
                      >
                        {w.topic}
                        <span className="text-[10px] px-1 py-0.2 bg-rose-900/60 rounded text-rose-200">
                          {w.count}x
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  No previous weaknesses logged yet. Complete an interview to train the Lead HR engine on your blind spots.
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-cyber-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-cyber-border hover:bg-white/5 text-gray-300 font-medium text-sm transition-colors"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveOnly}
                className="px-4 py-2.5 rounded-xl border border-cyber-border hover:bg-white/10 text-gray-200 font-medium text-sm transition-all"
              >
                {saveSuccess ? 'Saved in Cookies!' : 'Save Only'}
              </button>

              <button
                type="button"
                onClick={handleSaveAndStart}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-black font-extrabold text-sm font-mono shadow-lg shadow-cyber-cyan/20 hover:shadow-cyber-cyan/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-black" />
                Save & Start Interview
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
