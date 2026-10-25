# Verdiq

### Carbon Footprint Measurement & Carbon Credit Lifecycle Management

**Measure. Verify. Trade. Retire.**

Verdiq is an academic web-application prototype designed to bring carbon-footprint reporting and carbon-credit lifecycle management into one role-governed platform. It explores how businesses can record their emissions while environmental project developers, auditors, administrators, and buyers participate in a connected process for reviewing projects, issuing credits, purchasing them, and recording retirement.

> **Project status:** Working prototype for academic and demonstration purposes. Verdiq is not a certification body or a production-ready carbon-market infrastructure.

## The Problem

Carbon-footprint assessment and carbon-credit management can involve separate processes. This can make it difficult for users to connect their emissions reporting with credit discovery, project review, ownership records, and final retirement.

Verdiq explores a more connected workflow. It brings the main activities into one application and maintains relationships between important records, helping users follow the lifecycle from a submitted project to issued credits, purchases, and retirement certificates.

## How It Works

The platform is organised around four stages:

1. **Measure** — Buyers can calculate their carbon footprint and save footprint reports.
2. **Verify** — Developers create projects, upload supporting documents, and submit projects for review. Auditors assess submissions and approve or reject them, including specifying an approved credit-issuance quantity.
3. **Trade** — Administrators issue credits using the approved quantity. Developers can list issued credits, and buyers can browse listings and purchase available quantities.
4. **Retire** — Buyers can manage purchased holdings, retire credits, and retrieve a certificate associated with the retirement record.

The footprint calculator and credit lifecycle are available within the same platform. A footprint report does **not** automatically trigger a credit purchase or determine an equivalent quantity of credits.

## Key Features

- **Carbon-footprint calculator:** Calculates and displays an estimate using the prototype's emission factors.
- **Footprint reporting:** Allows eligible buyers to save footprint reports and their associated input data.
- **Project submission:** Enables developers to submit project information and supporting evidence.
- **Auditor review:** Supports approval, rejection, and resubmission of projects.
- **Controlled issuance:** Separates the developer's expected quantity from the auditor-approved quantity used for credit issuance.
- **Credit marketplace:** Supports listings for issued credits and buyer purchases.
- **Portfolio and retirement:** Tracks purchased holdings and records partial or full retirement.
- **Retirement certificates:** Provides a certificate linked to a retirement record.
- **Role-based access:** Separates the responsibilities of buyers, developers, auditors, and administrators.
- **Relational traceability:** Connects projects, documents, audits, credits, listings, purchases, retirements, certificates, and footprint reports through database relationships.

## User Roles

| Role | Main responsibilities |
|---|---|
| **Developer** | Create projects, upload supporting documents, submit projects for review, and manage issued credit inventory. |
| **Auditor** | Review project submissions and evidence; approve or reject submissions and specify an eligible issuance quantity. |
| **Administrator** | Manage platform-level operations and issue credits according to the approved quantity. |
| **Buyer** | Calculate and save footprint reports, browse and purchase credits, manage holdings, and retire credits. |

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend API | Node.js, Express.js |
| Database | MySQL |
| Authentication | JSON Web Tokens (JWT) and hashed passwords |
| Document uploads | Multer with local filesystem storage in the current prototype |
| Frontend hosting | Vercel |
| Backend hosting | Render |

## High-Level Architecture

```text
Browser
  │
  ▼
React + TypeScript + Vite frontend (Vercel)
  │  HTTP API requests
  ▼
Express.js backend (Render)
  ├── Authentication and role-based authorization
  ├── Project and document workflows
  ├── Auditor review and credit issuance
  ├── Marketplace and purchases
  ├── Footprint reports
  └── Retirements and certificates
  │
  ├── MySQL database (structured records)
  └── Local upload storage (project documents in the current backend setup)
```

## Getting Started

### Prerequisites

- Node.js and npm
- Git
- MySQL, if you are running the backend locally

### Run the Frontend Locally

```bash
git clone https://github.com/kavyanshgoenka11-hub/verdiq.git
cd verdiq
npm install
npm run dev
```

Vite will print the local development URL in the terminal. Open that URL in your browser.

### Build the Frontend

```bash
npm run build
```

To run the project's configured lint checks, use:

```bash
npm run lint
```

### Backend Configuration

The backend is deployed separately from the Vite frontend. The currently configured backend base URL is:

```text
https://verdiq-coiw.onrender.com
```

Its health endpoint is available at `/api/health` when the service is running. For local backend development, configure MySQL connection settings and the JWT secret using the environment-variable names expected by the backend code. Configure the frontend API base URL using the existing API configuration in the source code.

**Do not commit database passwords, JWT secrets, private credentials, or `.env` files to GitHub.**

## API Overview

The backend provides API groups for the following areas:

- **Health:** service health check
- **Authentication:** registration and login
- **Public information:** platform overview, public project information, leaderboard, scope breakdown, and climate data
- **Developer workflows:** project management, document uploads, submissions, and credit listings
- **Auditor workflows:** review queue, project review, and approval or rejection
- **Administrator workflows:** user management, platform statistics, and credit issuance
- **Buyer workflows:** footprint reports, purchases, portfolio holdings, retirement, and certificates

Example health check:

```text
GET https://verdiq-coiw.onrender.com/api/health
```

## Testing

The prototype has been checked through manual functional scenarios, including:

- Direct navigation to a deployed route and refreshing the page
- Rejection of invalid login credentials
- Buyer-side role navigation in the interface
- Successful calculation and display of a carbon-footprint result

These checks represent observed prototype behaviour, not a comprehensive security audit or automated performance evaluation. Backend authorization should be tested independently for a complete security assessment.

## Current Limitations and Future Work

Verdiq is a prototype and has several boundaries:

- The emission factors and demonstration project evidence are not independently certified.
- Real payment settlement is not implemented.
- Blockchain-based record immutability is not implemented.
- Automated scientific verification and integration with external carbon standards or registries are not implemented.
- The current prototype does not provide a secondary transfer or resale mechanism for unretired credits when an owner becomes inactive or discontinues operations.
- Uploaded documents use local filesystem storage in the current backend setup; a production deployment would need an appropriate durable storage strategy.

Potential future improvements include governed ownership transfer for unretired credits, external registry integration, stronger project verification, secure payment settlement, tamper-evident records where appropriate, and further testing of scalability, security, and usability.

## Why This Project

Verdiq explores the idea that carbon-footprint measurement should connect to accountable climate-related actions. By bringing reporting, project review, controlled issuance, marketplace activity, and retirement into one workflow, the prototype demonstrates a practical software approach to organising carbon-credit lifecycle records.

---

**Built as an academic project focused on sustainability, traceability, and role-governed carbon-credit management.**
