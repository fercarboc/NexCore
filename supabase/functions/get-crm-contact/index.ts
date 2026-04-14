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

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
  }

  const { data: staffProfile, error: staffError } = await supabase
    .from('staff_profiles')
    .select('id, role, status')
    .eq('id', user.id)
    .eq('status', 'active')
    .single()

  if (staffError || !staffProfile) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders })
  }

  const { contact_id } = await req.json()
  if (!contact_id) {
    return new Response(JSON.stringify({ error: 'contact_id required' }), { status: 400, headers: corsHeaders })
  }

  const [contactRes, leadsRes, emailsRes] = await Promise.all([
    supabase.from('crm_contacts').select('*').eq('id', contact_id).single(),
    supabase.from('crm_leads').select('*').eq('contact_id', contact_id).order('created_at', { ascending: false }),
    supabase.from('crm_emails').select('*').eq('contact_id', contact_id).order('created_at', { ascending: true }),
  ])

  if (contactRes.error || !contactRes.data) {
    return new Response(JSON.stringify({ error: 'Contact not found' }), { status: 404, headers: corsHeaders })
  }

  return new Response(JSON.stringify({
    ...contactRes.data,
    leads: leadsRes.data ?? [],
    emails: emailsRes.data ?? [],
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
