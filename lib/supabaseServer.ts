import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL')
}

if (SUPABASE_ANON_KEY && SUPABASE_SERVICE_ROLE_KEY === SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY appears to be the anon key. Set the service role key in SUPABASE_SERVICE_ROLE_KEY (do not expose it as NEXT_PUBLIC_*)')
}

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export default supabaseAdmin
