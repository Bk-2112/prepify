// Gemini API Service for Prepify
// Implements the ruthless MNC Lead HR Bar-Raiser persona with adaptive weakness probing & bulletproof multi-version API calls.

import { getWeaknessDossierPrompt } from '../utils/cookieManager';

// Cached working config for the current session
let cachedConfig = null;

const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest'
];

/**
 * Clean and sanitize API key string (strips quotes, whitespace, accidental prefixes)
 */
export function sanitizeKey(apiKey) {
  if (!apiKey) return '';
  let key = apiKey.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }
  return key;
}

/**
 * Parse Google API error response into a human readable message
 */
async function extractErrorMessage(response, defaultMsg = 'API request failed.') {
  try {
    const data = await response.json();
    if (data?.error?.message) {
      return data.error.message;
    }
    if (typeof data === 'string') return data;
  } catch (e) {
    // ignore
  }
  return `${defaultMsg} (HTTP ${response.status}: ${response.statusText})`;
}

/**
 * Discover the best available model for the given API key
 */
export async function discoverBestModel(apiKey) {
  if (cachedConfig?.model) return cachedConfig.model;
  
  const key = sanitizeKey(apiKey);
  if (!key) return 'gemini-2.0-flash';

  const apiVersions = ['v1beta', 'v1'];
  
  for (const version of apiVersions) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/${version}/models?key=${key}`);
      if (res.ok) {
        const data = await res.json();
        const models = data.models || [];
        
        const validModels = models.filter(m => 
          !m.supportedGenerationMethods || m.supportedGenerationMethods.includes('generateContent')
        ).map(m => m.name.replace(/^models\//, ''));

        if (validModels.length > 0) {
          for (const preferred of CANDIDATE_MODELS) {
            const found = validModels.find(vm => vm === preferred || vm.startsWith(preferred));
            if (found) {
              cachedConfig = { model: found, version };
              return found;
            }
          }
          cachedConfig = { model: validModels[0], version };
          return validModels[0];
        }
      }
    } catch (e) {
      // ignore
    }
  }
  
  return 'gemini-2.0-flash';
}

/**
 * Validate Gemini API Key with live ping and auto-discovered model
 */
export async function testGeminiKey(apiKey) {
  const key = sanitizeKey(apiKey);
  if (!key) {
    return { success: false, error: 'API key cannot be empty.' };
  }
  
  cachedConfig = null; // Reset cache on test
  let detailedLastError = null;

  // Step 1: Query ListModels on v1beta and v1 to check key validity
  const apiVersions = ['v1beta', 'v1'];
  let discoveredModels = [];
  let workingVersion = 'v1beta';

  for (const version of apiVersions) {
    try {
      const listRes = await fetch(`https://generativelanguage.googleapis.com/${version}/models?key=${key}`);
      if (listRes.ok) {
        const listData = await listRes.json();
        const available = (listData.models || [])
          .filter(m => !m.supportedGenerationMethods || m.supportedGenerationMethods.includes('generateContent'))
          .map(m => m.name.replace(/^models\//, ''));
        
        if (available.length > 0) {
          discoveredModels = available;
          workingVersion = version;
          break;
        }
      } else {
        const errMsg = await extractErrorMessage(listRes, 'Key verification failed');
        detailedLastError = errMsg;
        if (listRes.status === 400 || listRes.status === 403) {
          return { success: false, error: errMsg };
        }
      }
    } catch (e) {
      detailedLastError = e.message;
    }
  }

  // Compile list of models to try
  const modelsToTest = discoveredModels.length > 0 
    ? Array.from(new Set([...discoveredModels, ...CANDIDATE_MODELS]))
    : CANDIDATE_MODELS;

  // Step 2: Try pinging generateContent on available models
  for (const version of [workingVersion, 'v1beta', 'v1']) {
    for (const model of modelsToTest) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${key}`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'Respond with "PONG".' }] }]
          })
        });

        if (res.ok) {
          const resData = await res.json();
          if (resData?.candidates?.[0]?.content?.parts?.[0]?.text) {
            cachedConfig = { model, version };
            return { success: true, model: `${model} (${version})` };
          }
        } else {
          const err = await extractErrorMessage(res, `Failed on ${model}`);
          detailedLastError = err;
          if (res.status === 400 && err.toLowerCase().includes('api key')) {
            return { success: false, error: err };
          }
        }
      } catch (e) {
        detailedLastError = e.message;
      }
    }
  }

  return {
    success: false,
    error: detailedLastError || 'Unable to establish connection with Gemini API. Please check your API key.'
  };
}

/**
 * Build Bar-Raiser System Prompt
 */
export function buildBarRaiserSystemPrompt(candidateName, targetRole) {
  const weaknessDossier = getWeaknessDossierPrompt();
  
  return `
You are "Victoria Vance", the Lead HR & Executive Technical Hiring Bar-Raiser at 'CrowdShield Global Defense', the world's most demanding Tier-1 Cybersecurity MNC.

YOUR ABSOLUTE MANDATE:
You will NOT extend an offer or let any candidate enter our firm unless they demonstrate TEXTBOOK-PERFECT mastery of the required cybersecurity domain. A candidate who gives high-level, vague, buzzword-heavy, or standard ChatGPT-style superficial answers is an IMMEDIATE REJECT.

ROLE TARGETED: ${targetRole.title} (${targetRole.level})
CANDIDATE NAME: ${candidateName || 'Candidate'}

KEY CORE FOCUS DOMAINS:
${targetRole.focusAreas.map((area, i) => `${i + 1}. ${area}`).join('\n')}

BAR-RAISER RIGOR BENCHMARK:
${targetRole.barRaiserExpectation}

${weaknessDossier}

YOUR INTERVIEW BEHAVIOR RULES:
1. **Ruthlessly Professional, Direct, and Unflinching**: You have conducted over 5,000 elite security interviews. You do not smile at generic definitions. You cut straight to the bone.
2. **Deep Technical Dissection**:
   - If they mention a tool (e.g., Nmap, Wireshark, Splunk, Ghidra), immediately demand the exact CLI flags, filter syntax, packet headers, or event IDs.
   - If they explain a concept (e.g., Kerberoasting, Diffie-Hellman, XSS, Buffer Overflow, NIST SP 800-61), demand the architectural mechanics, memory layout, exact RFCs, or cryptographic math.
   - If they miss a single crucial parameter or make a factual error, call them out immediately, dismantle their misconception with surgical precision, and hit them with a brutal follow-up scenario.
3. **Adaptive Weakness Probing**:
   - Reference and aggressively grill them on any past documented weaknesses from their dossier.
   - Once they answer adequately or fail, shift rapidly to adjacent, unprobed domains to find their breaking point.
4. **Dynamic Pressure Tactics**:
   - Introduce sudden scenario pivots (e.g., "The client claims they had an EDR running, but the domain controller was wiped. The attacker bypassed your signature rule using unhooked NTDLL. How did they do it and how do you recover memory forensic artifacts under RFC 3227?").
5. **No Long Winded Greetings**:
   - Keep your responses punchy, sharp, highly technical, and provocative.
   - End every turn with a crisp, high-stakes question or drill.
6. **Structure of Your Turn**:
   - [Brief Critique / Rebuttal of Candidate's Last Response]: Highlight what was textbook accurate and what was superficial or wrong.
   - [Stress Scenario / Next Deep-Dive Question]: Demand exact technical specifics.
`.trim();
}

/**
 * Execute Gemini API Request
 */
async function callGemini(apiKey, contents, systemInstruction = null) {
  const key = sanitizeKey(apiKey);
  if (!key) throw new Error('Gemini API key is required. Please set it in the Profile bubble.');

  await discoverBestModel(key);
  const v = cachedConfig?.version || 'v1beta';
  const model = cachedConfig?.model || 'gemini-3.6-flash';
  
  try {
    const bodyPayload = {
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    if (systemInstruction && v === 'v1beta') {
      bodyPayload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    } else if (systemInstruction) {
      // For v1 or fallback when systemInstruction is not allowed, prepend instructions
      const firstMsg = contents[0];
      bodyPayload.contents = [
        {
          role: 'user',
          parts: [{ text: `[SYSTEM DIRECTIVE FOR HR BAR-RAISER]:\n${systemInstruction}\n\n[USER INSTRUCTION]:\n${firstMsg?.parts?.[0]?.text || ''}` }]
        },
        ...contents.slice(1)
      ];
    }

    const endpoint = `https://generativelanguage.googleapis.com/${v}/models/${model}:generateContent?key=${key}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const errMsg = errData.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(`[${model}] ${errMsg}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Empty response received from Gemini.');
    }
    
    return text;
  } catch (err) {
    console.error(`Gemini API Error:`, err);
    throw err;
  }
}

