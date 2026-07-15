import { createClient } from '@supabase/supabase-js'

let _client: ReturnType<typeof createClient> | null = null

export function useSupabase() {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl as string
  const key = config.supabaseServiceKey as string

  if (!url || !key) {
    throw createError({
      statusCode: 500,
      message: 'Supabase URL and Service Role Key must be configured',
    })
  }

  if (!_client) {
    _client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }

  return _client
}
