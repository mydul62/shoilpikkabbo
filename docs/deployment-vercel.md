# Vercel Deployment & GitHub CI/CD Guide

This guide details how to deploy the **SHOILPIKKABBO** Next.js frontend to **Vercel** with automated **GitHub CI/CD**.

---

## Method 1: Vercel Native Git Integration (Recommended & Fastest)

Vercel provides native integration with GitHub that automatically builds and deploys every push to `main` and creates preview URLs for pull requests.

### Steps:
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** > **"Project"**.
3. Under **Import Git Repository**, select `shoilpikkabbo`.
4. In the **Configure Project** screen:
   - **Project Name:** `shoilpikkabbo` (or your preferred name)
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Click **Edit** and select **`frontend`**
   - **Build and Output Settings:** Leave defaults (`next build` / `.next`)
5. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-api-domain.com/api/v1` (or your deployed backend URL)
6. Click **Deploy**.

---

## Method 2: Automated Deployment via GitHub Actions

A full CI/CD pipeline is pre-configured in `.github/workflows/ci-cd.yml`.

### How it works:
1. On every `push` or `pull_request` to `main`:
   - Runs TypeScript validation (`tsc --noEmit`) for both Frontend & Backend.
   - Runs full Next.js production build (`npm run build`).
   - Runs Prisma generation (`prisma generate`).
2. On `push` to `main`:
   - Deploys the frontend automatically to Vercel production if Vercel secrets are provided.

### To enable automated deployment from GitHub Actions:
1. In your GitHub repository, go to **Settings** > **Secrets and variables** > **Actions**.
2. Add the following repository secrets:
   - `VERCEL_TOKEN`: Your Vercel Personal Access Token (Generate at [vercel.com/account/tokens](https://vercel.com/account/tokens)).
   - `VERCEL_ORG_ID`: Found in your Vercel project `.vercel/project.json` or team settings.
   - `VERCEL_PROJECT_ID`: Found in your Vercel project **Settings** > **General** > **Project ID**.
   - `NEXT_PUBLIC_API_URL` *(Optional)*: Production backend API URL.

---

## Monorepo Configuration (`vercel.json`)
The repository includes:
- `vercel.json` (at repo root) with Next.js monorepo build instructions.
- `frontend/vercel.json` (inside frontend directory) for direct root directory deployments.
