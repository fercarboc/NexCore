import { useState } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  Shield,
  CreditCard,
  Receipt,
  Activity,
  LifeBuoy,
  MessageSquare,
  Puzzle,
  History,
  Plus,
  FileText,
  Settings,
  AlertCircle,
  RefreshCw,
  Ban,
  PlayCircle,
  Users,
  Download,
  ChevronRight
} from 'lucide-react';
import { Badge } from '../components/UI';
import type { SaaSClientWithDetails } from '../types/clients';
import { useBilling } from '@/src/hooks/useBilling';
import { useSupport } from '@/src/hooks/useSupport';

interface ClientDetailPageProps {
  client: SaaSClientWithDetails;
  onBack: () => void;
}

const clientDisplayName = (c: SaaSClientWithDetails) => c.trade_name || c.legal_name

const activityIconMap: Record<string, typeof Shield> = {
  login: Shield,
  billing: CreditCard,
  support: LifeBuoy,
  config: Settings,
  usage: Activity,
}

export const ClientDetailPage = ({ client, onBack }: ClientDetailPageProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { invoices } = useBilling(client.id)
  const { tickets } = useSupport(client.id)

  const displayName = clientDisplayName(client)
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2)
  const planName = client.subscription?.plan?.name ?? '—'
  const stripeCustomerId = client.subscription?.saas_stripe_customer_id ?? '—'
  const instanceCount = client.product_instances?.length ?? 0

  const tabs = [
    { id: 'overview', label: 'Vista 360º', icon: Globe },
    { id: 'subscription', label: 'Suscripción', icon: CreditCard },
    { id: 'billing', label: 'Facturación', icon: Receipt },
    { id: 'usage', label: 'Uso Producto', icon: Activity },
    { id: 'support', label: 'Soporte', icon: LifeBuoy },
    { id: 'comms', label: 'Comunicaciones', icon: MessageSquare },
    { id: 'integrations', label: 'Integraciones', icon: Puzzle },
    { id: 'activity', label: 'Actividad', icon: History },
  ];

  return (
    <div className="space-y-6">
      {/* Header Detalle */}
      <div className="flex flex-col gap-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-xs transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Volver a Clientes
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -translate-y-1/2 translate-x-1/2 -z-0" />

          <div className="relative z-10 flex items-start gap-6">
            <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-slate-900/20">
              {initials}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{displayName}</h1>
                <Badge variant={client.status === 'ACTIVE' ? 'emerald' : 'rose'}>{client.status}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-indigo-500" /> ID: {client.id}</span>
                <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-indigo-500" /> Plan {planName}</span>
                <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-indigo-500" /> Health: 92/100</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-center min-w-[100px]">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MRR</p>
              <p className="text-lg font-black text-slate-900">
                {client.subscription?.plan?.monthly_price_cents
                  ? `${(client.subscription.plan.monthly_price_cents / 100).toFixed(0)}€`
                  : '—'}
              </p>
            </div>
            <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-center min-w-[100px]">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alta</p>
              <p className="text-sm font-black text-slate-900">{new Date(client.created_at).toLocaleDateString('es-ES')}</p>
            </div>
            <div className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-center min-w-[100px] shadow-lg shadow-indigo-600/20">
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Contacto</p>
              <p className="text-sm font-bold">{client.contact_name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navegación */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido Dinámico Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {activeTab === 'overview' && (
          <>
            <div className="lg:col-span-2 space-y-8">
              {/* Resumen Suscripción */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-600" /> Estado de Suscripción
                  </h3>
                  <button className="text-xs font-bold text-indigo-600 hover:underline">Gestionar en Stripe</button>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plan Actual</label>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="text-xl font-black text-slate-900">{planName}</span>
                        <Badge variant="indigo">{client.subscription?.billing_cycle === 'YEARLY' ? 'Anual' : 'Mensual'}</Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Próxima Renovación</label>
                      <p className="mt-1 text-sm font-bold text-slate-700">
                        {client.subscription?.current_period_end
                          ? new Date(client.subscription.current_period_end).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
                          : '—'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stripe Customer ID</label>
                      <div className="mt-1 flex items-center gap-2 font-mono text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {stripeCustomerId}
                        <ExternalLink className="w-3 h-3 cursor-pointer hover:text-indigo-600" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Método de Pago</label>
                        <p className="mt-1 text-sm font-bold text-slate-700">Visa •••• 4242</p>
                      </div>
                      <Badge variant="emerald">Válido</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Uso del Producto */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-600" /> Uso y Cuotas
                  </h3>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instancias</label>
                      <span className="text-xs font-bold text-slate-900">{instanceCount} / {client.subscription?.plan?.max_properties ?? 10}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600" style={{ width: `${(instanceCount / (client.subscription?.plan?.max_properties ?? 10)) * 100}%` }} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Llamadas API</label>
                      <span className="text-xs font-bold text-slate-900">12.4k / {(client.subscription?.plan?.api_calls_per_day ?? 500) * 30}k</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: '25%' }} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Debacu</label>
                      <span className="text-xs font-bold text-slate-900">
                        {client.subscription?.plan?.debacu_enabled ? 'Activo' : 'No incluido'}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: client.subscription?.plan?.debacu_enabled ? '45%' : '0%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actividad Reciente */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-600" /> Actividad Reciente
                  </h3>
                  <button className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">Ver log completo</button>
                </div>
                <div className="p-6 flex flex-col items-center justify-center py-10 text-slate-400 text-xs font-medium">
                  <History className="w-8 h-8 mb-3 opacity-20" />
                  Registro de actividad disponible próximamente
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Datos de Contacto */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" /> Contactos Clave
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{client.contact_name}</p>
                        <p className="text-[10px] font-medium text-slate-500">Contacto principal</p>
                      </div>
                      <Badge variant="indigo">Principal</Badge>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Mail className="w-3 h-3" /> {client.contact_email}
                      </div>
                      {client.contact_phone && (
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Phone className="w-3 h-3" /> {client.contact_phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-bold text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Añadir Contacto
                  </button>
                </div>
              </div>

              {/* Notas Internas */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" /> Notas Internas
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-xs text-slate-400 italic text-center py-2">No hay notas internas aún.</p>
                  <div className="pt-4">
                    <textarea
                      placeholder="Escribe una nota interna..."
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600/10 min-h-[100px] resize-none"
                    />
                    <button className="mt-3 w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">Guardar Nota</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'subscription' && (
          <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <CreditCard className="w-6 h-6 text-indigo-600" />
                  </div>
                  <Badge variant="emerald">Activa</Badge>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Plan {planName}</h3>
                  <p className="text-sm text-slate-500">{client.subscription?.billing_cycle === 'YEARLY' ? 'Suscripción Anual' : 'Suscripción Mensual'}</p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Precio</p>
                    <p className="text-2xl font-black text-slate-900">
                      {client.subscription?.plan?.monthly_price_cents
                        ? `${(client.subscription.plan.monthly_price_cents / 100).toFixed(0)}€`
                        : '—'}
                      <span className="text-xs font-bold text-slate-400">/mes</span>
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold hover:text-indigo-600 transition-colors">Cambiar Plan</button>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <RefreshCw className="w-6 h-6 text-emerald-600" />
                  </div>
                  <Badge variant="slate">Auto-renovación</Badge>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Próximo Cobro</h3>
                  <p className="text-sm text-slate-500">
                    {client.subscription?.current_period_end
                      ? new Date(client.subscription.current_period_end).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
                      : '—'}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</p>
                    <p className="text-sm font-bold text-emerald-600">Programado</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold hover:text-indigo-600 transition-colors">Pausar</button>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                    <Shield className="w-6 h-6 text-amber-600" />
                  </div>
                  <Badge variant="amber">Stripe Billing</Badge>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Seguridad de Pago</h3>
                  <p className="text-sm text-slate-500">Visa •••• 4242</p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expiración</p>
                    <p className="text-sm font-bold text-slate-700">12/28</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold hover:text-indigo-600 transition-colors">Actualizar</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-900">Acciones de Gestión de Suscripción</h3>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <button className="p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-200 group transition-all text-left space-y-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-sm">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Cambiar Ciclo de Facturación</p>
                    <p className="text-[10px] text-slate-500">Pasar de anual a mensual o viceversa.</p>
                  </div>
                </button>
                <button className="p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-amber-200 group transition-all text-left space-y-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-amber-600 transition-colors shadow-sm">
                    <Ban className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Suspender Temporalmente</p>
                    <p className="text-[10px] text-slate-500">Congelar acceso y cobros sin cancelar.</p>
                  </div>
                </button>
                <button className="p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-rose-200 group transition-all text-left space-y-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-rose-600 transition-colors shadow-sm">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 text-rose-600">Cancelar Suscripción</p>
                    <p className="text-[10px] text-slate-500">Programar cancelación al final del periodo.</p>
                  </div>
                </button>
                <button className="p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-emerald-200 group transition-all text-left space-y-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors shadow-sm">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Reactivar Suscripción</p>
                    <p className="text-[10px] text-slate-500">Reactivar una suscripción cancelada o pausada.</p>
                  </div>
                </button>
                <button className="p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-200 group transition-all text-left space-y-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-sm">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Configurar Add-ons</p>
                    <p className="text-[10px] text-slate-500">Gestionar límites extra de propiedades o API.</p>
                  </div>
                </button>
                <button className="p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-200 group transition-all text-left space-y-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-sm">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Reintentar Cobro Fallido</p>
                    <p className="text-[10px] text-slate-500">Lanzar reintento manual de pago en Stripe.</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Historial de Facturación</h3>
                <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                  <Plus className="w-3 h-3" /> Crear Factura Manual
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                      <th className="py-4 px-8">Factura</th>
                      <th className="py-4 px-8">Periodo</th>
                      <th className="py-4 px-8">Fecha</th>
                      <th className="py-4 px-8">Total</th>
                      <th className="py-4 px-8">Estado</th>
                      <th className="py-4 px-8 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-8">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-bold text-slate-900">{inv.id}</span>
                          </div>
                        </td>
                        <td className="py-4 px-8 text-sm text-slate-600">
                          {new Date(inv.period_start).toLocaleDateString('es-ES')} – {new Date(inv.period_end).toLocaleDateString('es-ES')}
                        </td>
                        <td className="py-4 px-8 text-sm text-slate-600">
                          {new Date(inv.created_at).toLocaleDateString('es-ES')}
                        </td>
                        <td className="py-4 px-8 text-sm font-bold text-slate-900">{(inv.amount_cents / 100).toFixed(2)}€</td>
                        <td className="py-4 px-8">
                          <Badge variant={inv.status === 'PAID' ? 'emerald' : 'amber'}>{inv.status}</Badge>
                        </td>
                        <td className="py-4 px-8 text-right">
                          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Tickets de Soporte</h3>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-2">
                  <Plus className="w-3 h-3" /> Nuevo Ticket
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                      <th className="py-4 px-8">ID / Asunto</th>
                      <th className="py-4 px-8">Tipo</th>
                      <th className="py-4 px-8">Prioridad</th>
                      <th className="py-4 px-8">Estado</th>
                      <th className="py-4 px-8">Asignado a</th>
                      <th className="py-4 px-8 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-8">
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-900">{ticket.subject}</p>
                            <p className="text-[10px] font-mono text-slate-400">{ticket.id}</p>
                          </div>
                        </td>
                        <td className="py-4 px-8">
                          <Badge variant="slate">{ticket.type}</Badge>
                        </td>
                        <td className="py-4 px-8">
                          <Badge variant={ticket.priority === 'critical' || ticket.priority === 'high' ? 'rose' : 'slate'}>{ticket.priority}</Badge>
                        </td>
                        <td className="py-4 px-8">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              ticket.status === 'open' ? 'bg-rose-500' :
                              ticket.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`} />
                            <span className="text-xs font-bold text-slate-700 capitalize">{ticket.status.replace('_', ' ')}</span>
                          </div>
                        </td>
                        <td className="py-4 px-8 text-sm text-slate-600 font-medium">{ticket.assignee_name}</td>
                        <td className="py-4 px-8 text-right">
                          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {['usage', 'comms', 'integrations', 'activity'].includes(activeTab) && (
          <div className="lg:col-span-3 flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-400">
            <Settings className="w-12 h-12 mb-4 opacity-20 animate-spin-slow" />
            <p className="font-medium italic">Sección de {activeTab} en desarrollo para este cliente...</p>
          </div>
        )}
      </div>
    </div>
  );
};
