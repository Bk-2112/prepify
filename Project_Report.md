# Prepify - Project Report
**VITyarthi - Build Your Own Project**

## 1. Cover Page
- **Project Title**: Prepify - AI Bar-Raiser Interview Engine
- **Course**: [Insert Course Name]
- **Student Name**: [Insert Your Name]
- **Roll Number / ID**: [Insert ID]

## 2. Introduction
Prepify is a sophisticated web application designed to simulate rigorous technical interviews, specifically modeling the strict, high-pressure environment of Tier-1 Cybersecurity MNCs. Using the Gemini API, it provides dynamic, adversarial interviewing capabilities (acting as "Victoria Vance, Lead HR") to test candidates on their textbook accuracy and practical problem-solving skills. The project enforces a strict evaluation criterion and retains historical performance telemetry directly on the client side using compressed browser cookies (Zero-DB architecture).

## 3. Problem Statement
Candidates often pass entry-level theoretical filters but fail during final "Bar-Raiser" rounds because they lack the low-level precision demanded (e.g., exact RFC standards, packet headers). Prepify solves this by simulating these high-pressure scenarios, aggressively probing for weaknesses, and forcing users to adapt and provide textbook-accurate responses.

## 4. Functional Requirements
1. **User Profile & Configuration Management**: Users can configure their Gemini API key, select their target role (e.g., SOC L1, Cloud Security Architect), and update their profile.
2. **AI Bar-Raiser Engine**: The core interviewing module where candidates interact with the AI in real-time. The AI generates scenarios and evaluates responses based on strict role-specific benchmarks.
3. **Telemetry & Scorecard System**: Automatically generates a placement scorecard evaluating technical precision, incident handling, etc., and persists this history in local cookies for future reference.

## 5. Non-functional Requirements
1. **Performance**: Achieved via a Zero-DB architecture using fast client-side storage (cookies/localStorage) for telemetry, resulting in near-instant load times.
2. **Security**: API keys are strictly kept on the client-side within cookies and never transmitted to any backend server (other than the direct API call to Google's generative language endpoints).
3. **Usability**: The interface utilizes modern, highly-responsive cyber-themed aesthetics with micro-animations and intuitive modal navigations.
4. **Reliability**: Incorporates resilient API fallback mechanisms (e.g., testing multiple Gemini models and versions dynamically) to ensure uptime even if certain models are deprecated.

## 6. System Architecture
Prepify follows a **Client-Centric, Zero-DB Architecture**:
- **Frontend Layer**: React + Vite application, styled with TailwindCSS.
- **State Management**: React Hooks (`useState`, `useEffect`) combined with custom cookie-based persistent storage.
- **Service Layer**: A dedicated `gemini.js` service handles all prompt engineering, model discovery, and interaction with the Google Gemini API.
- **Storage Layer**: Compressed HTTP cookies (mirrored to `localStorage` for redundancy) handle all state persistence.

## 7. Design Diagrams
*(Note: Please refer to the `README.md` for visual Mermaid diagrams of the System Architecture, Process Flow, Use Case, Sequence, and ER schemas)*
- **Use Case Diagram**: Captures Candidate interactions (Configuring Key, Taking Interview, Viewing History).
- **Workflow Diagram**: Depicts the step-by-step process of starting a drill, submitting answers, and receiving the scorecard.
- **Sequence Diagram**: Shows the exact message passing between the React UI, Cookie Manager, and Gemini API.
- **ER / Schema Design**: The simplified document structure of the compressed `prepify_usr_cfg` and `prepify_wk_intel` JSON payloads.

## 8. Design Decisions & Rationale
- **Zero-DB Approach**: Opted for compressed cookies instead of a traditional backend (Node.js/MongoDB) to reduce hosting costs to zero, maximize privacy, and demonstrate advanced client-side state manipulation.
- **Cyber-Themed UI**: The dark mode, "glassmorphism" styling, and monospace typography were chosen to immerse the candidate in a high-stakes, technical environment.
- **Adaptive Prompt Engineering**: Instead of static questions, the system passes a 'Weakness Dossier' to the AI so it targets concepts the candidate previously failed.

## 9. Implementation Details
The project is organized into modular React components:
- `App.jsx`: Main orchestrator.
- `components/InterviewConsole.jsx`: The complex chat interface handling the real-time AI loop.
- `services/gemini.js`: A robust API wrapper containing fallback logic, model auto-discovery, and JSON schema extraction for scorecards.
- `utils/cookieManager.js`: Implements Base64 + URI encoding to fit complex telemetry JSONs into lightweight browser cookies.

## 10. Screenshots / Results
*(Attach screenshots of the main console, profile setup, scorecard, and history modals here)*

## 11. Testing Approach
Unit testing is implemented using **Vitest** and the **JSdom** environment. Tests are focused on the core persistence logic (`cookieManager.test.js`), ensuring that user profiles can be saved, missing cookies are handled gracefully, and interview histories correctly truncate to stay within the 3KB cookie limit.

## 12. Challenges Faced
- **API Model Volatility**: Google frequently deprecates or updates Gemini models (e.g., moving from `gemini-pro` to `gemini-1.5-flash`). This was solved by building an auto-discovery fallback loop that queries the API for available generation models dynamically.
- **Cookie Size Limits**: Browsers limit cookies to ~4KB. Storing large interview transcripts was impossible, so the solution involved only storing high-level metadata (weakness tags, scores, verdicts) and compressing it.

## 13. Learnings & Key Takeaways
- Deepened understanding of React state management and component lifecycle.
- Mastered advanced Prompt Engineering and JSON-schema extraction from LLMs.
- Learned to architect lightweight, zero-backend applications using browser storage constraints.

## 14. Future Enhancements
- Support for Voice-to-Text interaction.
- Adding a specific "Code Execution" sandbox where candidates must fix vulnerable code snippets in real-time.
- Implementing an export feature to let users share their scorecards externally.

## 15. References
- [React Documentation](https://react.dev/)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [ViteJS Tooling](https://vitejs.dev/)
