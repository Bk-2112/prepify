// Compact Cookie Storage Manager for Prepify
// Ensures no DB is needed; saves User profile (Name, API Key, Role) & historical Weakness Intel in compressed cookies.

const COOKIE_USER_KEY = 'prepify_usr_cfg';
const COOKIE_INTEL_KEY = 'prepify_wk_intel';

/**
 * Sets a cookie with path, maxAge (365 days), and SameSite=Lax.
 */
export function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = '; expires=' + date.toUTCString();
  
  // URL safe encoding
  const encodedValue = encodeURIComponent(value);
  document.cookie = `${name}=${encodedValue}${expires}; path=/; SameSite=Lax`;
  
  // Safe mirror to localStorage for redundancy if cookies are restricted
  try {
    localStorage.setItem(name, value);
  } catch (e) {
    // ignore
  }
}

/**
 * Gets a cookie value by name.
 */
export function getCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const val = c.substring(nameEQ.length, c.length);
      return decodeURIComponent(val);
    }
  }
  
  // Fallback to localStorage
  try {
    const local = localStorage.getItem(name);
    if (local) return local;
  } catch (e) {
    // ignore
  }
  return null;
}

/**
 * Removes a cookie.
 */
export function deleteCookie(name) {
  document.cookie = `${name}=; Max-Age=-99999999; path=/; SameSite=Lax`;
  try {
    localStorage.removeItem(name);
  } catch (e) {
    // ignore
  }
}

/**
 * Robust JSON Serialization
 */
function compressData(obj) {
  try {
    const json = JSON.stringify(obj);
    return btoa(encodeURIComponent(json));
  } catch (e) {
    return JSON.stringify(obj);
  }
}

function decompressData(str) {
  if (!str) return null;
  try {
    const decoded = decodeURIComponent(atob(str));
    return JSON.parse(decoded);
  } catch (e) {
    try {
      return JSON.parse(str);
    } catch (err) {
      return null;
    }
  }
}

/**
 * Save user profile to cookie and return normalized profile object
 */
export function saveUserProfile({ name, apiKey, roleId }) {
  const cleanName = (name || '').trim();
  const cleanKey = (apiKey || '').trim();
  const cleanRole = roleId || 'fresher-soc-l1';

  const data = {
    n: cleanName,
    k: cleanKey,
    r: cleanRole,
    ts: Date.now()
  };
  
  const compact = compressData(data);
  setCookie(COOKIE_USER_KEY, compact, 365);

  // Return standard normalized profile object
  return {
    name: cleanName,
    apiKey: cleanKey,
    roleId: cleanRole
  };
}

/**
 * Load user profile from cookie
 */
export function getUserProfile() {
  const raw = getCookie(COOKIE_USER_KEY);
  if (!raw) {
    return {
      name: '',
      apiKey: '',
      roleId: 'fresher-soc-l1'
    };
  }
  const decompressed = decompressData(raw);
  if (!decompressed) {
    return {
      name: '',
      apiKey: '',
      roleId: 'fresher-soc-l1'
    };
  }
  return {
    name: decompressed.name || decompressed.n || '',
    apiKey: decompressed.apiKey || decompressed.k || '',
    roleId: decompressed.roleId || decompressed.r || 'fresher-soc-l1'
  };
}

/**
 * Save Interview Telemetry (Weaknesses, Score, Verdict, Role)
 * Keeps past 15 attempts in compact format to strictly preserve cookie size < 3KB.
 */
