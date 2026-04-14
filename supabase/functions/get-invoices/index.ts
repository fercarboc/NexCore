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

  // Optional filter by client_id
  const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {}
  const clientId: string | undefined = body.client_id

  let query = supabase
    .from('saas_invoices')
    .select(`
      *,
      client:saas_clients(legal_name, trade_name),
      subscription:saas_subscriptions(
        plan:saas_plans(name)
      )
    `)
    .order('created_at', { ascending: false })

  if (clientId) {
    query = query.eq('client_id', clientId)
  }

  const { data, error } = await query

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
  }

  // Flatten client_name and plan_name for InvoiceWithClient shape
  const invoices = (data ?? []).map((inv: Record<string, unknown>) => {
    const client = inv.client as { legal_name: string; trade_name: string | null } | null
    const sub = inv.subscription as { plan: { name: string } | null } | null
    return {
      ...inv,
      client: undefined,
      subscription: undefined,
      client_name: client?.trade_name ?? client?.legal_name ?? null,
      plan_name: sub?.plan?.name ?? null,
    }
  })

  return new Response(JSON.stringify(invoices), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