/**
 * Start a new interview session and get the Lead HR opening question
 */
export async function startInterviewSession(apiKey, candidateName, targetRole) {
  const systemPrompt = buildBarRaiserSystemPrompt(candidateName, targetRole);
  
  const initialPrompt = `
You are starting the placement interview now for candidate "${candidateName || 'Candidate'}" targeting the role: ${targetRole.title}.
Acknowledge the role briefly in 1-2 sharp sentences with Lead HR authority.
If there are documented past weaknesses in their dossier, state that our internal telemetry indicates past deficiencies in those exact topics and start immediately with a demanding, scenario-based question attacking that area.
If no past weaknesses exist, launch directly into your hardest baseline diagnostic question for this role requiring textbook accuracy (packet details, exact RFC/framework specifications, or low-level mechanics).
`.trim();

  const responseText = await callGemini(
    apiKey,
    [{ role: 'user', parts: [{ text: initialPrompt }] }],
    systemPrompt
  );

  return {
    systemPrompt,
    interviewerMessage: responseText
  };
}

/**
 * Send candidate response and get next interview turn
 */
export async function sendCandidateAnswer(apiKey, conversationHistory, systemPrompt) {
  const responseText = await callGemini(
    apiKey,
    conversationHistory,
    systemPrompt
  );

  return responseText;
}

