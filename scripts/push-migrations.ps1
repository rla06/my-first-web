# Push local migrations to Supabase (PowerShell)
# Replace <project-ref> with your project ref if needed.

param(
  [string]$ProjectRef = ''
)

if ($ProjectRef -ne '') {
  supabase db push --project-ref $ProjectRef
} else {
  supabase db push
}
