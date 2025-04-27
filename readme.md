# Project Architecture Overview

This backend project is built using **Node.js** with **TypeScript**, following a clean and modular architecture with multiple layers.

Each layer serves a clear responsibility, making the system **organized**, **scalable**, and **easy to maintain**.

---

# 1. **API Layer (Controller + Routing Layer)**

**Folder:** `src/api`

**Purpose:** This layer handles HTTP requests and responses. It acts as the _entry point_ for all client communication.

**Contents:**
- Subfolders like `auth`, `channel`, `event`, `region`, etc. — each contains controllers related to a specific resource/domain.
  - For example, `auth/controller.ts` would have authentication-related request handlers.
- `router.ts` — defines and connects the endpoints to controller methods.
- `middleware.ts` — contains middlewares (authentication check, validation, etc).
- `util.ts` — helper functions (success & failure) used within the API layer.
- `index.ts` — initializes ans starts the Express.js server,  responsible for setting up middlewares, routing, and server configuration.

---

# 2. **Service Layer (Business Logic Layer)**

**Folder:** `src/services`

**Purpose:** This layer handles the _business logic_ of your application. Controllers call services to process data, make decisions, or trigger complex operations.

**Contents:**
- `services/database`
  - Files like `channel.ts`, `event.ts`, `region.ts`, etc. — database-related services for each domain entity.
- Other service folders:
  - `event_recommender` — handles event recommendation logic.
  - `face_verifier` — facial verification logic.
  - `mail_sender` — email sending service.
  - `redis` — caching or session management services.
  - `socket` — WebSocket services (for real-time features like chats or notifications).
- `service.ts` — shared/general services not specific to a domain.

---

# 3. **Background Jobs / Workers Layer**

**Folder:** `src/jobs`

**Purpose:** Typically holds background tasks like:
- Scheduled jobs (e.g., cron jobs)
- Asynchronous workers (e.g., sending batch emails, cleaning data, etc.)

---

# 4. **Types / DTOs Layer**

**Folder:** `src/types`

**Purpose:**
- Defines **TypeScript types** or **Data Transfer Objects (DTOs)** used throughout the project.
- Provides **strong typing** for requests, responses, database objects, etc.

**Contents:**
- `auth.d.ts`, `channel.d.ts`, `event.d.ts`, etc. — type definitions for each domain module.
- `index.d.ts` — probably re-exports or combines all the types.

---

# 🔹 Summary of Layers

| Layer                     | Location                  | Purpose |
|:---------------------------|:---------------------------|:--------|
| API Layer                  | `src/api`                 | Handle HTTP requests and responses (Controllers, Routers, Middlewares) |
| Service Layer              | `src/services`            | Handle business logic and database operations |
| Background Jobs Layer      | `src/jobs`                | Handle scheduled or async background tasks |
| Types/DTO Layer            | `src/types`               | Centralized TypeScript type definitions |
| Utility Layer (Helpers)    | (scattered, e.g., `util.ts`) | Shared helper functions |

---
---

# Removing Sensitive Files from Git History using `git filter-repo`

If you've accidentally committed sensitive files (e.g., `.env`, `server.cert`, `server.key`, or config files with secrets), you can permanently remove them from your Git history using `git filter-repo`.

---

## Prerequisites

### Install `git-filter-repo`

- **macOS**:
  ```bash
  brew install git-filter-repo
  ```

- **Linux (Debian/Ubuntu)**:
  ```bash
  sudo apt install git-filter-repo
  ```

- **Using pip**:
  ```bash
  pip install git-filter-repo
  ```

> ⚠️ `git filter-repo` is not bundled with Git. It replaces the older `git filter-branch`.

---

## Step-by-Step Guide

### 1. Backup Your Repository (Optional but Recommended)

```bash
cp -r your-repo your-repo-backup
```

---

### 2. Navigate to Your Project Directory

```bash
cd your-repo
```

---

### 3. Run `git filter-repo` to Remove Files from History

```bash
git filter-repo --path .env --path server.cert --path server.key --path config/default.js --invert-paths
```

- `--invert-paths` tells Git to remove these files from **all commits**.
- Add or remove paths as needed.

---

### 4. Reconnect to Remote (if not already)

Check current remotes:

```bash
git remote -v
```

If none, add one:

```bash
git remote add origin https://github.com/your-username/your-repo.git
```

or with SSH:

```bash
git remote add origin git@github.com:your-username/your-repo.git
```

---

### 5. Force Push to Overwrite History

```bash
git push origin --force --all
git push origin --force --tags
```

---

### 6. Notify Collaborators

> 🚨 All collaborators will need to re-clone the repository:

```bash
git clone https://github.com/your-username/your-repo.git
```

---

### Optional: Add `.env`, certs, and keys to `.gitignore`

```gitignore
.env
server.cert
server.key
```

Then commit:

```bash
git add .gitignore
git commit -m "Ignore environment and key files"
git push origin main
```

---

## Done!

