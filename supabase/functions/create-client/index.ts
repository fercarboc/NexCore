import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, corsResponse } from '../_shared/cors.ts'

interface CreateClientPayload {
  legal_name: string
  trade_name?: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  tax_id?: string
  plan_id: string
  billing_cycle: 'MONTHLY' | 'YEARLY'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return corsResponse()

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
  }

  const nexcore = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  const { data: { user }, error: authError } = await nexcore.auth.getUser()
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
  }

  const { data: staffProfile, error: staffError } = await nexcore
    .from('staff_profiles')
    .select('id, role, status')
    .eq('id', user.id)
    .eq('status', 'active')
    .single()

  if (staffError || !staffProfile) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders })
  }

  const payload: CreateClientPayload = await req.json()
  const { legal_name, trade_name, contact_name, contact_email, contact_phone, tax_id, plan_id, billing_cycle } = payload

  if (!legal_name || !contact_name || !contact_email || !plan_id || !billing_cycle) {
    return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), { status: 400, headers: corsHeaders })
  }

  const { data: plan, error: planError } = await nexcore
    .from('saas_plans')
    .select('*')
    .eq('id', plan_id)
    .single()

  if (planError || !plan) {
    return new Response(JSON.stringify({ error: 'Plan no encontrado' }), { status: 404, headers: corsHeaders })
  }

  const stripePriceId = billing_cycle === 'YEARLY'
    ? plan.stripe_price_id_yearly
    : plan.stripe_price_id_monthly

  if (!stripePriceId) {
    return new Response(JSON.stringify({ error: 'El plan no tiene precio Stripe configurado' }), { status: 400, headers: corsHeaders })
  }

  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')!
  let stripeCustomerId = ''
  let stripeSubscriptionId = ''
  let casaruralUserId = ''

  try {
    // 1. Crear Customer en Stripe
    const stripeCustomerRes = await fetch('https://api.stripe.com/v1/customers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: contact_email,
        name: trade_name || legal_name,
        'metadata[nexcore_plan]': plan.code,
        'metadata[contact_name]': contact_name,
      }),
    })
    const stripeCustomer = await stripeCustomerRes.json()
    if (stripeCustomer.error) throw new Error(`Stripe customer: ${stripeCustomer.error.message}`)
    stripeCustomerId = stripeCustomer.id

    // 2. Crear Subscription — send_invoice (B2B: arranca activa, factura 30 días)
    const stripeSubRes = await fetch('https://api.stripe.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        customer: stripeCustomerId,
        'items[0][price]': stripePriceId,
        'collection_method': 'send_invoice',
        'days_until_due': '30',
        'metadata[nexcore_plan]': plan.code,
        'metadata[billing_cycle]': billing_cycle,
      }),
    })
    const stripeSub = await stripeSubRes.json()
    console.log('Stripe sub response:', JSON.stringify({ id: stripeSub.id, status: stripeSub.status, period_start: stripeSub.current_period_start, period_end: stripeSub.current_period_end }))
    if (stripeSub.error) throw new Error(`Stripe subscription: ${stripeSub.error.message}`)
    stripeSubscriptionId = stripeSub.id

    // 3. Invitar usuario en casarural-v2 (magic link de bienvenida)
    const casaruralUrl = Deno.env.get('CASARURAL_URL')!
    const casaruralServiceKey = Deno.env.get('CASARURAL_SERVICE_ROLE_KEY')!
    const casaruralAdmin = createClient(casaruralUrl, casaruralServiceKey)

    const casaruralAppUrl = Deno.env.get('CASARURAL_APP_URL') ?? `https://clientes.staynexapp.com`

    const { data: inviteData, error: inviteError } = await casaruralAdmin.auth.admin.inviteUserByEmail(
      contact_email,
      {
        redirectTo: casaruralAppUrl,
        data: {
          full_name: contact_name,
          nexcore_client: true,
          plan_code: plan.code,
        },
      }
    )

    if (inviteError) {
      const msg = inviteError.message.toLowerCase()
      if (msg.includes('already been registered') || msg.includes('already registered') || msg.includes('user already exists')) {
        // El email ya existe en casarural-v2: recuperar el user_id existente
        const searchRes = await fetch(
          `${casaruralUrl}/auth/v1/admin/users?email=${encodeURIComponent(contact_email)}&per_page=1`,
          {
            headers: {
              'Authorization': `Bearer ${casaruralServiceKey}`,
              'apikey': casaruralServiceKey,
            },
          }
        )
        const searchData = await searchRes.json()
        const existingUser = searchData?.users?.[0]
        if (!existingUser?.id) throw new Error(`casarural-v2: usuario no encontrado para ${contact_email}`)
        casaruralUserId = existingUser.id
      } else {
        throw new Error(`casarural-v2 invite: ${inviteError.message}`)
      }
    } else {
      casaruralUserId = inviteData.user.id
    }

    // 3.5 Crear propiedad en casarural-v2
    const slug = (trade_name || legal_name)
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Math.random().toString(36).slice(2, 6)

    const { data: newProperty, error: propError } = await casaruralAdmin
      .from('properties')
      .insert({
        nombre: trade_name || legal_name,
        slug,
        email: contact_email,
        onboarding_done: false,
      })
      .select()
      .single()

    if (propError) throw new Error(`casarural-v2 property: ${propError.message}`)

    // 3.6 Vincular usuario a la propiedad
    const { error: puError } = await casaruralAdmin
      .from('property_users')
      .insert({ property_id: newProperty.id, user_id: casaruralUserId, rol: 'ADMIN' })

    if (puError) throw new Error(`casarural-v2 property_users: ${puError.message}`)

    const casaruralPropertyId = newProperty.id

    // 3.7 Registrar subdominio en custom_domains (rasilla-xxxx.staynexapp.com)
    const staynexDomain = Deno.env.get('STAYNEX_DOMAIN') ?? 'staynexapp.com'
    const subdominio = `${slug}.${staynexDomain}`

    await casaruralAdmin
      .from('custom_domains')
      .insert({
        property_id: casaruralPropertyId,
        domain: subdominio,
        verified: true,
        verificado: true,
        es_principal: true,
        ssl_activo: true,
        tipo: 'subdominio',
      })

    // 4. INSERT saas_clients
    const { data: newClient, error: clientError } = await nexcore
      .from('saas_clients')
      .insert({
        legal_name,
        trade_name: trade_name || null,
        contact_name,
        contact_email,
        contact_phone: contact_phone || null,
        tax_id: tax_id || null,
        status: 'ACTIVE',
        casarural_user_id: casaruralUserId,
        casarural_property_id: casaruralPropertyId,
      })
      .select()
      .single()

    if (clientError) throw new Error(`saas_clients insert: ${clientError.message}`)

    // 5. INSERT saas_subscriptions (fechas reales desde Stripe, con fallback)
    const nowSec = Math.floor(Date.now() / 1000)
    const subStart = new Date((stripeSub.current_period_start ?? nowSec) * 1000).toISOString()
    const subEnd = new Date((stripeSub.current_period_end ?? (nowSec + 30 * 24 * 3600)) * 1000).toISOString()

    const { error: subError } = await nexcore
      .from('saas_subscriptions')
      .insert({
        client_id: newClient.id,
        plan_id,
        status: 'ACTIVE',
        billing_cycle,
        saas_stripe_customer_id: stripeCustomerId,
        saas_stripe_subscription_id: stripeSubscriptionId,
        current_period_start: subStart,
        current_period_end: subEnd,
      })

    if (subError) throw new Error(`saas_subscriptions insert: ${subError.message}`)

    return new Response(JSON.stringify({
      success: true,
      client_id: newClient.id,
      casarural_user_id: casaruralUserId,
      casarural_property_id: casaruralPropertyId,
      subdominio,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      message: `Email de bienvenida enviado a ${contact_email}`,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('create-client error:', message, { stripeCustomerId, stripeSubscriptionId, casaruralUserId })
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
