import React, { useEffect } from 'react';
import { 
  Award, 
  XCircle, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  RotateCcw, 
  ShieldAlert, 
  BookOpen, 
  Download, 
  Flame,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ScorecardModal({ isOpen, onClose, scorecard, targetRole, candidateName, onRetakeInterview }) {
  useEffect(() => {
    if (isOpen && scorecard?.overallScore >= 80) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  }, [isOpen, scorecard]);

  if (!isOpen || !scorecard) return null;

  const isPassed = scorecard.overallScore >= 80;
  const isBorderline = scorecard.overallScore >= 60 && scorecard.overallScore < 80;

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      candidate: candidateName,
      role: targetRole.title,
      date: new Date().toISOString(),
      scorecard: scorecard
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Prepify_BarRaiser_Scorecard_${targetRole.id}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const radarScores = scorecard.radarScores || {
    technicalPrecision: 50,
    incidentHandling: 50,
    threatModeling: 50,
    protocolDepth: 50,
    stressComposure: 50
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl my-8 bg-cyber-card border border-cyber-border rounded-2xl shadow-2xl shadow-cyber-cyan/15 overflow-hidden text-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className={`px-6 py-6 border-b flex items-center justify-between ${
          isPassed 
            ? 'bg-gradient-to-r from-emerald-950/80 via-cyber-card to-emerald-900/40 border-emerald-500/40' 
            : isBorderline 
              ? 'bg-gradient-to-r from-amber-950/80 via-cyber-card to-amber-900/40 border-amber-500/40'
              : 'bg-gradient-to-r from-rose-950/90 via-cyber-card to-rose-900/50 border-rose-500/40'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg ${
              isPassed 
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                : isBorderline 
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-rose-500/20 border-rose-500 text-rose-400'
            }`}>
              {isPassed ? <Award className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider uppercase border ${
                  isPassed 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : isBorderline
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}>
                  {scorecard.hiringDecision || (isPassed ? 'OFFER EXTENDED' : 'REJECTED (BAR NOT MET)')}
                </span>
                <span className="text-xs text-gray-400 font-mono">MNC BAR VERDICT</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-wide mt-1">
                {targetRole.title}
              </h2>
              <p className="text-xs text-gray-400 font-mono">Evaluator: Victoria Vance (Lead Bar-Raiser)</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Score & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-cyber-bg border border-cyber-border flex flex-col items-center justify-center text-center">
              <span className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-1">Placement Score</span>
              <div className={`text-4xl font-black font-mono ${
                isPassed ? 'text-emerald-400' : isBorderline ? 'text-amber-400' : 'text-cyber-rose'
              }`}>
                {scorecard.overallScore}<span className="text-xl text-gray-500">/100</span>
              </div>
              <span className="text-[11px] text-gray-400 mt-1 font-mono">
                {isPassed ? 'Exceeds MNC Strict Bar' : 'Min 80 required for Offer'}
              </span>
            </div>

            <div className="md:col-span-2 p-5 rounded-xl bg-cyber-bg border border-cyber-border space-y-2">
              <span className="text-xs text-cyber-cyan font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Executive Summary
              </span>
              <p className="text-sm text-gray-300 leading-relaxed font-sans">
                {scorecard.summary}
              </p>
            </div>
          </div>

          {/* 5-Dimensional Radar / Competency Breakdown */}
          <div className="p-5 rounded-xl bg-cyber-bg border border-cyber-border space-y-3">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
              Core Technical Competency Breakdown
            </h3>
            <div className="space-y-2.5">
              {[
                { label: 'Technical Precision & RFC Accuracy', score: radarScores.technicalPrecision },
                { label: 'Incident Response & Triage Rigor', score: radarScores.incidentHandling },
                { label: 'Threat Modeling & Attack Vectors', score: radarScores.threatModeling },
                { label: 'Packet / Low-Level Protocol Depth', score: radarScores.protocolDepth },
                { label: 'Composure & Defense Under Pressure', score: radarScores.stressComposure }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-300">{item.label}</span>
                    <span className={`font-bold ${
                      (item.score || 0) >= 80 ? 'text-emerald-400' : (item.score || 0) >= 50 ? 'text-amber-400' : 'text-cyber-rose'
                    }`}>
                      {item.score || 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-cyber-card border border-cyber-border overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        (item.score || 0) >= 80 
                          ? 'bg-gradient-to-r from-emerald-500 to-cyber-cyan' 
                          : (item.score || 0) >= 50 
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400' 
                            : 'bg-gradient-to-r from-rose-600 to-red-400'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, item.score || 0))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detected Weaknesses (Added to Cookies) */}
          <div className="p-5 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-cyber-rose" />
                Detected Critical Weaknesses (Saved in Cookie Intel)
              </h3>
              <span className="text-[10px] bg-rose-900/60 text-rose-200 px-2 py-0.5 rounded font-mono border border-rose-500/30">
                Auto-Tuned Next Drill
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(scorecard.criticalWeaknesses || []).map((w, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-cyber-bg/80 border border-rose-500/20 text-xs text-rose-200 font-mono flex items-start gap-2">
                  <span className="text-cyber-rose font-bold">✕</span>
                  <span>{w}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Textbook Corrections Section */}
          {scorecard.textbookCorrections && scorecard.textbookCorrections.length > 0 && (
            <div className="p-5 rounded-xl bg-cyber-bg border border-cyber-border space-y-3">
              <h3 className="text-xs font-bold text-cyber-cyan uppercase tracking-wider font-mono flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyber-cyan" />
                Textbook Dissection: Flaws vs Exact Truth
              </h3>
              <div className="space-y-3">
                {scorecard.textbookCorrections.map((corr, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-cyber-card border border-cyber-border space-y-1.5 text-xs">
                    <div className="font-bold text-white font-mono flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 text-[10px]">
                        TOPIC
                      </span>
                      {corr.topic}
                    </div>
                    <div className="text-rose-300/90 pl-3 border-l-2 border-rose-500 font-mono text-[11px]">
                      <strong className="text-rose-400">Your Blunder:</strong> {corr.candidateError}
                    </div>
                    <div className="text-emerald-300/90 pl-3 border-l-2 border-emerald-500 font-mono text-[11px]">
                      <strong className="text-emerald-400">Textbook Standard:</strong> {corr.textbookTruth}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bar-Raiser Closing Note */}
          {scorecard.barRaiserClosingNote && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyber-card to-cyber-bg border border-cyber-border/80 text-xs text-gray-300 italic font-mono space-y-1">
              <span className="text-cyber-accent font-bold not-italic">" Victoria Vance:</span>
              <p className="pl-2">{scorecard.barRaiserClosingNote} "</p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-cyber-border bg-cyber-bg/90 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleDownload}
            className="px-4 py-2.5 rounded-xl border border-cyber-border hover:bg-white/5 text-gray-300 font-medium text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-cyber-cyan" />
            Download Diagnostic JSON
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-cyber-border hover:bg-white/5 text-gray-300 font-medium text-xs transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onRetakeInterview();
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-black font-bold text-xs font-mono shadow-lg shadow-cyber-cyan/20 hover:shadow-cyber-cyan/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Interview (Tuned to Weaknesses)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
