import React from 'react';
import { History, X, Target } from 'lucide-react';
import { getInterviewIntel } from '../utils/cookieManager';

export default function HistoryModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const intel = getInterviewIntel();
  const hasHistory = intel && intel.history && intel.history.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-cyber-bg border border-cyber-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-cyber-border/70 bg-cyber-card/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30">
              <History className="w-5 h-5 text-cyber-cyan" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-mono tracking-wide">Candidate Telemetry History</h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">Stored Securely in Cookies</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {!hasHistory ? (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-70">
              <History className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-gray-300 font-bold mb-2">No History Found</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Complete a Bar-Raiser interview to populate your candidate telemetry and weakness dossier.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-gray-400 font-mono mb-1 uppercase tracking-wider">Total Sessions</span>
                  <span className="text-2xl font-black text-white">{intel.totalSessions}</span>
                </div>
                <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-gray-400 font-mono mb-1 uppercase tracking-wider">Passed</span>
                  <span className="text-2xl font-black text-emerald-400">{intel.passedSessions}</span>
                </div>
                <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-gray-400 font-mono mb-1 uppercase tracking-wider">Failed/Border</span>
                  <span className="text-2xl font-black text-rose-400">{intel.totalSessions - intel.passedSessions}</span>
                </div>
                <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-gray-400 font-mono mb-1 uppercase tracking-wider">Avg Score</span>
                  <span className="text-2xl font-black text-cyber-cyan">{intel.avgScore}</span>
                </div>
              </div>

              {/* Weaknesses */}
              {intel.weaknessCatalog && intel.weaknessCatalog.length > 0 && (
                <div className="p-5 rounded-xl border border-rose-500/20 bg-rose-950/10">
                  <h3 className="text-sm font-bold text-rose-400 font-mono mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Top Evaluated Weaknesses
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {intel.weaknessCatalog.map((weakness, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300 flex items-center gap-1.5">
                        {weakness.topic} <span className="bg-rose-500/20 px-1 rounded text-[10px]">{weakness.count}x</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* History Timeline */}
              <div>
                <h3 className="text-sm font-bold text-gray-300 font-mono mb-4 flex items-center gap-2">
                  <History className="w-4 h-4" /> Recent Sessions
                </h3>
                <div className="space-y-3">
                  {intel.history.map((record, index) => (
                    <div key={index} className="bg-cyber-surface border border-cyber-border rounded-xl p-4 flex flex-col md:flex-row md:items-start justify-between gap-4">
                      
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider ${
                            record.v === 'PASS' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            record.v === 'FAIL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {record.v}
                          </span>
                          <span className="text-sm font-bold text-white font-mono">{record.rt}</span>
                        </div>
                        <p className="text-xs text-gray-400">Score: {record.s}/100 • {new Date(record.ts).toLocaleDateString()}</p>
                        {record.w && record.w.length > 0 && (
                          <div className="mt-2 text-xs text-gray-500">
                            <span className="text-rose-400">Weaknesses:</span> {record.w.join(', ')}
                          </div>
                        )}
                      </div>
                      
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
