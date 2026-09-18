// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { saveUserProfile, getUserProfile, getCookie, setCookie, deleteCookie, clearInterviewIntel, recordInterviewOutcome, getInterviewIntel } from './cookieManager';

describe('cookieManager', () => {
  beforeEach(() => {
    // Mock localStorage (jsdom provides document.cookie naturally)
    const store = {};
    
    vi.stubGlobal('localStorage', {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => { store[key] = value; },
      removeItem: (key) => { delete store[key]; },
    });
    
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('saves and retrieves user profile with default fallback', () => {
    const profile = saveUserProfile({ name: 'Alice', apiKey: 'test-key', roleId: 'expert' });
    expect(profile.name).toBe('Alice');
    
    const retrieved = getUserProfile();
    expect(retrieved.name).toBe('Alice');
    expect(retrieved.apiKey).toBe('test-key');
    expect(retrieved.roleId).toBe('expert');
  });

  it('handles empty profile gracefully', () => {
    deleteCookie('prepify_usr_cfg');
    const profile = getUserProfile();
    expect(profile.name).toBe('');
    expect(profile.roleId).toBe('fresher-soc-l1');
  });

  it('records interview outcomes and maintains history limits', () => {
    clearInterviewIntel();
    
    recordInterviewOutcome({
      roleId: 'fresher-soc-l1',
      roleTitle: 'SOC L1',
      score: 80,
      verdict: 'PASS',
      weaknesses: ['TCP Flags', 'OSI Model'],
      strengths: ['Enthusiasm'],
      notes: 'Good job'
    });

    const intel = getInterviewIntel();
    expect(intel.totalSessions).toBe(1);
    expect(intel.passedSessions).toBe(1);
    expect(intel.history.length).toBe(1);
    expect(intel.weaknessCatalog.find(w => w.topic === 'TCP Flags')).toBeDefined();
  });
});
