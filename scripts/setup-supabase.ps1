# Setup Supabase (PowerShell)
# 1) Logs into Supabase CLI (interactive)
# 2) Links this directory to a Supabase project (interactive)

npx supabase login

# Link this repo to your Supabase project (will ask to select project)
supabase link

Write-Host "Run 'supabase projects api-keys --project-ref <your-project-ref>' to retrieve keys."
Write-Host "Then update .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY."
