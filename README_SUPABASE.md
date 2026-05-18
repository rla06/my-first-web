# Supabase setup for this repo

Follow these steps to complete the B회차 과제 flow. Most commands are interactive and require your Supabase account.

1) Create Supabase project
  - Go to https://app.supabase.com and create a new project.

2) Login with Supabase CLI
  - Run:

```powershell
npx supabase login
```

3) Link repo and get API keys
  - From repo root:

```powershell
supabase link
supabase projects api-keys --project-ref <your-project-ref>
```

  - Copy keys and update `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

4) Apply migrations
  - We created `supabase/migrations/20260511000000_init_schema.sql` from `db/001_init.sql`.
  - Push them:

```powershell
.\scripts\push-migrations.ps1 -ProjectRef <your-project-ref>
```

5) Client/Server helpers
  - Client (browser/SSR) helper: `lib/supabase/client.ts` (already present).
  - Server helper (service role): `lib/supabase/serverClient.ts` (added).

6) Vercel
  - In your Vercel project settings, add the following environment variables for both Preview and Production:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY` (server-only; do not expose to client)

  - Then push to GitHub/Git remote and Vercel will deploy.

Security note: never commit `SUPABASE_SERVICE_ROLE_KEY` or real secrets to the repo.
