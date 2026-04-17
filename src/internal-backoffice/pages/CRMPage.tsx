import { useState } from 'react';
import {
  Search,
  Mail,
  Phone,
  Building2,
  User,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Circle,
  ChevronRight,
  Inbox,
  Send,
  AlertCircle,
  Users,
  Loader2,
  LayoutTemplate,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  ChevronDown,
  ChevronUp,
  Tag,
} from 'lucide-react';
import { SectionHeader, Badge } from '../components/UI';
import { useCrmLeads } from '@/src/hooks/useCrmLeads';
import { useCrmContact } from '@/src/hooks/useCrmContact';
import { useCrmTemplates } from '@/src/hooks/useCrmTemplates';
import { sendCrmEmail, saveCrmTemplate, deleteCrmTemplate } from '@/src/services/crm.service';
import type { CrmLead, CrmEmailTemplate, SaveTemplatePayload, TemplateCategory } from '@/src/services/crm.service';

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_PIPELINE = ['new', 'contacted', 'demo', 'client'] as const

const statusConfig: Record<string, { label: string; variant: string; dot: string }> = {
  new:       { label: 'Nuevo',      variant: 'sky',     dot: 'bg-sky-400' },
  contacted: { label: 'Contactado', variant: 'amber',   dot: 'bg-amber-400' },
  demo:      { label: 'Demo',       variant: 'indigo',  dot: 'bg-indigo-500' },
  client:    { label: 'Cliente',    variant: 'emerald', dot: 'bg-emerald-500' },
}

const requestTypeLabel: Record<string, string> = {
  contacto: 'Contacto',
  demo:     'Demo',
  info:     'Información',
}

