import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, corsResponse } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') return corsResponse()

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
  }

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
  const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  })

  const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })

  const { data: { user }, error: authError } = await userClient.auth.getUser()
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
  }

  const { data: staffProfile, error: staffError } = await adminClient
    .from('staff_profiles')
    .select('id, role, status')
    .eq('id', user.id)
    .eq('status', 'active')
    .single()

  if (staffError || !staffProfile) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders })
  }

  const { id, name, description, category, subject, body, thumbnail_url } = await req.json()

  if (!name?.trim() || !subject?.trim() || !body?.trim() || !category?.trim()) {
    return new Response(
      JSON.stringify({ error: 'name, subject, body and category are required' }),
      { status: 400, headers: corsHeaders }
    )
  }

  const validCategories = ['marketing', 'dossier', 'info', 'followup']
  if (!validCategories.includes(category)) {
    return new Response(
      JSON.stringify({ error: `category must be one of: ${validCategories.join(', ')}` }),
      { status: 400, headers: corsHeaders }
    )
  }

  const payload = {
    name: name.trim(),
    description: description?.trim() ?? null,
    category,
    subject: subject.trim(),
    body: body.trim(),
    thumbnail_url: thumbnail_url?.trim() ?? null,
    is_active: true,
  }

  let result
  if (id) {
    // Update existing
    const { data, error } = await adminClient
      .from('crm_email_templates')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
    }
    result = data
  } else {
    // Create new
    const { data, error } = await adminClient
      .from('crm_email_templates')
      .insert(payload)
      .select()
      .single()
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
    }
    result = data
  }

  return new Response(JSON.stringify({ success: true, template: result }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