export function recordInterviewOutcome({ roleId, roleTitle, score, verdict, weaknesses = [], strengths = [], notes = '' }) {
  const intel = getInterviewIntel();
  
  const newRecord = {
    id: 'ses_' + Date.now().toString(36),
    ts: Date.now(),
    r: roleId,
    rt: roleTitle,
    s: Math.round(score),
    v: verdict, // 'PASS' | 'FAIL' | 'BORDERLINE'
    w: weaknesses.slice(0, 5), // top 5 specific weak concepts
    st: strengths.slice(0, 3),
    n: notes.substring(0, 150)
  };
  
  // Aggregate weak spots count
  const allWeaknesses = [...(intel.weaknessCatalog || [])];
  weaknesses.forEach(w => {
    const cleanW = w.trim();
    if (!cleanW) return;
    const existing = allWeaknesses.find(item => item.topic.toLowerCase() === cleanW.toLowerCase());
    if (existing) {
      existing.count += 1;
      existing.lastFailed = Date.now();
    } else {
      allWeaknesses.push({ topic: cleanW, count: 1, lastFailed: Date.now() });
    }
  });
  
  // Sort weaknesses by severity (failure count)
  allWeaknesses.sort((a, b) => b.count - a.count);
  
  const history = [newRecord, ...(intel.history || [])].slice(0, 15);
  
  const updatedIntel = {
    totalSessions: (intel.totalSessions || 0) + 1,
    passedSessions: (intel.passedSessions || 0) + (verdict === 'PASS' ? 1 : 0),
    avgScore: Math.round(
      ((intel.avgScore || 0) * (intel.totalSessions || 0) + score) / ((intel.totalSessions || 0) + 1)
    ),
    weaknessCatalog: allWeaknesses.slice(0, 12), // Keep top 12 primary weaknesses
    history: history
  };
  
  const compressed = compressData(updatedIntel);
  setCookie(COOKIE_INTEL_KEY, compressed, 365);
  return updatedIntel;
}

/**
 * Retrieve current Weakness Intel dossier from cookie
 */
export function getInterviewIntel() {
  const raw = getCookie(COOKIE_INTEL_KEY);
  if (!raw) {
    return {
      totalSessions: 0,
      passedSessions: 0,
      avgScore: 0,
      weaknessCatalog: [],
      history: []
    };
  }
  const decompressed = decompressData(raw);
  if (!decompressed) {
    return {
      totalSessions: 0,
      passedSessions: 0,
      avgScore: 0,
      weaknessCatalog: [],
      history: []
    };
  }
  return decompressed;
}

/**
 * Format weakness dossier for Gemini prompt injection
 */
export function getWeaknessDossierPrompt() {
  const intel = getInterviewIntel();
  if (!intel || intel.totalSessions === 0) {
    return "CANDIDATE DOSSIER: First-time candidate. No prior interview history in cookie database. Conduct thorough baseline diagnostic across all core role competencies.";
  }
  
  const topWeaknesses = (intel.weaknessCatalog || [])
    .filter(w => w.count >= 1)
    .map(w => `"${w.topic}" (Failed ${w.count}x)`)
    .join(', ');
    
  const recentHistory = (intel.history || []).slice(0, 3).map(h => 
    `[Role: ${h.rt}, Score: ${h.s}/100, Verdict: ${h.v}, Flaws: ${h.w.join('; ')}]`
  ).join(' | ');

  return `
CANDIDATE DOSSIER FROM PREVIOUS SESSIONS (STORED IN COOKIES):
- Total Previous Placement Attempts: ${intel.totalSessions} (Pass Rate: ${Math.round(((intel.passedSessions || 0) / (intel.totalSessions || 1)) * 100)}%, Cumulative Score Avg: ${intel.avgScore}/100)
- DOCUMENTED CRITICAL WEAKNESSES: ${topWeaknesses || 'None documented yet'}
- RECENT INTERVIEW HISTORIES: ${recentHistory}
- BAR-RAISER INSTRUCTION: Aggressively target these past documented weak spots early to verify if candidate has actually studied textbook corrections. Then, dynamically apply situational pressure to adjacent domains to expose new blind spots. Do not let them pass with generic answers.
`.trim();
}

/**
 * Reset interview history cookie
 */
export function clearInterviewIntel() {
  deleteCookie(COOKIE_INTEL_KEY);
  return {
    totalSessions: 0,
    passedSessions: 0,
    avgScore: 0,
    weaknessCatalog: [],
    history: []
  };
}
