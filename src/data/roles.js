// Comprehensive Cybersecurity Roles from Fresher to Experienced
// Requirement: "(freshers)" text ahead of that role in the dropdown menu for fresher positions.

export const CYBER_ROLES = [
  {
    id: 'fresher-soc-l1',
    title: '(freshers) Junior SOC Analyst L1',
    level: 'Entry Level / Fresher',
    isFresher: true,
    focusAreas: [
      'OSI & TCP/IP Model (Packet Headers, Flags, Ports)',
      'SIEM Log Analysis (Splunk, ELK, Windows Event IDs: 4624, 4625, 4688, 7045)',
      'Phishing Analysis (Email Headers, SPF, DKIM, DMARC, Base64/Hex Decoding)',
      'Malware Triage & Hash Verification (VirusTotal, Hybrid-Analysis, Sandbox)',
      'NIST SP 800-61 Rev 2 Incident Handling Lifecycle'
    ],
    barRaiserExpectation: 'Candidate must recite exact Windows event IDs, understand TCP flags at packet level, explain SPF/DKIM validation failures down to DNS records, and follow NIST incident response steps without hesitation.'
  },
  {
    id: 'fresher-pen-tester',
    title: '(freshers) Junior Penetration Tester / Ethical Hacker',
    level: 'Entry Level / Fresher',
    isFresher: true,
    focusAreas: [
      'OWASP Top 10 (SQLi, XSS, CSRF vs CORS, IDOR, SSRF mechanisms)',
      'Nmap Scanning Techniques (SYN vs Full Connect, FIN, Xmas, ACK scans)',
      'Burp Suite Workflow (Repeater, Intruder, Decoder, Scope Management)',
      'Linux PrivEsc Basics (SUID bits, sudo -l, cron misconfigurations, PATH hijacking)',
      'Metasploit & Exploit-DB basics vs manual exploitation rigor'
    ],
    barRaiserExpectation: 'Candidate must explain how SQLi occurs in memory/AST level, the exact HTTP headers involved in CORS preflight (OPTIONS), and distinguish between stored, reflected, and DOM-based XSS payload execution contexts.'
  },
  {
    id: 'fresher-infosec-associate',
    title: '(freshers) Information Security Associate',
    level: 'Entry Level / Fresher',
    isFresher: true,
    focusAreas: [
      'CIA Triad & Non-Repudiation Deep Dive',
      'Symmetric vs Asymmetric Encryption (AES-GCM, RSA, ECC, Diffie-Hellman Key Exchange)',
      'Identity & Access Management (RBAC vs ABAC, MFA, OAuth2 vs OpenID Connect)',
      'Firewall Types (Stateful, Stateless, Next-Gen WAF, Proxy)',
      'Basic Compliance & Security Standards (ISO 27001, GDPR, PCI-DSS)'
    ],
    barRaiserExpectation: 'Candidate must explain math/mechanics of Diffie-Hellman key exchange, differences between AES-CBC and AES-GCM (MAC integration), and how digital signatures achieve authenticity and non-repudiation.'
  },
  {
    id: 'fresher-incident-responder',
    title: '(freshers) Cybersecurity Incident Response Trainee',
    level: 'Entry Level / Fresher',
    isFresher: true,
    focusAreas: [
      'Order of Volatility in Memory/Disk Forensics (RFC 3227)',
      'Live Triage (Sysinternals Procmon, Autoruns, netstat, lsof, ps aux)',
      'Ransomware Containment Protocols (Network segmentation, VSS snapshots)',
      'MITRE ATT&CK Matrix Navigation (Initial Access to Impact)',
      'Evidence Chain of Custody & Hash Integrity (SHA-256)'
    ],
    barRaiserExpectation: 'Candidate must list the exact RFC 3227 order of volatility, distinguish between process injection techniques, and outline surgical containment without destroying in-memory artifacts.'
  },
  {
    id: 'fresher-vapt-analyst',
    title: '(freshers) Vulnerability Assessment Analyst',
    level: 'Entry Level / Fresher',
    isFresher: true,
    focusAreas: [
      'CVSS v3.1 / v4.0 Scoring Metrics (AV, AC, PR, UI, S, C, I, A)',
      'Vulnerability Scanners (Nessus, OpenVAS, Qualys - false positive triage)',
      'Patch Management & Exploit Window (Zero-day vs Known CVEs)',
      'SSL/TLS Configuration Flaws (Heartbleed, POODLE, Weak Ciphers)',
      'Basic Network Architecture & Demilitarized Zones (DMZ)'
    ],
    barRaiserExpectation: 'Candidate must calculate or justify CVSS vector metrics for complex CVEs, explain how SSL renegotiation attacks work, and distinguish false positives from weaponized exploits.'
  },
  {
    id: 'mid-soc-l2',
    title: 'Mid SOC Analyst L2 / Threat Hunter',
    level: 'Mid Level (2-4 Years)',
    isFresher: false,
    focusAreas: [
      'Advanced Threat Hunting (Sysmon Configs, Sigma Rules, YARA, KQL/SPL)',
      'Living off the Land Binaries (LOLBAS - certutil, bitsadmin, mshta, powershell)',
      'Kerberos Attacks (Kerberoasting, AS-REP Roasting, Golden/Silver Tickets, Pass-the-Hash)',
      'Endpoint Detection & Response (EDR) Telemetry & Bypass awareness',
      'C2 Framework Detection (Cobalt Strike malleable C2 profiles, DNS tunneling, Beaconing)'
    ],
    barRaiserExpectation: 'Candidate must detail Kerberos ticket grant protocols (TGT vs TGS encryption keys), craft exact KQL/SPL queries to catch beaconing intervals via jitter, and explain LOLBAS process spoofing.'
  },
  {
    id: 'senior-red-teamer',
    title: 'Senior Penetration Tester / Red Team Specialist',
    level: 'Senior Level (5+ Years)',
    isFresher: false,
    focusAreas: [
      'Active Directory Domain Compromise (BloodHound, DCSync, ACL Abuse, Shadow Credentials)',
      'Binary Exploitation & Memory Safety (Stack/Heap BoF, ROP chains, ASLR/DEP bypass)',
      'AV/EDR Evasion (Direct System Calls, API unhooking, Process Hollowing, PPID spoofing)',
      'Custom Payload Weaponization & Obfuscation (Shellcode loaders in C/C++, Rust)',
      'Cloud Environment Lateral Movement & IAM Privilege Escalation'
    ],
    barRaiserExpectation: 'Candidate must explain how NTDS.dit extraction works via MS-DRSR protocol, write synthetic ROP chain payload logic, and describe how EDRs hook ntdll.dll in userland vs kernel callbacks.'
  },
  {
    id: 'cloud-sec-engineer',
    title: 'Cloud Security Engineer (AWS / Azure / GCP)',
    level: 'Mid-Senior Level (3-6 Years)',
    isFresher: false,
    focusAreas: [
      'AWS IAM Policy Evaluation Logic (Explicit Deny, SCPs, Permission Boundaries)',
      'Cloud Architecture (VPC Peering, Transit Gateways, PrivateLink, WAF, GuardDuty)',
      'Kubernetes Security (RBAC, Pod Security Admission, NetworkPolicies, CIS Benchmarks)',
      'Serverless Security, SSRF to IMDSv1 vs IMDSv2 Token Protection',
      'Infrastructure as Code (IaC) Security (Terraform drift, Checkov, Trivy)'
    ],
    barRaiserExpectation: 'Candidate must break down IMDSv2 PUT request flow with TTL headers, explain IAM permission evaluation order with multiple SCPs, and demonstrate zero-trust VPC segmentation.'
  },
  {
    id: 'appsec-engineer',
    title: 'Application Security (AppSec) / DevSecOps Engineer',
    level: 'Mid-Senior Level (3-5 Years)',
    isFresher: false,
    focusAreas: [
      'SAST, DAST, SCA & Secrets Scanning in CI/CD (GitHub Actions, GitLab Pipelines)',
      'Complex Vulnerabilities (Prototype Pollution, SSTI, Deserialization Gadget Chains, Race Conditions)',
      'Secure Software Design (Threat Modeling using STRIDE & PASTA)',
      'OAuth 2.0 & OIDC Flow Security (PKCE, State parameter, Token leakage)',
      'Container Escape & Microservice Security (gRPC, Envoy, Service Mesh mTLS)'
    ],
    barRaiserExpectation: 'Candidate must write the exact STRIDE matrix for an architectural diagram, explain Java/Python pickle gadget chains, and detail OAuth PKCE code_verifier/code_challenge sha256 exchange.'
  },
  {
    id: 'lead-sec-architect',
    title: 'Principal Security Architect / Lead CISO Candidate',
    level: 'Lead / Executive Level (7+ Years)',
    isFresher: false,
    focusAreas: [
      'Zero-Trust Architecture (NIST SP 800-207 - Policy Engine, Policy Administrator, PEP)',
      'Enterprise Risk Management (FAIR framework, Risk matrices, Residual Risk calculation)',
      'Regulatory Governance & Global Audits (SOX, SOC 2 Type II, ISO 27001:2022, FedRAMP)',
      'MNC Crisis Management & Ransomware Negotiation/Legal Disclosure (SEC 4-day rule)',
      'Supply Chain Risk & Software Bill of Materials (SBOM / CycloneDX / SPDX)'
    ],
    barRaiserExpectation: 'Candidate must formulate executive risk quantification (Annualized Loss Expectancy = SLE x ARO), architect a zero-trust enclave under NIST 800-207, and handle SEC 8-K disclosure strategy under pressure.'
  }
];

export const DEFAULT_ROLE = CYBER_ROLES[0];
