import type { SaaSClient, SaaSClientWithDetails, ClientActivity, ClientContact, ClientNote } from '../types/clients'

// IDs fijos para poder referenciar en otros mocks
export const MOCK_CLIENTS: SaaSClient[] = [
  {
    id: 'cli_92834',
    legal_name: 'Hotel Mirador del Valle S.L.',
    trade_name: 'Hotel Mirador del Valle',
    tax_id: 'B12345678',
    contact_name: 'Javier García',
    contact_email: 'admin@miradorvalle.com',
    contact_phone: '+34 600 111 222',
    status: 'ACTIVE',
    notes: null,
    casarural_user_id: null,
    casarural_property_id: null,
    created_at: '2025-11-12T10:00:00Z',
    updated_at: '2026-04-09T08:00:00Z',
  },
  {
    id: 'cli_12938',
    legal_name: 'Apartamentos Sol y Mar S.L.',
    trade_name: 'Sol y Mar',
    tax_id: 'B98765432',
    contact_name: 'Laura Pérez',
    contact_email: 'hola@solymar.es',
    contact_phone: '+34 611 222 333',
    status: 'ACTIVE',
    notes: null,
    casarural_user_id: null,
    casarural_property_id: null,
    created_at: '2026-01-05T09:00:00Z',
    updated_at: '2026-04-08T12:00:00Z',
  },
  {
    id: 'cli_77263',
    legal_name: 'Luxury Villas Group S.A.',
    trade_name: 'Luxury Villas',
    tax_id: 'A11111111',
    contact_name: 'Carlos Martínez',
    contact_email: 'ops@luxuryvillas.com',
    contact_phone: '+34 622 333 444',
    status: 'ACTIVE',
    notes: 'Cliente premium. Interesado en Debacu.',
    casarural_user_id: null,
    casarural_property_id: null,
    created_at: '2025-08-20T07:00:00Z',
    updated_at: '2026-04-09T11:30:00Z',
  },
  {
    id: 'cli_33451',
    legal_name: 'Hostal La Parada S.L.',
    trade_name: 'Hostal La Parada',
    tax_id: 'B55555555',
    contact_name: 'María Torres',
    contact_email: 'info@laparada.net',
    contact_phone: '+34 633 444 555',
    status: 'SUSPENDED',
    notes: 'Pago pendiente desde marzo.',
    casarural_user_id: null,
    casarural_property_id: null,
    created_at: '2026-02-14T11:00:00Z',
    updated_at: '2026-04-01T09:00:00Z',
  },
  {
    id: 'cli_88291',
    legal_name: 'Resort Mediterráneo S.A.',
    trade_name: 'Resort Mediterráneo',
    tax_id: 'A22222222',
    contact_name: 'Roberto Sanz',
    contact_email: 'management@resortmed.com',
    contact_phone: '+34 644 555 666',
    status: 'ACTIVE',
    notes: null,
    casarural_user_id: null,
    casarural_property_id: null,
    created_at: '2025-05-30T08:00:00Z',
    updated_at: '2026-04-09T10:00:00Z',
  },
]