const CATEGORIES: { value: TemplateCategory; label: string; color: string }[] = [
  { value: 'marketing', label: 'Marketing',  color: 'bg-violet-100 text-violet-700' },
  { value: 'dossier',   label: 'Dossier',    color: 'bg-blue-100 text-blue-700' },
  { value: 'info',      label: 'Información',color: 'bg-cyan-100 text-cyan-700' },
  { value: 'followup',  label: 'Seguimiento',color: 'bg-amber-100 text-amber-700' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const initials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

const relativeDate = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `Hace ${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `Hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `Hace ${days}d`
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

const categoryBadge = (cat: TemplateCategory) => {
  const c = CATEGORIES.find(x => x.value === cat)
  return c ? (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${c.color}`}>
      <Tag className="w-2.5 h-2.5" />{c.label}
    </span>
  ) : null
}

// ─── Lead card ───────────────────────────────────────────────────────────────

const LeadCard = ({
  lead,
  selected,
  onClick,
}: {
  lead: CrmLead
  selected: boolean
  onClick: () => void
}) => {
  const sc = statusConfig[lead.status] ?? statusConfig['new']
  const contactName = lead.contact?.name ?? '—'
  const business = lead.contact?.business

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 border-b border-slate-50 text-left transition-colors relative hover:bg-slate-50 ${selected ? 'bg-indigo-50/60 border-l-2 border-l-indigo-500' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${selected ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
          {initials(contactName)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-xs font-bold text-slate-900 truncate">{contactName}</p>
            <span className="text-[10px] text-slate-400 font-medium ml-2 flex-shrink-0">{relativeDate(lead.created_at)}</span>
          </div>
          {business && (
            <p className="text-[10px] text-slate-500 font-medium truncate mb-1">{business}</p>
          )}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className={`w-1.5 h-1.5 rounded-full ${sc.dot} flex-shrink-0`} />
            <span className="text-[10px] font-bold text-slate-600">{sc.label}</span>
            <span className="text-slate-200">·</span>
            <span className="text-[10px] text-slate-400">{requestTypeLabel[lead.request_type] ?? lead.request_type}</span>
          </div>
          {lead.message && (
            <p className="text-[10px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{lead.message}</p>
          )}
        </div>
      </div>
    </button>
  )
}

// ─── Pipeline stepper ────────────────────────────────────────────────────────

const PipelineStepper = ({ currentStatus }: { currentStatus: string }) => {
  const currentIdx = STATUS_PIPELINE.indexOf(currentStatus as typeof STATUS_PIPELINE[number])

  return (
    <div className="flex items-center gap-0">
      {STATUS_PIPELINE.map((step, idx) => {
        const sc = statusConfig[step]
        const done = idx < currentIdx
        const active = idx === currentIdx

        return (
          <div key={step} className="flex items-center">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
              active ? 'bg-indigo-600 text-white' :
              done   ? 'bg-emerald-100 text-emerald-700' :
                       'bg-slate-100 text-slate-400'
            }`}>
              {done ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
              {sc.label}
            </div>
            {idx < STATUS_PIPELINE.length - 1 && (
              <ChevronRight className="w-3 h-3 text-slate-300 mx-0.5" />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Email thread item ────────────────────────────────────────────────────────

const EmailItem = ({ email }: { email: { direction: string; subject: string | null; from_email: string | null; to_email: string | null; status: string | null; created_at: string; body: string | null } }) => {
  const [expanded, setExpanded] = useState(false)
  const isOut = email.direction === 'outbound'
  const statusOk = email.status === 'sent' || email.status === 'delivered'

  return (
    <div className={`rounded-2xl border overflow-hidden ${isOut ? 'border-slate-100 bg-slate-50/50' : 'border-indigo-100 bg-indigo-50/30'}`}>
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full p-4 flex items-start gap-3 text-left"
      >
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isOut ? 'bg-white border border-slate-100 text-slate-400' : 'bg-indigo-100 text-indigo-600'}`}>
          {isOut ? <Send className="w-3.5 h-3.5" /> : <Inbox className="w-3.5 h-3.5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold text-slate-900 truncate">{email.subject ?? '(sin asunto)'}</p>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {statusOk
                ? <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                : <AlertCircle className="w-3 h-3 text-rose-400" />
              }
              <span className="text-[10px] text-slate-400">{relativeDate(email.created_at)}</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {isOut ? `De: ${email.from_email}` : `De: ${email.from_email}`} → {email.to_email}
          </p>
        </div>
      </button>
      {expanded && email.body && (
        <div
          className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100/80 pt-3"
          dangerouslySetInnerHTML={{ __html: email.body }}
        />
      )}
    </div>
  )
}

// ─── Template picker (inline collapsible) ────────────────────────────────────

const TemplatePicker = ({
  templates,
  onSelect,
}: {
  templates: CrmEmailTemplate[]
  onSelect: (t: CrmEmailTemplate) => void
}) => {
  const [open, setOpen] = useState(false)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [catFilter, setCatFilter] = useState<TemplateCategory | 'all'>('all')

  const filtered = catFilter === 'all' ? templates : templates.filter(t => t.category === catFilter)

  return (
    <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/30 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
          <LayoutTemplate className="w-3.5 h-3.5" />
          Usar plantilla
          {templates.length > 0 && (
            <span className="text-[10px] font-medium text-indigo-500">({templates.length} disponibles)</span>
          )}
        </div>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-indigo-400" /> : <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />}
      </button>

      {open && (
        <div className="border-t border-indigo-100 p-3 space-y-3">
          {/* Category filter */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setCatFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${catFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              Todas
            </button>
            {CATEGORIES.map(c => (
              <button
                key={c.value}
                onClick={() => setCatFilter(c.value)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${catFilter === c.value ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Template cards */}
          {filtered.length === 0 ? (
            <p className="text-[11px] text-slate-400 text-center py-3">No hay plantillas en esta categoría</p>
          ) : (
            <div className="space-y-2">
              {filtered.map(t => (
                <div key={t.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                  <div className="p-3 flex items-start gap-3">
                    {/* Thumbnail or placeholder */}
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-100 to-violet-100 flex-shrink-0 flex items-center justify-center">
                      {t.thumbnail_url ? (
                        <img src={t.thumbnail_url} alt={t.name} className="w-full h-full object-cover" />
                      ) : (
                        <LayoutTemplate className="w-5 h-5 text-indigo-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-xs font-bold text-slate-900 leading-tight">{t.name}</p>
                        {categoryBadge(t.category)}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{t.subject}</p>
                      {t.description && (
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{t.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-slate-50 px-3 py-2 flex items-center gap-2 bg-slate-50/50">
                    <button
                      onClick={() => setPreviewId(previewId === t.id ? null : t.id)}
                      className="flex items-center gap-1 text-[10px] font-medium text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      {previewId === t.id
                        ? <><EyeOff className="w-3 h-3" /> Ocultar preview</>
                        : <><Eye className="w-3 h-3" /> Vista previa</>
                      }
                    </button>
                    <div className="flex-1" />
                    <button
                      onClick={() => { onSelect(t); setOpen(false) }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700 transition-colors"
                    >
                      <LayoutTemplate className="w-3 h-3" />
                      Usar esta
                    </button>
                  </div>
                  {previewId === t.id && (
                    <div
                      className="border-t border-slate-100 max-h-64 overflow-y-auto p-3 text-xs bg-white"
                      dangerouslySetInnerHTML={{ __html: t.body }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Template form modal ──────────────────────────────────────────────────────

type TemplateFormState = {
  name: string
  description: string
  category: TemplateCategory
  subject: string
  body: string
  thumbnail_url: string
}

const EMPTY_FORM: TemplateFormState = {
  name: '',
  description: '',
  category: 'marketing',
  subject: '',
  body: '',
  thumbnail_url: '',
}

const TemplateModal = ({
  initial,
  onClose,
  onSaved,
}: {
  initial: CrmEmailTemplate | null
  onClose: () => void
  onSaved: () => void
}) => {
  const [form, setForm] = useState<TemplateFormState>(
    initial
      ? { name: initial.name, description: initial.description ?? '', category: initial.category, subject: initial.subject, body: initial.body, thumbnail_url: initial.thumbnail_url ?? '' }
      : EMPTY_FORM
  )
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const set = (key: keyof TemplateFormState, val: string) =>
    setForm(f => ({ ...f, [key]: val }))

  const handleSave = async () => {
    if (!form.name.trim() || !form.subject.trim() || !form.body.trim()) return
    setSaving(true)
    setSaveError(null)
    try {
      const payload: SaveTemplatePayload = {
        id: initial?.id,
        name: form.name,
        description: form.description || null,
        category: form.category,
        subject: form.subject,
        body: form.body,
        thumbnail_url: form.thumbnail_url || null,
      }
      await saveCrmTemplate(payload)
      onSaved()
      onClose()
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-black text-slate-900">
            {initial ? 'Editar plantilla' : 'Nueva plantilla'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreview(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-colors ${preview ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              <Eye className="w-3 h-3" />
              {preview ? 'Editando' : 'Vista previa'}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {preview ? (
            <div
              className="rounded-xl border border-slate-100 overflow-hidden min-h-48"
              dangerouslySetInnerHTML={{ __html: form.body || '<p class="text-slate-400 text-xs p-4">Sin contenido aún…</p>' }}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nombre de la plantilla *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Ej: Dossier de presentación"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/10"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Categoría *</label>
                  <select
                    value={form.category}
                    onChange={e => set('category', e.target.value as TemplateCategory)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/10"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Thumbnail URL */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">URL imagen preview</label>
                  <input
                    type="url"
                    value={form.thumbnail_url}
                    onChange={e => set('thumbnail_url', e.target.value)}
                    placeholder="https://…"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/10"
                  />
                </div>

                {/* Description */}
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Descripción</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    placeholder="Para qué sirve esta plantilla…"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/10"
                  />
                </div>

                {/* Subject */}
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Asunto del email *</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => set('subject', e.target.value)}
                    placeholder="Asunto que recibirá el destinatario…"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/10"
                  />
                </div>

                {/* Body HTML */}
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Cuerpo HTML *
                    <span className="ml-2 normal-case font-medium text-slate-400">Usa {"{{nombre}}"} como variable del contacto</span>
                  </label>
                  <textarea
                    value={form.body}
                    onChange={e => set('body', e.target.value)}
                    placeholder="<!DOCTYPE html>&#10;<html>&#10;  <body>&#10;    …&#10;  </body>&#10;</html>"
                    rows={14}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600/10 resize-none"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal footer */}
        <div className="border-t border-slate-100 px-6 py-4 flex items-center gap-3">
          {saveError && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium flex-1">
              <AlertCircle className="w-3.5 h-3.5" />{saveError}
            </div>
          )}
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.name.trim() || !form.subject.trim() || !form.body.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
            {saving ? 'Guardando…' : initial ? 'Guardar cambios' : 'Crear plantilla'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Send template modal ─────────────────────────────────────────────────────

const SendTemplateModal = ({
  template,
  onClose,
}: {
  template: CrmEmailTemplate
  onClose: () => void
}) => {
  const [toName, setToName] = useState('')
  const [toEmail, setToEmail] = useState('')
  const [subject, setSubject] = useState(template.subject)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)

  const resolvedBody = template.body.replace(/\{\{nombre\}\}/g, toName || 'Cliente')

  const handleSend = async () => {
    if (!toEmail.trim() || !subject.trim()) return
    setSending(true)
    setResult(null)
    try {
      const res = await sendCrmEmail({
        to_email: toEmail.trim(),
        subject: subject.trim(),
        body: resolvedBody,
        is_html: true,
      })
      if (res.status === 'sent') {
        setResult({ ok: true, msg: 'Email enviado correctamente.' })
      } else {
        setResult({ ok: false, msg: 'El email se registró pero falló el envío.' })
      }
    } catch (e: unknown) {
      setResult({ ok: false, msg: e instanceof Error ? e.message : 'Error desconocido' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-black text-slate-900">Enviar plantilla</h2>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-xs">{template.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nombre destinatario</label>
              <input
                type="text"
                value={toName}
                onChange={e => setToName(e.target.value)}
                placeholder="Ej: María García"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email destinatario *</label>
              <input
                type="email"
                value={toEmail}
                onChange={e => setToEmail(e.target.value)}
                placeholder="correo@empresa.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/10"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Asunto *</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/10"
            />
          </div>

          {/* Preview */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Vista previa
              {toName && <span className="ml-1 normal-case font-normal text-indigo-500">(con nombre aplicado)</span>}
            </label>
            <div
              className="rounded-xl border border-slate-100 max-h-48 overflow-y-auto p-3 text-xs pointer-events-none"
              dangerouslySetInnerHTML={{ __html: resolvedBody }}
            />
          </div>

          {result && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${result.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
              {result.ok ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />}
              {result.msg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {result?.ok ? 'Cerrar' : 'Cancelar'}
          </button>
          {!result?.ok && (
            <button
              onClick={handleSend}
              disabled={sending || !toEmail.trim() || !subject.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              {sending ? 'Enviando…' : 'Enviar email'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Template manager view ───────────────────────────────────────────────────

const TemplateManager = ({
  templates,
  loading,
  onRefetch,
}: {
  templates: CrmEmailTemplate[]
  loading: boolean
  onRefetch: () => void
}) => {
  const [editing, setEditing] = useState<CrmEmailTemplate | null | 'new'>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [sending, setSending] = useState<CrmEmailTemplate | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteCrmTemplate(id)
      onRefetch()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900">Plantillas de email</h3>
          <p className="text-xs text-slate-400 mt-0.5">Gestiona los templates HTML para enviar a clientes potenciales.</p>
        </div>
        <button
          onClick={() => setEditing('new')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-3.5 h-3.5" />
          Nueva plantilla
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-center border-2 border-dashed border-slate-200 rounded-2xl">
          <LayoutTemplate className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm font-bold text-slate-700">Sin plantillas</p>
          <p className="text-xs mt-1">Crea tu primera plantilla para enviar dossiers y marketing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {templates.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {/* Thumbnail */}
              <div className="h-28 bg-gradient-to-br from-indigo-50 to-violet-50 overflow-hidden relative">
                {t.thumbnail_url ? (
                  <img src={t.thumbnail_url} alt={t.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <LayoutTemplate className="w-10 h-10 text-indigo-200" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {categoryBadge(t.category)}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h4 className="text-sm font-bold text-slate-900 mb-0.5">{t.name}</h4>
                <p className="text-[10px] text-slate-500 font-medium mb-1.5 truncate">📬 {t.subject}</p>
                {t.description && (
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{t.description}</p>
                )}
              </div>

              {/* Actions */}
              <div className="border-t border-slate-100 px-4 py-3 flex items-center gap-2 bg-slate-50/50">
                <button
                  onClick={() => setPreviewId(previewId === t.id ? null : t.id)}
                  className="flex items-center gap-1 text-[10px] font-medium text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {previewId === t.id ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {previewId === t.id ? 'Ocultar' : 'Preview'}
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => setSending(t)}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20"
                >
                  <Send className="w-3 h-3" />
                  Enviar
                </button>
                <button
                  onClick={() => setEditing(t)}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={deletingId === t.id}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-rose-100 rounded-lg text-[10px] font-bold text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50"
                >
                  {deletingId === t.id
                    ? <Loader2 className="w-3 h-3 animate-spin" />
                    : <Trash2 className="w-3 h-3" />
                  }
                  Eliminar
                </button>
              </div>

              {/* Preview expand */}
              {previewId === t.id && (
                <div
                  className="border-t border-slate-100 max-h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: t.body }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create modal */}
      {editing !== null && (
        <TemplateModal
          initial={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={onRefetch}
        />
      )}

      {/* Send modal */}
      {sending !== null && (
        <SendTemplateModal
          template={sending}
          onClose={() => setSending(null)}
        />
      )}
    </div>
  )
}

// ─── Main CRM Page ────────────────────────────────────────────────────────────

export const CRMPage = () => {
  const { leads, loading } = useCrmLeads()
  const { templates, loading: loadingTemplates, refetch: refetchTemplates } = useCrmTemplates()

  const [view, setView] = useState<'leads' | 'templates'>('leads')
  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const contactId = selectedLead?.contact_id ?? null
  const { contact, loading: loadingContact, refetch: refetchContact } = useCrmContact(contactId)

  // Reply form state
  const [replySubject, setReplySubject] = useState('')
  const [replyBody, setReplyBody] = useState('')
  const [replyIsHtml, setReplyIsHtml] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ ok: boolean; msg: string } | null>(null)

  const handlePickTemplate = (t: CrmEmailTemplate) => {
    setReplySubject(t.subject)
    setReplyBody(t.body)
    setReplyIsHtml(true)
    setSendResult(null)
  }

  const handleSendEmail = async () => {
    if (!contact || !replySubject.trim() || !replyBody.trim()) return
    setSending(true)
    setSendResult(null)
    try {
      const result = await sendCrmEmail({
        contact_id: contact.id,
        lead_id: selectedLead?.id ?? null,
        to_email: contact.email,
        subject: replySubject.trim(),
        body: replyBody.trim(),
        is_html: replyIsHtml,
      })
      if (result.status === 'sent') {
        setSendResult({ ok: true, msg: 'Email enviado correctamente.' })
        setReplySubject('')
        setReplyBody('')
        setReplyIsHtml(false)
        refetchContact()
      } else {
        setSendResult({ ok: false, msg: 'El email se registró pero falló el envío (revisa RESEND_API_KEY).' })
        refetchContact()
      }
    } catch (e: unknown) {
      setSendResult({ ok: false, msg: e instanceof Error ? e.message : 'Error desconocido' })
    } finally {
      setSending(false)
    }
  }

  const filtered = leads.filter(l => {
    const matchStatus = statusFilter === 'all' || l.status === statusFilter
    const name = l.contact?.name ?? ''
    const biz = l.contact?.business ?? ''
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || biz.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const counts = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <SectionHeader
        title="CRM"
        description="Gestiona leads, contactos y comunicaciones recibidas desde staynexapp.com."
        actions={
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center gap-0.5 bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setView('leads')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${view === 'leads' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Users className="w-3 h-3" />
                Leads
              </button>
              <button
                onClick={() => setView('templates')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${view === 'templates' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <LayoutTemplate className="w-3 h-3" />
                Plantillas
                {templates.length > 0 && (
                  <span className="bg-indigo-100 text-indigo-700 px-1.5 rounded-full">{templates.length}</span>
                )}
              </button>
            </div>

            {view === 'leads' && (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 border border-sky-100 rounded-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span className="text-[10px] font-bold text-sky-700">{counts['new'] ?? 0} nuevos</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-600">{leads.length} leads totales</span>
                </div>
              </>
            )}
          </div>
        }
      />

      {view === 'templates' ? (
        /* ── Templates view ── */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col" style={{ minHeight: 'calc(100vh - 14rem)' }}>
          <TemplateManager
            templates={templates}
            loading={loadingTemplates}
            onRefetch={refetchTemplates}
          />
        </div>
      ) : (
        /* ── Leads view ── */
        <div className="h-[calc(100vh-14rem)] flex gap-6">
          {/* Left panel: Lead list */}
          <div className="w-80 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-shrink-0">
            {/* Search */}
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar contacto o empresa..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600/10 font-medium"
                />
              </div>
            </div>

            {/* Status filters */}
            <div className="p-2 border-b border-slate-100 flex flex-wrap gap-1">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${statusFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                Todos ({leads.length})
              </button>
              {STATUS_PIPELINE.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${statusFilter === s ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  {statusConfig[s].label} {counts[s] ? `(${counts[s]})` : ''}
                </button>
              ))}
            </div>

            {/* Lead list */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-6 h-6 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-slate-400 p-4 text-center">
                  <Circle className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-xs font-medium">Sin leads en este filtro</p>
                </div>
              ) : (
                filtered.map(lead => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    selected={selectedLead?.id === lead.id}
                    onClick={() => setSelectedLead(lead)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right panel: Contact detail */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            {selectedLead && selectedLead.contact ? (
              <>
                {/* Contact header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/40">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 flex-shrink-0">
                        {initials(selectedLead.contact.name)}
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900">{selectedLead.contact.name}</h2>
                        {selectedLead.contact.business && (
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                            <Building2 className="w-3 h-3" /> {selectedLead.contact.business}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          {selectedLead.contact.email && (
                            <a href={`mailto:${selectedLead.contact.email}`} className="text-[11px] text-indigo-600 font-medium flex items-center gap-1 hover:underline">
                              <Mail className="w-3 h-3" /> {selectedLead.contact.email}
                            </a>
                          )}
                          {selectedLead.contact.phone && (
                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {selectedLead.contact.phone}
                            </span>
                          )}
                          {selectedLead.contact.structure && (
                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                              <User className="w-3 h-3" /> {selectedLead.contact.structure}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex-shrink-0">
                      <ArrowUpRight className="w-3 h-3" /> Convertir en cliente
                    </button>
                  </div>

                  {/* Pipeline */}
                  <div className="mt-4">
                    <PipelineStepper currentStatus={selectedLead.status} />
                  </div>
                </div>

                {/* Detail body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {loadingContact ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="w-6 h-6 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                  ) : contact ? (
                    <>
                      {/* All leads from this contact */}
                      {contact.leads.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Solicitudes ({contact.leads.length})
                          </h3>
                          <div className="space-y-2">
                            {contact.leads.map(lead => {
                              const sc = statusConfig[lead.status] ?? statusConfig['new']
                              return (
                                <div key={lead.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                      <span className="text-xs font-bold text-slate-700">
                                        {requestTypeLabel[lead.request_type] ?? lead.request_type}
                                      </span>
                                      {lead.plan && (
                                        <Badge variant="indigo">{lead.plan}</Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                      <Clock className="w-3 h-3" />
                                      {new Date(lead.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </div>
                                  </div>
                                  {lead.message && (
                                    <p className="text-xs text-slate-600 leading-relaxed">{lead.message}</p>
                                  )}
                                  {(lead.accommodations) && (
                                    <p className="text-[10px] text-slate-400">Alojamientos: {lead.accommodations}</p>
                                  )}
                                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                    <span className="font-medium">Fuente:</span> {lead.source}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Email thread */}
                      <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Emails ({contact.emails.length})
                        </h3>
                        {contact.emails.length === 0 ? (
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs text-slate-400">
                            Sin emails registrados
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {contact.emails.map(email => (
                              <EmailItem key={email.id} email={email} />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Compose email */}
                      <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enviar email</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                            <span>Para:</span>
                            <span className="text-indigo-600 font-bold">{contact.email}</span>
                          </div>

                          {/* Template picker */}
                          <TemplatePicker
                            templates={templates}
                            onSelect={handlePickTemplate}
                          />

                          {/* Subject + body */}
                          <input
                            type="text"
                            value={replySubject}
                            onChange={e => { setReplySubject(e.target.value); setReplyIsHtml(false) }}
                            placeholder="Asunto..."
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/10"
                          />

                          {/* Body: preview if HTML template, textarea otherwise */}
                          {replyIsHtml && replyBody ? (
                            <div className="rounded-xl border border-indigo-100 bg-indigo-50/20 overflow-hidden">
                              <div className="flex items-center justify-between px-4 py-2 bg-indigo-50 border-b border-indigo-100">
                                <span className="text-[10px] font-bold text-indigo-700 flex items-center gap-1">
                                  <LayoutTemplate className="w-3 h-3" /> Plantilla HTML cargada
                                </span>
                                <button
                                  onClick={() => { setReplyBody(''); setReplyIsHtml(false) }}
                                  className="text-[10px] text-slate-400 hover:text-rose-500 transition-colors"
                                >
                                  Quitar plantilla
                                </button>
                              </div>
                              <div
                                className="max-h-48 overflow-y-auto p-3 text-xs pointer-events-none"
                                dangerouslySetInnerHTML={{ __html: replyBody }}
                              />
                            </div>
                          ) : (
                            <textarea
                              value={replyBody}
                              onChange={e => setReplyBody(e.target.value)}
                              placeholder="Escribe tu mensaje..."
                              rows={4}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/10 resize-none"
                            />
                          )}

                          {sendResult && (
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${sendResult.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                              {sendResult.ok ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                              {sendResult.msg}
                            </div>
                          )}
                          <div className="flex justify-end">
                            <button
                              onClick={handleSendEmail}
                              disabled={sending || !replySubject.trim() || !replyBody.trim()}
                              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                              {sending ? 'Enviando...' : 'Enviar email'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                  <Users className="w-10 h-10 opacity-20" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Selecciona un lead</h3>
                <p className="text-sm max-w-xs text-slate-400">
                  Elige un contacto de la lista para ver sus solicitudes, historial de emails y pipeline de ventas.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
