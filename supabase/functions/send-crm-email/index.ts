import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, corsResponse } from '../_shared/cors.ts'

type SendCrmEmailPayload = {
  contact_id?: string | null
  lead_id?: string | null
  to_email?: string
  subject?: string
  body?: string
  is_html?: boolean
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return corsResponse()
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: 'Supabase environment variables are not fully configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Cliente para validar el JWT del usuario autenticado
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    })

    // Cliente admin para consultas/escrituras backend
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    })

    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser()

    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const { data: staffProfile, error: staffError } = await adminClient
      .from('staff_profiles')
      .select('id, role, status')
      .eq('id', user.id)
      .eq('status', 'active')
      .single()

    if (staffError || !staffProfile) {
      console.error('Staff profile error:', staffError)
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const payload = (await req.json()) as SendCrmEmailPayload

    const contact_id = payload.contact_id ?? null
    const lead_id = payload.lead_id ?? null
    const to_email = payload.to_email?.trim()
    const subject = payload.subject?.trim()
    const body = payload.body ?? ''
    const is_html = payload.is_html === true

    if (!to_email || !subject || !body.trim()) {
      return new Response(
        JSON.stringify({ error: 'to_email, subject and body are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const htmlBody = is_html ? body : body.replace(/\n/g, '<br>')

    const FROM_EMAIL = 'contacto@staynexapp.com'
    let providerId: string | null = null
    let emailStatus: 'sent' | 'failed' = 'sent'
    let providerError: unknown = null

    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
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

      if (resendRes.ok && resendData?.id) {
        providerId = resendData.id
      } else {
        emailStatus = 'failed'
        providerError = resendData
        console.error('Resend error:', resendData)
      }
    } catch (error) {
      emailStatus = 'failed'
      providerError = error
      console.error('Resend fetch error:', error)
    }

    const insertPayload = {
      contact_id,
      lead_id,
      direction: 'outbound',
      subject,
      body: htmlBody,
      from_email: FROM_EMAIL,
      to_email,
      status: emailStatus,
      provider: 'resend',
      provider_id: providerId,
    }

    const { data: emailRecord, error: dbError } = await adminClient
      .from('crm_emails')
      .insert(insertPayload)
      .select()
      .single()

    if (dbError) {
      console.error('DB insert error:', dbError)
      return new Response(
        JSON.stringify({ error: dbError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: emailStatus,
        email: emailRecord,
        provider_error: emailStatus === 'failed' ? providerError : null,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Unhandled send-crm-email error:', error)

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})