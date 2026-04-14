import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, corsResponse } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') return corsResponse()

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  // Verify staff session
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
  }

  // Verify staff profile and require super_admin role
  const { data: staffProfile, error: staffError } = await supabase
    .from('staff_profiles')
    .select('id, role, status')
    .eq('id', user.id)
    .eq('status', 'active')
    .single()

  if (staffError || !staffProfile) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders })
  }

  // Get all staff profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('staff_profiles')
    .select('*')
    .order('created_at', { ascending: true })

  if (profilesError) {
    return new Response(JSON.stringify({ error: profilesError.message }), { status: 500, headers: corsHeaders })
  }

  // Get auth.users data (email + last_sign_in_at) using service role admin client
  const adminClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: authUsers, error: authUsersError } = await adminClient.auth.admin.listUsers()

  const authMap: Record<string, { email: string; last_sign_in_at: string | null }> = {}
  if (!authUsersError && authUsers) {
    for (const u of authUsers.users) {
      authMap[u.id] = {
        email: u.email ?? '',
        last_sign_in_at: u.last_sign_in_at ?? null,
      }
    }
  }

  const result = profiles.map((p) => ({
    ...p,
    email: authMap[p.id]?.email ?? '',
    last_sign_in_at: authMap[p.id]?.last_sign_in_at ?? null,
  }))

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
