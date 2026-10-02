# 🇮🇳 BhuNiti

### National Digital Platform for Research, Policy Innovation & Evidence-Based Land Governance

> **Smart India Hackathon 2026 | Problem Statement 26019 | Team NexusIMEd**

BhuNiti is an AI-powered research and policy intelligence platform designed to connect **land records, geospatial data, research, policy documents, and scenario analysis** into one evidence-driven workflow.

It enables researchers and policymakers to move from:

**Discover → Map → Simulate → Generate a Cited Evidence Brief**

---

## 🎯 Problem Statement

| Field | Details |
|---|---|
| **Problem Statement ID** | 26019 |
| **Title** | National Digital Platform for Research, Policy Innovation, and Evidence-Based Land Governance |
| **Theme** | Smart Automation |
| **Category** | Software |
| **Team** | NexusIMEd |

---

## 🚀 Live Prototype

### [Open BhuNiti Live Prototype](https://bhuniti-national-land-governance-innovation-platf.ai.studio/)

> The prototype currently uses illustrative/sample data. Simulation outputs are demonstrations and are **not official government forecasts**.

---

## 💡 What BhuNiti Does

BhuNiti creates a unified workflow for evidence-based land governance by bringing together:

- 🔎 **AI-powered research & grounded search**
- 🗺️ **GIS-based land intelligence**
- 📊 **Land and policy analytics**
- 🧪 **Policy Simulation Engine**
- 🤖 **AI research assistant with citations**
- 📚 **Research repository**
- 👥 **Role-based workspaces**
- 💡 **Innovation & collaboration portal**
- 🧾 **Provenance-backed Evidence Briefs**
- 🔐 **Role-based access and audit trails**
- 🔌 **API integration gateway**
- 📈 **Role-specific dashboards**

---

## 🧩 SIH PS 26019 Coverage

BhuNiti maps the expected solution areas of the problem statement into a single platform:

| PS | Capability |
|---|---|
| **#7** | Research Repository |
| **#8** | AI-powered Search |
| **#9** | Collaborative Workspaces |
| **#10** | GIS Explorer |
| **#11** | Analytics |
| **#12** | Policy Simulation Engine |
| **#13** | Data Fabric |
| **#14** | AI Research |
| **#15** | Innovation Portal |
| **#16** | Role-specific Dashboards |
| **#17** | Role-Based Access |
| **#18** | Open API Gateway |

---
## 🏗️ Architecture

```text
                ┌─────────────────────┐
                │       INGEST        │
                │  Validated Records  │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │      HARMONISE      │
                │ Typed + Versioned   │
                │        Data         │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │       ANALYSE       │
                │   RAG + GIS +       │
                │      Trends         │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │      SIMULATE       │
                │ Scenario + Explicit │
                │    Assumptions      │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │       DELIVER       │
                │ Dashboard • Brief   │
                │        • API        │
                └─────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React + TypeScript |
| **Build Tool** | Vite |
| **Backend / API** | Node.js |
| **AI Layer** | Gemini API |
| **AI Research** | Grounded RAG with citations |
| **Geospatial** | React-Leaflet |
| **Simulation** | Deterministic what-if scenario engine |
| **Security** | Role-based access, masking & audit-oriented controls |
| **Integration** | API Developer Gateway |

---

## ⚙️ Run Locally

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git
- A valid Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/sakshamlc/BhuNiti-SIH2026.git
cd BhuNiti-SIH2026
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file.

**Windows CMD**

```cmd
copy .env.example .env
```

Then open `.env` and provide the required local environment values, including your Gemini API key.

> ⚠️ Never commit your `.env` file or API keys to GitHub.

### 4. Start BhuNiti

```bash
npm run dev
```

The development server should start at:

```text
http://localhost:3000
```

Open the address in your browser.

---

## ✅ Prototype Status

BhuNiti clearly separates implemented prototype capabilities from sandbox demonstrations and proposed production integrations.

### 🟢 BUILT

- Unified BhuNiti web interface
- Research repository experience
- AI-assisted research workflow
- GIS exploration interface
- Analytics and dashboards
- Policy scenario comparison workflow
- Evidence Brief workflow
- Role-oriented platform experience
- API/developer experience

### 🟡 SANDBOXED / DEMONSTRATION

- Illustrative land datasets
- Demonstration policy scenarios
- Prototype AI-assisted analysis
- Sample dashboard indicators

These components demonstrate the intended workflow and should not be interpreted as official government datasets, policy recommendations, or forecasts.

### 🔵 PILOT / PRODUCTION ROADMAP

Production deployment can extend the prototype with:

- PostgreSQL / PostGIS
- Authoritative government datasets
- STAC / OGC-compatible geospatial feeds
- Live departmental connectors
- Production authentication and authorization controls
- Data governance and audit infrastructure
- Bhashini-based multilingual capabilities
- Production-scale monitoring and deployment infrastructure

---

## 🔍 Trust, Evidence & Provenance

BhuNiti is designed around evidence traceability rather than opaque AI-generated conclusions.

The platform workflow is designed to connect:

**Source → Evidence → Analysis → Assumptions → Scenario → Evidence Brief**

Key principles include:

- Citation-backed AI research
- Visible source attribution
- Explicit simulation assumptions
- Separation of evidence from simulated outcomes
- Provenance-oriented Evidence Briefs
- Human review before policy interpretation

---

## 🔐 Security

BhuNiti's prototype demonstrates a role-oriented architecture designed for different governance and research workflows.

Production deployment would strengthen this with:

- Secure identity management
- Fine-grained RBAC
- Dataset-level permissions
- Sensitive-field masking
- Audit logging
- API authentication and authorization
- Secure secret management

> The current repository is a hackathon prototype and should not be treated as a production security implementation.

---

## 🧪 Reproducibility

The repository has been validated using a clean-clone workflow:

```text
Clone Repository
      ↓
npm install
      ↓
Configure .env
      ↓
npm run dev
      ↓
BhuNiti running locally
```

The application can therefore be independently installed and executed from the repository using the setup instructions above.

---

## ⚠️ Prototype Disclaimer

BhuNiti is a Smart India Hackathon prototype.

The current implementation uses illustrative/sample data for demonstrating platform workflows. Analytics and simulation outputs are intended to demonstrate system capabilities and are **not official government records, forecasts, legal determinations, or policy recommendations**.

Production use would require integration with validated authoritative datasets, appropriate governmental approvals, security controls, and domain validation.

---

## 👥 Team

**Team NexusIMEd**

Smart India Hackathon 2026  
Problem Statement **26019**

**BhuNiti — From scattered land data to cited, testable policy evidence.**

---

## 🔗 Quick Links

- **Live Prototype:** https://bhuniti-national-land-governance-innovation-platf.ai.studio/
- **Repository:** https://github.com/sakshamlc/BhuNiti-SIH2026

---

⭐ **Built for Smart India Hackathon 2026 — Team NexusIMEd**
