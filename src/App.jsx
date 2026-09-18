import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import InterviewConsole from './components/InterviewConsole';
import ProfileModal from './components/ProfileModal';
import ScorecardModal from './components/ScorecardModal';
import HistoryModal from './components/HistoryModal';
import { getUserProfile, getInterviewIntel } from './utils/cookieManager';
import { CYBER_ROLES } from './data/roles';
import { ShieldCheck, Cpu, Database, Flame, Lock } from 'lucide-react';

export default function App() {
  const [userProfile, setUserProfile] = useState(() => getUserProfile());
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [scorecardData, setScorecardData] = useState(null);
  const [isScorecardOpen, setIsScorecardOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [autoStartFlag, setAutoStartFlag] = useState(false);

  // Check if first-time user without API key; open profile automatically to prompt them
  useEffect(() => {
    const profile = getUserProfile();
    setUserProfile(profile);
    if (!profile.apiKey) {
      setIsProfileOpen(true);
    }
  }, []);

  const handleProfileUpdate = (updatedProfile) => {
    setUserProfile(updatedProfile);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSaveAndStart = (updatedProfile) => {
    setUserProfile(updatedProfile);
    setAutoStartFlag(true);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleShowScorecard = (scorecard) => {
    setScorecardData(scorecard);
    setIsScorecardOpen(true);
    setRefreshTrigger(prev => prev + 1);
  };

  const currentRole = CYBER_ROLES.find(r => r.id === userProfile.roleId) || CYBER_ROLES[0];

  return (
    <div className="min-h-screen bg-cyber-bg cyber-grid-bg flex flex-col selection:bg-cyber-cyan selection:text-black">
      
      {/* Top Navigation */}
      <Navbar 
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Central Interview Console */}
      <main className="flex-1 flex flex-col">
        <InterviewConsole 
          key={`${userProfile.roleId}_${refreshTrigger}`}
          userProfile={userProfile}
          autoStartOnMount={autoStartFlag}
          onResetAutoStart={() => setAutoStartFlag(false)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onShowScorecard={handleShowScorecard}
        />
      </main>

      {/* Footer Info Bar */}
      <footer className="border-t border-cyber-border/70 bg-cyber-bg/80 backdrop-blur-sm py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-[11px] text-gray-500 font-mono gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-gray-300">Cybersecurity MNC Lead Bar-Raiser Engine</span>
            <span className="text-gray-600">|</span>
            <span>Client-side Cookie Memory (Zero DB)</span>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-cyber-cyan" /> Secure Local Execution
            </span>
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3 text-cyber-accent" /> Compressed Cookies
            </span>
          </div>
        </div>
      </footer>

      {/* Top-Right Profile & Settings Modal */}
      <ProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        onProfileUpdate={handleProfileUpdate}
        onStartInterview={handleSaveAndStart}
      />

      {/* Placement Scorecard & Weakness Telemetry Modal */}
      <ScorecardModal 
        isOpen={isScorecardOpen}
        onClose={() => setIsScorecardOpen(false)}
        scorecard={scorecardData}
        targetRole={currentRole}
        candidateName={userProfile.name}
        onRetakeInterview={() => {
          setIsScorecardOpen(false);
          setAutoStartFlag(true);
          setRefreshTrigger(prev => prev + 1);
        }}
      />

      {/* Candidate History Telemetry Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

    </div>
  );
}
