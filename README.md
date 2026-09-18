# Prepify.ai - MNC Bar-Raiser Interview Engine

Prepify is a sophisticated web application designed to simulate rigorous technical interviews, specifically modeling the strict, high-pressure environment of Tier-1 Cybersecurity MNCs.

## Features
- **Role-Specific Scenarios**: Targets SOC L1, Cloud Security Architect, Threat Hunter, etc.
- **Adaptive Weakness Probing**: Remembers your past mistakes and grills you on them in subsequent sessions.
- **Zero-DB Architecture**: 100% client-side privacy. All telemetry is stored in compressed cookies.
- **Placement Scorecards**: Rigorous evaluations with textbook corrections and radar scores.

## Technologies Used
- React 19 + Vite
- TailwindCSS v4
- Google Gemini API (AI Engine)
- Vitest (Testing)
- Lucide React (Icons)

## Installation & Running Locally
1. Clone the repository and navigate to the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the app at `http://localhost:5173`. Click the Profile icon to enter your Gemini API key.

## Testing
To run the automated tests for core persistence logic:
```bash
npm install -D vitest jsdom
npm test
```

## UML & Design Diagrams

### System Architecture
```mermaid
graph TD
    UI[React UI Components] -->|State Management| Hooks[Custom Hooks]
    Hooks -->|Persists Data| CM[Cookie Manager]
    Hooks -->|Generates Scenarios| Gemini[Gemini API Service]
    CM -->|Compresses & Stores| Storage[(Browser Cookies / LocalStorage)]
    Gemini -->|HTTP POST| Google[Google Generative Language API]
```

### Process Workflow
```mermaid
flowchart LR
    A[Start] --> B[Enter API Key & Role]
    B --> C[Fetch History from Cookies]
    C --> D[Initialize Gemini Bar-Raiser]
    D --> E{Candidate Answers}
    E -->|Next Turn| D
    E -->|Conclude| F[Generate JSON Scorecard]
    F --> G[Save Weaknesses to Cookies]
    G --> H[Display Scorecard & End]
```

### Use Case Diagram
```mermaid
usecase
    actor Candidate
    usecase "Configure Profile/Key" as UC1
    usecase "View Telemetry History" as UC2
    usecase "Take Technical Interview" as UC3
    usecase "Receive Scorecard" as UC4
    
    Candidate --> UC1
    Candidate --> UC2
    Candidate --> UC3
    UC3 --> UC4
```

### Sequence Diagram
```mermaid
sequenceDiagram
    participant U as User
    participant App as React UI
    participant CM as Cookie Manager
    participant G as Gemini API
    
    U->>App: Clicks Start Drill
    App->>CM: getInterviewIntel()
    CM-->>App: Returns Weakness Dossier
    App->>G: startInterviewSession(Weaknesses)
    G-->>App: First Lead HR Question
    U->>App: Submits Technical Answer
    App->>G: sendCandidateAnswer(History)
    G-->>App: Follow-up Question
    U->>App: Concludes Session
    App->>G: generateFinalPlacementScorecard()
    G-->>App: JSON Scorecard
    App->>CM: recordInterviewOutcome(Scorecard)
    CM-->>App: Updates Cookies
    App->>U: Displays Scorecard Modal
```

## Screenshots
*(Optional: Ensure to attach screenshots in the root directory or embed them here)*
