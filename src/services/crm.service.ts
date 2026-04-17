import { supabase } from '@/src/lib/supabase'

export interface CrmContact {
  id: string
  name: string
  email: string
  phone: string | null
  business: string | null
  structure: string | null
  created_at: string
}

export interface CrmLead {
  id: string
  contact_id: string
  source: string
  request_type: string
  accommodations: string | null
  plan: string | null
  message: string | null
  status: string
  created_at: string
  contact?: CrmContact
}

export interface CrmEmail {
  id: string
  contact_id: string | null
  lead_id: string | null
  direction: string
  subject: string | null
  body: string | null
  from_email: string | null
  to_email: string | null
  status: string | null
  provider: string | null
  provider_id: string | null
  created_at: string
}

export interface CrmContactDetail extends CrmContact {
  leads: CrmLead[]
  emails: CrmEmail[]
}

export const getCrmLeads = async (): Promise<CrmLead[]> => {
  const { data, error } = await supabase.functions.invoke<CrmLead[]>('get-crm-leads')
  if (error) throw new Error(error.message)
  return data ?? []
}

export const getCrmContact = async (contact_id: string): Promise<CrmContactDetail> => {
  const { data, error } = await supabase.functions.invoke<CrmContactDetail>('get-crm-contact', {
    body: { contact_id },
  })
  if (error) throw new Error(error.message)
  return data!
}

export interface SendEmailPayload {
  contact_id?: string | null
  lead_id?: string | null
  to_email: string
  subject: string
  body: string
  /** true cuando body ya es HTML (p.ej. una plantilla). false para texto plano. */
  is_html?: boolean
}

export const sendCrmEmail = async (payload: SendEmailPayload): Promise<{ success: boolean; status: string }> => {
  const { data, error } = await supabase.functions.invoke<{ success: boolean; status: string }>('send-crm-email', {
    body: payload,
  })
  if (error) throw new Error(error.message)
  return data!
}

// ─── Email Templates ──────────────────────────────────────────────────────────

export type TemplateCategory = 'marketing' | 'dossier' | 'info' | 'followup'

export interface CrmEmailTemplate {
  id: string
  name: string
  description: string | null
  category: TemplateCategory
  subject: string
  body: string
  thumbnail_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SaveTemplatePayload {
  id?: string
  name: string
  description?: string | null
  category: TemplateCategory
  subject: string
  body: string
  thumbnail_url?: string | null
}

export const getCrmTemplates = async (): Promise<CrmEmailTemplate[]> => {
  const { data, error } = await supabase
    .from('crm_email_templates')
    .select('id, name, description, category, subject, body, thumbnail_url, is_active, created_at, updated_at')
    .eq('is_active', true)
    .order('created_at', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []) as CrmEmailTemplate[]
}

export const saveCrmTemplate = async (payload: SaveTemplatePayload): Promise<CrmEmailTemplate> => {
  const { data, error } = await supabase.functions.invoke<{ success: boolean; template: CrmEmailTemplate }>('save-crm-template', {
    body: payload,
  })
  if (error) throw new Error(error.message)
  return data!.template
}

export const deleteCrmTemplate = async (id: string): Promise<void> => {
  const { error } = await supabase.functions.invoke('delete-crm-template', {
    body: { id },
  })
  if (error) throw new Error(error.message)
}