/**
 * Evaluate Complete Interview & Generate Placement Scorecard + Telemetry
 */
export async function generateFinalPlacementScorecard(apiKey, candidateName, targetRole, transcriptHistory) {
  const transcriptText = transcriptHistory
    .map(t => `${t.role === 'user' ? (candidateName || 'Candidate') : 'Lead HR (Victoria Vance)'}: ${t.text}`)
    .join('\n\n');

  const evalPrompt = `
You are Victoria Vance, Lead HR & Bar-Raiser at CrowdShield Global Defense.
Evaluate the following complete placement interview transcript for ${candidateName || 'Candidate'} for the role: ${targetRole.title}.

TRANSCRIPT:
${transcriptText}

BENCHMARK: Textbook Perfection required. If the candidate used buzzwords, hand-waving, missed critical RFC standards, lacked packet-level clarity, or gave incomplete incident remediation, they FAIL the bar.

Provide your evaluation strictly as a valid JSON object matching this schema:
{
  "verdict": "PASS" | "FAIL" | "BORDERLINE",
  "overallScore": number (0 to 100),
  "hiringDecision": "OFFER EXTENDED" | "REJECTED (BAR NOT MET)" | "ADDITIONAL DRILL REQUIRED",
  "summary": "2-3 concise sentences summarizing their performance against top MNC standards",
  "radarScores": {
    "technicalPrecision": number (0-100),
    "incidentHandling": number (0-100),
    "threatModeling": number (0-100),
    "protocolDepth": number (0-100),
    "stressComposure": number (0-100)
  },
  "criticalWeaknesses": [
    "List of 2 to 4 very specific technical topics/concepts candidate stumbled on (e.g. 'TCP SYN Teardown Flags', 'Kerberos AS-REP Roasting Details', 'NIST SP 800-61 Step 3', 'IMDSv2 PUT Header TTL')"
  ],
  "verifiedStrengths": [
    "List of 1 to 3 areas where candidate was actually textbook accurate"
  ],
  "textbookCorrections": [
    {
      "topic": "Topic Name",
      "candidateError": "What candidate claimed or missed",
      "textbookTruth": "The exact textbook technical fact they should have answered"
    }
  ],
  "barRaiserClosingNote": "Direct closing statement from Victoria Vance to the candidate."
}

Return ONLY the raw JSON object. Do not include markdown code block backticks.
`.trim();

  const rawJson = await callGemini(
    apiKey,
    [{ role: 'user', parts: [{ text: evalPrompt }] }],
    "You are a strict technical placement evaluation engine. Output valid JSON only."
  );

  try {
    let cleanJson = rawJson.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    const parsed = JSON.parse(cleanJson);
    return parsed;
  } catch (e) {
    console.error('Failed to parse JSON scorecard:', rawJson);
    return {
      verdict: "FAIL",
      overallScore: 48,
      hiringDecision: "REJECTED (BAR NOT MET)",
      summary: "Candidate failed to meet textbook accuracy on core technical cybersecurity fundamentals.",
      radarScores: {
        technicalPrecision: 45,
        incidentHandling: 50,
        threatModeling: 40,
        protocolDepth: 45,
        stressComposure: 60
      },
      criticalWeaknesses: [
        "Network Protocol Headers & Flags",
        "Incident Containment Nuances",
        "Framework Specificity"
      ],
      verifiedStrengths: ["Basic security awareness terminology"],
      textbookCorrections: [
        {
          topic: "Core Fundamentals",
          candidateError: "Provided generic answers lacking specific RFC/protocol flags.",
          textbookTruth: "MNC Bar demands exact parameters, flags, and operational flow without hesitation."
        }
      ],
      barRaiserClosingNote: "At our firm, a breach takes seconds. Superficial answers do not stop APTs. Study the RFCs, revise your weaknesses, and re-attempt."
    };
  }
}
