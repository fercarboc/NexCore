import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

async function verifyStripeSignature(body: string, signature: string, secret: string): Promise<boolean> {
  try {
    const parts = Object.fromEntries(signature.split(',').map(p => p.split('=')))
    const timestamp = parts['t']
    const expectedSig = parts['v1']
    if (!timestamp || !expectedSig) return false
    if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(`${timestamp}.${body}`))
    const computed = Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, '0')).join('')
    return computed === expectedSig
  } catch {
    return false
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured')
    return new Response('Webhook secret not configured', { status: 500 })
  }

  const rawBody = await req.text()
  const signature = req.headers.get('stripe-signature') ?? ''

  const valid = await verifyStripeSignature(rawBody, signature, webhookSecret)
  if (!valid) {
    console.error('Invalid Stripe signature')
    return new Response('Invalid signature', { status: 400 })
  }

  const event = JSON.parse(rawBody)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {
    switch (event.type) {

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object
        const status = mapStripeSubStatus(sub.status)
        await supabase
          .from('saas_subscriptions')
          .update({
            status,
            current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            cancel_at: sub.cancel_at ? new Date(sub.cancel_at * 1000).toISOString() : null,
            cancelled_at: sub.canceled_at ? new Date(sub.canceled_at * 1000).toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq('saas_stripe_subscription_id', sub.id)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object
        const { data: subscription } = await supabase
          .from('saas_subscriptions')
          .select('client_id')
          .eq('saas_stripe_subscription_id', sub.id)
          .single()

        await supabase
          .from('saas_subscriptions')
          .update({ status: 'CANCELLED', cancelled_at: new Date().toISOString(), updated_at: new Date().toISOString() })
          .eq('saas_stripe_subscription_id', sub.id)

        if (subscription?.client_id) {
          await supabase
            .from('saas_clients')
            .update({ status: 'CANCELLED', updated_at: new Date().toISOString() })
            .eq('id', subscription.client_id)
        }
        break
      }

      case 'invoice.created': {
        const inv = event.data.object
        if (!inv.subscription) break

        const { data: subscription } = await supabase
          .from('saas_subscriptions')
          .select('id, client_id')
          .eq('saas_stripe_subscription_id', inv.subscription)
          .single()

        if (!subscription) break

        await supabase
          .from('saas_invoices')
          .upsert({
            client_id: subscription.client_id,
            subscription_id: subscription.id,
            stripe_invoice_id: inv.id,
            amount_cents: inv.amount_due,
            currency: inv.currency,
            status: 'pending',
            period_start: inv.period_start ? new Date(inv.period_start * 1000).toISOString() : null,
            period_end: inv.period_end ? new Date(inv.period_end * 1000).toISOString() : null,
            due_date: inv.due_date ? new Date(inv.due_date * 1000).toISOString() : null,
          }, { onConflict: 'stripe_invoice_id' })
        break
      }

      case 'invoice.paid': {
        const inv = event.data.object

        await supabase
          .from('saas_invoices')
          .update({ status: 'paid', paid_at: new Date().toISOString(), amount_cents: inv.amount_paid })
          .eq('stripe_invoice_id', inv.id)

        if (inv.subscription) {
          const { data: subscription } = await supabase
            .from('saas_subscriptions')
            .select('client_id')
            .eq('saas_stripe_subscription_id', inv.subscription)
            .single()

          if (subscription?.client_id) {
            await supabase
              .from('saas_clients')
              .update({ status: 'ACTIVE', updated_at: new Date().toISOString() })
              .eq('id', subscription.client_id)
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const inv = event.data.object

        await supabase
          .from('saas_invoices')
          .update({ status: 'failed' })
          .eq('stripe_invoice_id', inv.id)

        if (inv.subscription) {
          await supabase
            .from('saas_subscriptions')
            .update({ status: 'PAST_DUE', updated_at: new Date().toISOString() })
            .eq('saas_stripe_subscription_id', inv.subscription)

          const { data: subscription } = await supabase
            .from('saas_subscriptions')
            .select('client_id')
            .eq('saas_stripe_subscription_id', inv.subscription)
            .single()

          if (subscription?.client_id) {
            await supabase
              .from('saas_clients')
              .update({ status: 'SUSPENDED', updated_at: new Date().toISOString() })
              .eq('id', subscription.client_id)
          }
        }
        break
      }

      default:
        break
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('stripe-webhook error:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})

function mapStripeSubStatus(stripeStatus: string): string {
  switch (stripeStatus) {
    case 'active':     return 'ACTIVE'
    case 'trialing':   return 'ACTIVE'
    case 'past_due':   return 'PAST_DUE'
    case 'canceled':   return 'CANCELLED'
    case 'unpaid':     return 'SUSPENDED'
    case 'incomplete': return 'ACTIVE'
    default:           return 'ACTIVE'
  }
}