export const MOCK_CLIENTS_WITH_DETAILS: SaaSClientWithDetails[] = MOCK_CLIENTS.map((client, i) => ({
  ...client,
  subscription: [
    { id: 'sub_1', client_id: client.id, plan_id: 'plan_pro', billing_cycle: 'MONTHLY', status: 'ACTIVE', saas_stripe_customer_id: 'cus_R8v2kL9', saas_stripe_subscription_id: 'sub_stripe_1', current_period_start: '2026-04-01T00:00:00Z', current_period_end: '2026-05-01T00:00:00Z', trial_ends_at: null, cancel_at: null, cancelled_at: null, created_at: client.created_at, updated_at: client.updated_at, plan: { id: 'plan_pro', code: 'PRO', name: 'Pro', monthly_price_cents: 7900, yearly_price_cents: 79000, setup_fee_cents: 0, max_properties: 3, max_units: 20, max_users: 5, max_domains: 2, debacu_enabled: false, crm_enabled: true, dynamic_pricing_enabled: true, advanced_reporting: false, multi_property_enabled: true, api_calls_per_day: 500, is_active: true, stripe_product_id: 'prod_UKKjzUW8weVWQV', stripe_price_id_monthly: 'price_1TLg4bAAlRf9Xpe8vTK7zz5y', stripe_price_id_yearly: 'price_1TLg4bAAlRf9Xpe87U9x2uIG', created_at: '2026-01-01T00:00:00Z' } },
    { id: 'sub_2', client_id: client.id, plan_id: 'plan_basic', billing_cycle: 'MONTHLY', status: 'ACTIVE', saas_stripe_customer_id: 'cus_M1x9pQ2', saas_stripe_subscription_id: 'sub_stripe_2', current_period_start: '2026-04-01T00:00:00Z', current_period_end: '2026-05-01T00:00:00Z', trial_ends_at: null, cancel_at: null, cancelled_at: null, created_at: client.created_at, updated_at: client.updated_at, plan: { id: 'plan_basic', code: 'BASIC', name: 'Basic', monthly_price_cents: 2900, yearly_price_cents: 29000, setup_fee_cents: 0, max_properties: 1, max_units: 5, max_users: 2, max_domains: 1, debacu_enabled: false, crm_enabled: true, dynamic_pricing_enabled: false, advanced_reporting: false, multi_property_enabled: false, api_calls_per_day: 100, is_active: true, stripe_product_id: 'prod_UKKjyK7azRzqtg', stripe_price_id_monthly: 'price_1TLg4aAAlRf9Xpe8djjRjSsg', stripe_price_id_yearly: 'price_1TLg4aAAlRf9Xpe8noHYRhTj', created_at: '2026-01-01T00:00:00Z' } },
    { id: 'sub_3', client_id: client.id, plan_id: 'plan_premium', billing_cycle: 'YEARLY', status: 'ACTIVE', saas_stripe_customer_id: 'cus_L5t3mZ8', saas_stripe_subscription_id: 'sub_stripe_3', current_period_start: '2026-01-01T00:00:00Z', current_period_end: '2027-01-01T00:00:00Z', trial_ends_at: null, cancel_at: null, cancelled_at: null, created_at: client.created_at, updated_at: client.updated_at, plan: { id: 'plan_premium', code: 'PREMIUM', name: 'Premium', monthly_price_cents: 14900, yearly_price_cents: 149000, setup_fee_cents: 0, max_properties: 8, max_units: 50, max_users: 10, max_domains: 5, debacu_enabled: true, crm_enabled: true, dynamic_pricing_enabled: true, advanced_reporting: true, multi_property_enabled: true, api_calls_per_day: 2000, is_active: true, stripe_product_id: 'prod_UKKjpgoS7CpCdU', stripe_price_id_monthly: 'price_1TLg4cAAlRf9Xpe8EeSbbZ8N', stripe_price_id_yearly: 'price_1TLg4cAAlRf9Xpe8mk6Tc575', created_at: '2026-01-01T00:00:00Z' } },
    { id: 'sub_4', client_id: client.id, plan_id: 'plan_basic', billing_cycle: 'MONTHLY', status: 'PAST_DUE', saas_stripe_customer_id: 'cus_P2w8nB4', saas_stripe_subscription_id: 'sub_stripe_4', current_period_start: '2026-03-01T00:00:00Z', current_period_end: '2026-04-01T00:00:00Z', trial_ends_at: null, cancel_at: null, cancelled_at: null, created_at: client.created_at, updated_at: client.updated_at, plan: { id: 'plan_basic', code: 'BASIC', name: 'Basic', monthly_price_cents: 2900, yearly_price_cents: 29000, setup_fee_cents: 0, max_properties: 1, max_units: 5, max_users: 2, max_domains: 1, debacu_enabled: false, crm_enabled: true, dynamic_pricing_enabled: false, advanced_reporting: false, multi_property_enabled: false, api_calls_per_day: 100, is_active: true, stripe_product_id: 'prod_UKKjyK7azRzqtg', stripe_price_id_monthly: 'price_1TLg4aAAlRf9Xpe8djjRjSsg', stripe_price_id_yearly: 'price_1TLg4aAAlRf9Xpe8noHYRhTj', created_at: '2026-01-01T00:00:00Z' } },
    { id: 'sub_5', client_id: client.id, plan_id: 'plan_enterprise', billing_cycle: 'YEARLY', status: 'ACTIVE', saas_stripe_customer_id: 'cus_E9q4vX1', saas_stripe_subscription_id: 'sub_stripe_5', current_period_start: '2026-01-01T00:00:00Z', current_period_end: '2027-01-01T00:00:00Z', trial_ends_at: null, cancel_at: null, cancelled_at: null, created_at: client.created_at, updated_at: client.updated_at, plan: { id: 'plan_enterprise', code: 'ENTERPRISE', name: 'Enterprise', monthly_price_cents: 29900, yearly_price_cents: 299000, setup_fee_cents: 50000, max_properties: 25, max_units: 200, max_users: 30, max_domains: 10, debacu_enabled: true, crm_enabled: true, dynamic_pricing_enabled: true, advanced_reporting: true, multi_property_enabled: true, api_calls_per_day: 10000, is_active: true, stripe_product_id: 'prod_UKKjcISjjqaLqY', stripe_price_id_monthly: 'price_1TLg4dAAlRf9Xpe8iimKRsdH', stripe_price_id_yearly: 'price_1TLg4dAAlRf9Xpe8SEOA3Qyd', created_at: '2026-01-01T00:00:00Z' } },
  ][i],
}))

export const MOCK_CLIENT_ACTIVITY: ClientActivity[] = [
  { id: 'act_1', type: 'login',   description: 'Inicio de sesión desde Madrid, ES',            timestamp: 'Hace 2 horas' },
  { id: 'act_2', type: 'billing', description: 'Factura INV-2026-001 pagada con éxito',         timestamp: 'Hace 8 horas' },
  { id: 'act_3', type: 'support', description: 'Ticket TIC-1024 abierto por el cliente',        timestamp: 'Hace 10 horas' },
  { id: 'act_4', type: 'config',  description: 'Nueva API Key generada para producción',         timestamp: 'Ayer, 18:45' },
  { id: 'act_5', type: 'usage',   description: 'Límite de propiedades aumentado a 5',            timestamp: '5 Abr 2026' },
]

export const MOCK_CLIENT_CONTACTS: ClientContact[] = [
  { id: 'con_1', name: 'Javier García', role: 'Director General',  email: 'j.garcia@miradorvalle.com', phone: '+34 600 000 001', primary: true },
  { id: 'con_2', name: 'Marta López',   role: 'Responsable IT',    email: 'm.lopez@miradorvalle.com',  phone: '+34 600 000 002', primary: false },
]

export const MOCK_CLIENT_NOTES: ClientNote[] = [
  { id: 'not_1', author: 'Fernando Admin', content: 'Interesados en migrar a plan Premium el próximo trimestre.', timestamp: '2 Abr 2026' },
  { id: 'not_2', author: 'Laura Soporte',  content: 'Problemas con integración Debacu resueltos tras actualizar SDK.', timestamp: '28 Mar 2026' },
]
