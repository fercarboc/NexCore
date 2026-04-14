import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X, User, CreditCard, CheckCircle2, Loader2,
  Building2, Mail, Phone, FileText, ChevronRight, ChevronLeft,
  Check, AlertCircle
} from 'lucide-react'
import { Badge } from './UI'
import { createClient } from '@/src/services/createClient.service'
import type { CreateClientPayload } from '@/src/services/createClient.service'
import { usePlans } from '@/src/hooks/usePlans'

interface NewClientWizardProps {
  onClose: () => void
  onSuccess: () => void
}

const STEPS = [
  { id: 1, label: 'Datos del cliente', icon: User },
  { id: 2, label: 'Plan y ciclo', icon: CreditCard },
  { id: 3, label: 'Confirmación', icon: CheckCircle2 },
]

const CYCLE_DISCOUNT: Record<string, number> = {
  BASIC: 0, PRO: 0, PREMIUM: 0, ENTERPRISE: 0,
}

export const NewClientWizard = ({ onClose, onSuccess }: NewClientWizardProps) => {
  const { plans } = usePlans()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ message: string; client_id: string } | null>(null)

  const [form, setForm] = useState<CreateClientPayload>({
    legal_name: '',
    trade_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    tax_id: '',
    plan_id: '',
    billing_cycle: 'MONTHLY',
  })

  const set = (field: keyof CreateClientPayload, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const selectedPlan = plans.find(p => p.id === form.plan_id)

  const price = selectedPlan
    ? form.billing_cycle === 'YEARLY'
      ? selectedPlan.yearly_price_cents / 100
      : selectedPlan.monthly_price_cents / 100
    : 0

  const step1Valid = form.legal_name.trim() && form.contact_name.trim() && form.contact_email.trim()
  const step2Valid = form.plan_id && form.billing_cycle

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await createClient({
        ...form,
        trade_name: form.trade_name || undefined,
        contact_phone: form.contact_phone || undefined,
        tax_id: form.tax_id || undefined,
      })
      setResult({ message: res.message, client_id: res.client_id })
      setSuccess(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Nuevo Cliente</h2>
            <p className="text-xs text-slate-500 font-medium">Alta completa con Stripe + acceso a casarural-v2</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-900 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper */}
        {!success && (
          <div className="px-8 pt-6 flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step > s.id ? 'bg-indigo-600 text-white' :
                    step === s.id ? 'bg-slate-900 text-white' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                  </div>
                  <span className={`text-xs font-bold whitespace-nowrap ${step === s.id ? 'text-slate-900' : 'text-slate-400'}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-3 transition-all ${step > s.id ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Contenido */}
        <div className="p-8">
          <AnimatePresence mode="wait">

            {/* PASO 1 — Datos del cliente */}
            {step === 1 && !success && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> Razón Social *
                    </label>
                    <input
                      type="text"
                      value={form.legal_name}
                      onChange={e => set('legal_name', e.target.value)}
                      placeholder="Empresa S.L."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> Nombre Comercial
                    </label>
                    <input
                      type="text"
                      value={form.trade_name}
                      onChange={e => set('trade_name', e.target.value)}
                      placeholder="Nombre público (opcional)"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <User className="w-3 h-3" /> Nombre de Contacto *
                    </label>
                    <input
                      type="text"
                      value={form.contact_name}
                      onChange={e => set('contact_name', e.target.value)}
                      placeholder="Juan García"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email *
                    </label>
                    <input
                      type="email"
                      value={form.contact_email}
                      onChange={e => set('contact_email', e.target.value)}
                      placeholder="cliente@empresa.com"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Teléfono
                    </label>
                    <input
                      type="tel"
                      value={form.contact_phone}
                      onChange={e => set('contact_phone', e.target.value)}
                      placeholder="+34 600 000 000"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <FileText className="w-3 h-3" /> CIF / NIF
                    </label>
                    <input
                      type="text"
                      value={form.tax_id}
                      onChange={e => set('tax_id', e.target.value)}
                      placeholder="B12345678"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-400"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* PASO 2 — Plan y ciclo */}
            {step === 2 && !success && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  {plans.map(plan => (
                    <button
                      key={plan.id}
                      onClick={() => set('plan_id', plan.id)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all ${
                        form.plan_id === plan.id
                          ? 'border-indigo-600 bg-indigo-50/50'
                          : 'border-slate-100 hover:border-indigo-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-bold text-slate-900">{plan.name}</span>
                        {form.plan_id === plan.id && (
                          <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xl font-black text-slate-900">
                        {(plan.monthly_price_cents / 100).toFixed(0)}€
                        <span className="text-xs font-medium text-slate-400">/mes</span>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {plan.max_properties} prop · {plan.api_calls_per_day} API/día
                      </p>
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ciclo de Facturación</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['MONTHLY', 'YEARLY'] as const).map(cycle => (
                      <button
                        key={cycle}
                        onClick={() => set('billing_cycle', cycle)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                          form.billing_cycle === cycle
                            ? 'border-indigo-600 bg-indigo-50/50'
                            : 'border-slate-100 hover:border-indigo-200 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{cycle === 'MONTHLY' ? 'Mensual' : 'Anual'}</p>
                            {cycle === 'YEARLY' && selectedPlan && (
                              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                                {(selectedPlan.yearly_price_cents / 100).toFixed(0)}€/año
                              </p>
                            )}
                          </div>
                          {form.billing_cycle === cycle && (
                            <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* PASO 3 — Confirmación */}
            {step === 3 && !success && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-white">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resumen del Alta</p>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Razón Social</p>
                        <p className="font-bold text-slate-900 mt-0.5">{form.legal_name}</p>
                      </div>
                      {form.trade_name && (
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Nombre Comercial</p>
                          <p className="font-bold text-slate-900 mt-0.5">{form.trade_name}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Contacto</p>
                        <p className="font-bold text-slate-900 mt-0.5">{form.contact_name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Email</p>
                        <p className="font-bold text-slate-900 mt-0.5">{form.contact_email}</p>
                      </div>
                      {form.contact_phone && (
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Teléfono</p>
                          <p className="font-bold text-slate-900 mt-0.5">{form.contact_phone}</p>
                        </div>
                      )}
                      {form.tax_id && (
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">CIF/NIF</p>
                          <p className="font-bold text-slate-900 mt-0.5">{form.tax_id}</p>
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="indigo">{selectedPlan?.name}</Badge>
                        <Badge variant="slate">{form.billing_cycle === 'YEARLY' ? 'Anual' : 'Mensual'}</Badge>
                      </div>
                      <p className="text-xl font-black text-slate-900">
                        {price.toFixed(0)}€
                        <span className="text-xs font-medium text-slate-400">
                          /{form.billing_cycle === 'YEARLY' ? 'año' : 'mes'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-indigo-700 font-medium space-y-1.5">
                  <p className="font-bold text-indigo-900">Al confirmar se ejecutará:</p>
                  <p>✓ Crear Customer en Stripe</p>
                  <p>✓ Crear Subscription en Stripe ({selectedPlan?.name} {form.billing_cycle === 'YEARLY' ? 'Anual' : 'Mensual'})</p>
                  <p>✓ Registrar cliente en NexCore</p>
                  <p>✓ Crear acceso en casarural-v2</p>
                  <p>✓ Enviar email de bienvenida a <strong>{form.contact_email}</strong></p>
                </div>

                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 text-xs font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}
              </motion.div>
            )}

            {/* ÉXITO */}
            {success && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900">¡Cliente creado!</h3>
                  <p className="text-sm text-slate-500 font-medium">{result?.message}</p>
                </div>
                <div className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-2 text-xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID NexCore</p>
                  <p className="font-mono text-slate-700">{result?.client_id}</p>
                </div>
                <button
                  onClick={() => { onSuccess(); onClose() }}
                  className="w-full py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all"
                >
                  Ver en listado de clientes
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer con navegación */}
        {!success && (
          <div className="px-8 pb-8 flex justify-between items-center">
            <button
              onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {step === 1 ? 'Cancelar' : 'Anterior'}
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={step === 1 ? !step1Valid : !step2Valid}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all disabled:opacity-60 shadow-lg shadow-indigo-600/20"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Creando cliente...</>
                ) : (
                  <><Check className="w-4 h-4" /> Confirmar y crear</>
                )}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
