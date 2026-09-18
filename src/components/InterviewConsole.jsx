import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Terminal, 
  Flame, 
  ShieldAlert, 
  Clock, 
  Play, 
  RotateCcw, 
  AlertOctagon, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Activity, 
  Cpu, 
  MessageSquare, 
  Volume2, 
  VolumeX, 
  Key,
  Layers,
  Award
} from 'lucide-react';
import { CYBER_ROLES } from '../data/roles';
import { startInterviewSession, sendCandidateAnswer, generateFinalPlacementScorecard } from '../services/gemini';
import { recordInterviewOutcome, getInterviewIntel } from '../utils/cookieManager';

export default function InterviewConsole({ 
  userProfile, 
  autoStartOnMount,
  onResetAutoStart,
  onOpenProfile, 
  onShowScorecard 
}) {
  const [targetRole, setTargetRole] = useState(CYBER_ROLES[0]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [errorBanner, setErrorBanner] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const messagesEndRef = useRef(null);
  const timerRef = useRef(null);
  const textareaRef = useRef(null);

  // Sync role with userProfile
  useEffect(() => {
    const role = CYBER_ROLES.find(r => r.id === userProfile.roleId) || CYBER_ROLES[0];
    setTargetRole(role);
  }, [userProfile.roleId]);

  // Auto start trigger if requested (e.g. from Save & Start or Retake)
  useEffect(() => {
    if (autoStartOnMount && userProfile.apiKey) {
      if (onResetAutoStart) onResetAutoStart();
      handleStartInterview();
    }
  }, [autoStartOnMount]);

  // Timer effect
  useEffect(() => {
    if (isInterviewActive) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isInterviewActive]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Format timer
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Interview
  const handleStartInterview = async () => {
    if (!userProfile.apiKey || userProfile.apiKey.trim() === '') {
      setErrorBanner('Gemini API Key missing! Click your Profile bubble in the top right to add your key.');
      onOpenProfile();
      return;
    }

    setErrorBanner(null);
    setIsThinking(true);
    setIsInterviewActive(true);
    setMessages([]);
    setSecondsElapsed(0);
    setQuestionCount(1);

    try {
      const session = await startInterviewSession(
        userProfile.apiKey,
        userProfile.name,
        targetRole
      );

      setSystemPrompt(session.systemPrompt);
      setMessages([
        {
          id: 'msg_' + Date.now(),
          role: 'model',
          sender: 'Victoria Vance (Lead HR Bar-Raiser)',
          text: session.interviewerMessage,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } catch (err) {
      console.error(err);
      setErrorBanner(err.message || 'Failed to connect to Gemini API. Check your API key in Profile.');
      setIsInterviewActive(false);
    } finally {
      setIsThinking(false);
    }
  };

  // Submit candidate answer
  const handleSubmitAnswer = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isThinking || !isInterviewActive) return;

    const answerText = inputText.trim();
    setInputText('');
    
    // Add candidate message to state
    const userMsg = {
      id: 'msg_' + Date.now(),
      role: 'user',
      sender: userProfile.name || 'Candidate',
      text: answerText,
      timestamp: new Date().toLocaleTimeString()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsThinking(true);
    setQuestionCount(prev => prev + 1);

    try {
      // Build conversation payload for Gemini
      const conversationHistory = newMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const modelResponse = await sendCandidateAnswer(
        userProfile.apiKey,
        conversationHistory,
        systemPrompt
      );

      setMessages(prev => [
        ...prev,
        {
          id: 'msg_' + Date.now(),
          role: 'model',
          sender: 'Victoria Vance (Lead HR Bar-Raiser)',
          text: modelResponse,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } catch (err) {
      console.error(err);
      setErrorBanner(err.message || 'Error receiving Bar-Raiser response.');
    } finally {
      setIsThinking(false);
    }
  };

  // End Interview and Generate Scorecard
  const handleConcludeInterview = async () => {
    if (messages.length < 2) {
      if (!window.confirm('You have only answered few or no questions. Conclude anyway?')) {
        return;
      }
    }

    setIsEvaluating(true);
    setIsInterviewActive(false);

    try {
      const scorecard = await generateFinalPlacementScorecard(
        userProfile.apiKey,
        userProfile.name,
        targetRole,
        messages
      );

      // Record to compressed cookie
      recordInterviewOutcome({
        roleId: targetRole.id,
        roleTitle: targetRole.title,
        score: scorecard.overallScore,
        verdict: scorecard.verdict,
        weaknesses: scorecard.criticalWeaknesses || [],
        strengths: scorecard.verifiedStrengths || [],
        notes: scorecard.summary || ''
      });

      onShowScorecard(scorecard);
    } catch (err) {
      console.error('Evaluation Error:', err);
      setErrorBanner('Failed to generate full evaluation scorecard: ' + err.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Keyboard shortcut Ctrl+Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmitAnswer();
    }
  };

  const intel = getInterviewIntel();

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto w-full p-3 sm:p-6 gap-4">
      
      {/* Error / Alert banner */}
      {errorBanner && (
        <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-mono flex items-center justify-between gap-2 shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-cyber-rose shrink-0" />
            <span>{errorBanner}</span>
          </div>
          <button 
            onClick={() => setErrorBanner(null)}
            className="text-rose-400 hover:text-white px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main HUD Bar */}
      <div className="bg-cyber-card/90 border border-cyber-border rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Lead HR Persona Meta */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyber-rose via-purple-600 to-cyber-cyan p-[1px]">
              <div className="w-full h-full bg-cyber-bg rounded-xl flex items-center justify-center font-bold text-white font-mono text-sm">
                VV
              </div>
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-cyber-bg ${
              isInterviewActive ? 'bg-cyber-rose animate-pulse' : 'bg-gray-500'
            }`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white font-mono">
                Victoria Vance
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-500/40 font-mono font-semibold">
                LEAD MNC BAR-RAISER
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              CrowdShield Global Defense • Zero Fluff Tolerance
            </p>
          </div>
        </div>

        {/* Center: Live Session Telemetry */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 text-xs font-mono bg-cyber-bg/80 border border-cyber-border px-3 py-1.5 rounded-xl">
            <Clock className="w-4 h-4 text-cyber-cyan" />
            <span className="text-gray-400">Duration:</span>
            <span className="text-white font-bold">{formatTime(secondsElapsed)}</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-cyber-bg/80 border border-cyber-border px-3 py-1.5 rounded-xl">
            <Activity className="w-4 h-4 text-cyber-accent" />
            <span className="text-gray-400">Turns:</span>
            <span className="text-white font-bold">{questionCount}</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-mono bg-cyber-bg/80 border border-cyber-border px-3 py-1.5 rounded-xl">
            <Flame className="w-4 h-4 text-cyber-rose" />
            <span className="text-gray-400">Strictness:</span>
            <span className="text-cyber-rose font-bold">TEXTBOOK 100%</span>
          </div>
        </div>

        {/* Right: Primary Controls */}
        <div className="flex items-center gap-2">
          {!isInterviewActive ? (
            <button
              onClick={handleStartInterview}
              disabled={isThinking || isEvaluating}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-black font-bold text-xs font-mono shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-black" />
              Start Placement Drill
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleStartInterview}
                disabled={isThinking || isEvaluating}
                className="p-2 rounded-xl border border-cyber-border hover:bg-white/5 text-gray-400 hover:text-white transition-colors text-xs font-mono"
                title="Restart Drill"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleConcludeInterview}
                disabled={isThinking || isEvaluating}
                className="px-4 py-2 rounded-xl bg-cyber-rose/20 border border-cyber-rose/50 hover:bg-cyber-rose/30 text-rose-300 font-bold text-xs font-mono shadow-glow-rose hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                {isEvaluating ? (
                  <>
                    <span className="animate-spin">⟳</span> Evaluating...
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" /> Conclude & Get Scorecard
                  </>
                )}
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Main Terminal View / Chat Feed */}
      <div className="flex-1 bg-cyber-bg/95 border border-cyber-border rounded-2xl p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col space-y-4 shadow-inner relative">
        
        {/* Landing State when interview not started */}
        {!isInterviewActive && messages.length === 0 && (
          <div className="my-auto max-w-2xl mx-auto text-center space-y-6 py-8 animate-fadeIn">
            
            <div className="inline-flex p-3 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan shadow-glow-cyan">
              <ShieldAlert className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                MNC Cyber Placement Bar-Raiser
              </h2>
              <p className="text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
                Step into the hot seat with <strong className="text-white">Victoria Vance</strong>. She evaluates with zero leniency: exact RFC parameters, packet flags, NIST frameworks, and low-level mechanics are strictly required.
              </p>
            </div>

            {/* Target Role & Weakness Status Card */}
            <div className="p-4 rounded-xl bg-cyber-card/80 border border-cyber-border text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-mono">SELECTED ROLE:</span>
                <button
                  onClick={onOpenProfile}
                  className="text-xs text-cyber-cyan hover:underline font-mono"
                >
                  Change in Profile →
                </button>
              </div>

              <div className="flex items-center gap-2 text-white font-bold text-base font-mono">
                <Terminal className="w-4 h-4 text-cyber-cyan" />
                {targetRole.title}
              </div>

              <div className="text-xs text-gray-400 space-y-1">
                <span className="font-semibold text-gray-300">Bar-Raiser Benchmark:</span>
                <p className="italic text-gray-300">{targetRole.barRaiserExpectation}</p>
              </div>

              {intel?.weaknessCatalog && intel.weaknessCatalog.length > 0 && (
                <div className="pt-2 border-t border-cyber-border/60">
                  <span className="text-[11px] text-rose-400 font-mono flex items-center gap-1 mb-1">
                    <Flame className="w-3 h-3" /> Stored Cookie Intel: Lead HR will target your past weak spots:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {intel.weaknessCatalog.slice(0, 4).map((w, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-rose-950/60 border border-rose-500/30 text-rose-300 rounded font-mono">
                        {w.topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={handleStartInterview}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyber-cyan via-cyber-blue to-purple-600 text-black font-extrabold text-sm font-mono shadow-glow-cyan hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-black" />
                Initiate Bar-Raiser Drill
              </button>
              <p className="text-[11px] text-gray-500 mt-2 font-mono">
                {userProfile.apiKey ? '✓ Gemini API Connected' : '⚠ Click Profile in top-right to set Gemini API key first'}
              </p>
            </div>

          </div>
        )}

        {/* Message Feed */}
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            } space-y-1 animate-fadeIn`}
          >
            {/* Sender Badge */}
            <div className="flex items-center gap-2 px-1 text-[11px] font-mono text-gray-400">
              <span className={msg.role === 'user' ? 'text-cyber-cyan font-semibold' : 'text-rose-400 font-semibold'}>
                {msg.sender}
              </span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            {/* Message Bubble */}
            <div 
              className={`max-w-[88%] sm:max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-cyber-surface to-cyber-card border border-cyber-cyan/30 text-white rounded-br-none shadow-lg'
                  : 'bg-gradient-to-br from-cyber-card to-cyber-bg border border-cyber-border text-gray-100 rounded-bl-none shadow-xl'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans space-y-2">
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {/* Thinking / Typing Pulse */}
        {isThinking && (
          <div className="flex flex-col items-start space-y-1 animate-fadeIn">
            <div className="flex items-center gap-2 px-1 text-[11px] font-mono text-rose-400">
              <span>Victoria Vance (Analyzing Technical Depth...)</span>
            </div>
            <div className="p-4 rounded-2xl bg-cyber-card border border-cyber-border text-cyber-cyan rounded-bl-none flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
                <span className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse delay-75" />
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-150" />
              </div>
              <span className="text-xs font-mono text-gray-400">
                Auditing response against RFCs & NIST benchmarks...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input / Response Bar */}
      {isInterviewActive && (
        <form onSubmit={handleSubmitAnswer} className="bg-cyber-card/90 border border-cyber-border rounded-2xl p-3 shadow-2xl backdrop-blur-md space-y-2">
          
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isThinking || isEvaluating}
              placeholder="State your technical defense precisely (Ctrl+Enter to submit)... E.g., RFC specifications, packet headers, event IDs, containment steps"
              rows={3}
              className="w-full bg-cyber-bg border border-cyber-border rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-1 focus:ring-cyber-cyan font-sans resize-none transition-all"
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono hidden sm:flex">
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">Ctrl + Enter</span> to submit
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={handleConcludeInterview}
                disabled={isThinking || isEvaluating}
                className="px-3.5 py-2 rounded-xl text-xs font-mono text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-cyber-border transition-colors"
              >
                End Session Early
              </button>

              <button
                type="submit"
                disabled={isThinking || !inputText.trim() || isEvaluating}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue disabled:opacity-40 text-black font-bold text-xs font-mono shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Answer
              </button>
            </div>
          </div>

        </form>
      )}

    </div>
  );
}
