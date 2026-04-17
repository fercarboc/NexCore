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
  const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  // Client with user token — for auth verification only
  const userClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    global: { headers: { Authorization: authHeader } },
  })

  // Admin client — for DB writes, bypasses JWT RS256/HS256 mismatch
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

  const { contact_id, lead_id, to_email, subject, body, is_html } = await req.json()

  if (!to_email || !subject || !body) {
    return new Response(JSON.stringify({ error: 'to_email, subject and body are required' }), { status: 400, headers: corsHeaders })
  }

  // If is_html=true the body already contains proper HTML (e.g. from a template).
  // Otherwise treat it as plain text and convert newlines to <br>.
  const htmlBody: string = is_html ? body : body.replace(/\n/g, '<br>')

  const FROM_EMAIL = 'contacto@staynexapp.com'
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), { status: 500, headers: corsHeaders })
  }

  let providerId: string | null = null
  let emailStatus = 'sent'

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `StayNexApp <${FROM_EMAIL}>`,
        to: [to_email],
        subject,
        html: htmlBody,
      }),
    })

    const resendData = await resendRes.json()
    if (resendRes.ok && resendData.id) {
      providerId = resendData.id
    } else {
      emailStatus = 'failed'
      console.error('Resend error:', resendData)
    }
  } catch (e) {
    emailStatus = 'failed'
    console.error('Resend fetch error:', e)
  }

  // Record in DB regardless of send status
  const { data: emailRecord, error: dbError } = await supabase
    .from('crm_emails')
    .insert({
      contact_id,
      lead_id: lead_id ?? null,
      direction: 'outbound',
      subject,
      body: htmlBody,
      from_email: FROM_EMAIL,
      to_email,
      status: emailStatus,
      provider: 'resend',
      provider_id: providerId,
    })
    .select()
    .single()

  if (dbError) {
    return new Response(JSON.stringify({ error: dbError.message }), { status: 500, headers: corsHeaders })
  }

  return new Response(JSON.stringify({ success: true, status: emailStatus, email: emailRecord }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
