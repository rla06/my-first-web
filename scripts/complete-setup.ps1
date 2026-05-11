<#
Automates the remaining Supabase + Vercel setup steps locally.

Usage: run this from the repo root in PowerShell. It will:
 - prompt for your Supabase project ref and keys
 - write `.env.local` (kept in .gitignore)
 - link the repo to the Supabase project
 - push migrations
 - commit and push changes (excluding .env.local)
 - optionally run Vercel env setup interactively

Security: do not paste secrets into public channels. Run this script locally.
#>

Write-Host "Starting Supabase + Vercel completion script"

function Ensure-Command($cmd, $installHint) {
  $which = Get-Command $cmd -ErrorAction SilentlyContinue
  if (-not $which) {
    Write-Host "Command '$cmd' not found. $installHint"
    $resp = Read-Host "Do you want to continue without it? (y/N)"
    if ($resp -ne 'y') { throw "Required command missing: $cmd" }
  }
}

Ensure-Command -cmd 'supabase' -installHint "Install with 'npm install -g supabase' or use 'npx supabase'."
Ensure-Command -cmd 'git' -installHint "Install git."
Ensure-Command -cmd 'vercel' -installHint "Install with 'npm install -g vercel' or skip Vercel steps later."

$projectRef = Read-Host "Enter your Supabase project ref (e.g. mxpxqhq...)"
if (-not $projectRef) { throw "Project ref is required." }

$urlDefault = "https://$projectRef.supabase.co"
$supabaseUrl = Read-Host "Supabase URL (press Enter to use $urlDefault)"
if (-not $supabaseUrl) { $supabaseUrl = $urlDefault }

$anonKey = Read-Host "Enter NEXT_PUBLIC_SUPABASE_ANON_KEY"
$serviceKey = Read-Host "Enter SUPABASE_SERVICE_ROLE_KEY (server-only)"

Write-Host "About to write .env.local (will be kept out of git)."
"NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl`nNEXT_PUBLIC_SUPABASE_ANON_KEY=$anonKey`nSUPABASE_SERVICE_ROLE_KEY=$serviceKey" | Out-File -Encoding utf8 -FilePath .env.local
Write-Host ".env.local written"

Write-Host "Linking repo to Supabase project (non-interactive)..."
supabase link --project-ref $projectRef

Write-Host "Fetching API keys (display only)..."
supabase projects api-keys --project-ref $projectRef

Write-Host "Pushing migrations to Supabase..."
supabase db push --project-ref $projectRef

Write-Host "Staging migration and setup files for commit (excluding .env.local)..."
git add supabase/migrations/ supabase/ scripts/ lib/supabase server: | Out-Null 2>&1

# Add specific files
git add supabase/migrations/ README_SUPABASE.md lib/supabase/serverClient.ts scripts/*.ps1 .gitignore

$branch = Read-Host "Git branch to push to (default: main)"
if (-not $branch) { $branch = 'main' }

git commit -m "Add supabase migrations, server client and setup scripts" || Write-Host "No changes to commit"
git push origin $branch

Write-Host "Git push attempted. If you are not logged in or want to push to a different remote, run git push manually."

$doVercel = Read-Host "Do you want to add environment variables to Vercel via CLI now? (y/N)"
if ($doVercel -eq 'y') {
  Write-Host "Adding Vercel env vars (you must be logged into Vercel CLI)."
  vercel env add NEXT_PUBLIC_SUPABASE_URL production --value $supabaseUrl
  vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --value $anonKey
  vercel env add SUPABASE_SERVICE_ROLE_KEY production --value $serviceKey
  Write-Host "Vercel env add commands executed. Confirm in Vercel dashboard."
} else {
  Write-Host "Skipped Vercel env CLI step. You can add them manually in Vercel dashboard."
}

Write-Host "Done. Verify your Vercel deployment and Supabase dashboard for success."
