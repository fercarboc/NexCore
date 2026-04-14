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
} from 'lucide-react';
import { SectionHeader, Badge } from '../components/UI';
import { useCrmLeads } from '@/src/hooks/useCrmLeads';
import { useCrmContact } from '@/src/hooks/useCrmContact';
import { sendCrmEmail } from '@/src/services/crm.service';
import type { CrmLead } from '@/src/services/crm.service';

// ─── Status pipeline ────────────────────────────────────────────────────────

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

// ─── Main CRM Page ────────────────────────────────────────────────────────────

export const CRMPage = () => {
  const { leads, loading } = useCrmLeads()
  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const contactId = selectedLead?.contact_id ?? null
  const { contact, loading: loadingContact, refetch: refetchContact } = useCrmContact(contactId)

  // Reply form state
  const [replySubject, setReplySubject] = useState('')
  const [replyBody, setReplyBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ ok: boolean; msg: string } | null>(null)

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
      })
      if (result.status === 'sent') {
        setSendResult({ ok: true, msg: 'Email enviado correctamente.' })
        setReplySubject('')
        setReplyBody('')
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

  // Count by status
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
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 border border-sky-100 rounded-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span className="text-[10px] font-bold text-sky-700">{counts['new'] ?? 0} nuevos</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
              <Users className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-600">{leads.length} leads totales</span>
            </div>
          </div>
        }
      />

      <div className="h-[calc(100vh-14rem)] flex gap-6">
        {/* ── Left panel: Lead list ── */}
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

        {/* ── Right panel: Contact detail ── */}
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

                    {/* Quick reply */}
                    <div className="space-y-3">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Responder</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                          <span>Para:</span>
                          <span className="text-indigo-600 font-bold">{contact.email}</span>
                        </div>
                        <input
                          type="text"
                          value={replySubject}
                          onChange={e => setReplySubject(e.target.value)}
                          placeholder="Asunto..."
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/10"
                        />
                        <textarea
                          value={replyBody}
                          onChange={e => setReplyBody(e.target.value)}
                          placeholder="Escribe tu mensaje..."
                          rows={4}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/10 resize-none"
                        />
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
    </div>
  );
};
