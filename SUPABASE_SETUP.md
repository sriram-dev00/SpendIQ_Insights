# SpendIQ — Supabase Authentication & PostgreSQL Integration Guide

This guide details the complete authentication system and database integration implemented for **SpendIQ Insights** using **Supabase Authentication** and **Supabase PostgreSQL** with **Row Level Security (RLS)**.

---

## 1. Architecture Overview

- **Authentication**: Managed via `@supabase/supabase-js` (email/password signup, email verification, session restoration, password reset, and secure sign-out).
- **Session Restoration & Route Protection**:
  - Initial session check displays a retro technical loading screen to prevent flash of protected content.
  - Public routes (`/login`, `/register`, `/forgot-password`, `/reset-password`) redirect authenticated users to `/`.
  - Protected routes (`/`, `/transactions`, `/analytics`, `/insights`, `/ai-assistant`, `/budgets`, `/goals`, `/money-growth`, `/settings`) redirect unauthenticated visitors to `/login`.
- **Database Isolation (RLS)**:
  - All financial tables (`transactions`, `budgets`, `goals`, `profiles`) are bound to `auth.users(id)` via `user_id` foreign keys.
  - Strict Row Level Security policies guarantee that users can **only SELECT, INSERT, UPDATE, and DELETE their own records**.
  - Database-level triggers automatically provision a profile in `public.profiles` whenever a new user confirms signup in `auth.users`.

---

## 2. Quick Setup Steps

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in or create an account.
2. Click **New Project**, choose a project name (e.g. `spendiq-insights`) and database password.

### Step 2: Run Database Migration
1. In your Supabase Dashboard, open the **SQL Editor** from the left navigation.
2. Open the file [`supabase/schema.sql`](./supabase/schema.sql) in this repository.
3. Copy and paste the entire script into the Supabase SQL Editor and click **Run**.
4. This will create:
   - `public.profiles` (linked to `auth.users`)
   - `public.transactions` (with `user_id`, indexes, constraints)
   - `public.budgets` (with `user_id`)
   - `public.goals` (with `user_id`)
   - Enables Row Level Security (RLS) on all 4 tables with granular policies.
   - Creates the `on_auth_user_created` trigger for automated profile creation.

### Step 3: Configure Environment Variables
1. In the Supabase Dashboard, navigate to **Project Settings** -> **API**.
2. Locate:
   - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - **Project API Keys** -> `anon` / `public` key
3. Copy `.env.example` to `.env` or edit `.env` in the root of `SpendIq_Insights`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Restart the development server (`npm run dev`) or build (`npm run build`).

---

## 3. Supported Authentication Workflows

| Workflow | Path | Features |
| :--- | :--- | :--- |
| **Login** | `#/login` | Email/Password, show/hide password, input validation, live error banners, Light/Dark theme switch, Demo mode fallback |
| **Register** | `#/register` | Full name, Email format check, password length (min 6), confirmation match check, email verification screen |
| **Forgot Password** | `#/forgot-password` | Dispatches cryptographic password recovery token to user's registered inbox |
| **Reset Password** | `#/reset-password` | Securely updates account credentials via `supabase.auth.updateUser` |
| **Sign Out** | Header / Sidebar / Settings | Clears cryptographic session token, wipes local cache, redirects to `#/login` |
| **Route Protection** | All 10 Modules | Full-screen retro technical security loader preventing content flashes; redirects unauthorized users to `#/login` |

---

## 4. Local Sandbox & Demo Mode

If Supabase keys have not yet been provided in `.env`:
- The application automatically flags **"Supabase Config Pending"** on the login page without crashing.
- Users can click **"Quick Test with Demo Account"** to access the entire application in sandboxed mode.
- Once `.env` is populated with live Supabase credentials, the app automatically switches to **Live Cloud Supabase Authentication**.
