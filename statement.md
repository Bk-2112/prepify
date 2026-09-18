# Problem Statement

Modern cybersecurity interviews at Tier-1 Multinational Corporations (MNCs) demand a level of precision and textbook accuracy that generic interview simulators fail to assess. Candidates often pass entry-level theoretical filters but fail during the "Bar-Raiser" round due to superficial knowledge, inability to recall specific RFC standards, or failing to construct precise low-level technical defenses under pressure. Prepify addresses this gap by providing an adversarial, highly strict "Lead HR Bar-Raiser" simulation engine that explicitly probes for textbook accuracy and historical weaknesses without relying on heavy backend databases.

## Scope of the Project

The Prepify platform is a web-based evaluation tool scoped to provide:
1. **Adversarial AI Interviewing**: Integrates with the Gemini API to act as a strict HR Bar-Raiser (Victoria Vance) across different cybersecurity roles (e.g., SOC L1, Cloud Security Architect).
2. **Local Telemetry & Weakness Storage**: Uses compressed browser cookies to track a candidate’s historical performance and weak spots (Zero DB architecture), which the AI uses to adaptively grill the user.
3. **Evaluation & Scorecards**: Automatically assesses the interview transcript against textbook benchmarks and produces a rigorous placement scorecard.

## Target Users

- **Cybersecurity Candidates**: Individuals preparing for high-stakes interviews at Tier-1 MNCs who need realistic, high-pressure technical drills.
- **Bootcamp Graduates / Freshers**: Users trying to bridge the gap between high-level theory and the exact low-level precision demanded in real-world scenarios.
- **Experienced Professionals**: Veterans looking to validate their technical depth and ensure they haven't developed blind spots in emerging frameworks or specific protocol mechanics.

## High-Level Features

1. **Role-Specific Scenarios**: Supports various distinct cybersecurity personas (SOC L1, Cloud Security Architect, Threat Hunter, etc.) with specific benchmarks.
2. **Adaptive Weakness Probing**: The AI dynamically recalls past weaknesses stored in the user's local cookies and aggressively targets them.
3. **Zero-DB Architecture**: Fully client-side storage utilizing compressed cookies and localStorage for extreme privacy and portability.
4. **Ruthless Evaluation Scorecards**: Generates a detailed breakdown of radar scores, critical weaknesses, verified strengths, and textbook corrections at the end of the session.
5. **Historical Telemetry**: Candidates can view their historical scorecard data and weakness catalogs directly through the integrated History interface.
