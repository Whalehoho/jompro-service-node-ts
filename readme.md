# 🔐 Removing Sensitive Files from Git History using `git filter-repo`

If you've accidentally committed sensitive files (e.g., `.env`, `server.cert`, `server.key`, or config files with secrets), you can permanently remove them from your Git history using `git filter-repo`.

---

## 📦 Prerequisites

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

## 🔁 Step-by-Step Guide

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

### ✅ Optional: Add `.env`, certs, and keys to `.gitignore`

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

## 🧼 Done!

