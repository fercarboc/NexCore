import { useState } from 'react';
import {
  Plus,
  Settings,
  CheckCircle2,
  XCircle,
  X,
  Euro,
  Home,
  Zap,
  Users,
  Database,
  BarChart3,
  Globe
} from 'lucide-react';
import { SectionHeader, Badge } from '../components/UI';
import { motion, AnimatePresence } from 'motion/react';
import { usePlans } from '@/src/hooks/usePlans';
import type { SaasPlan } from '@/src/hooks/usePlans';

const planVariant = (code: string) => {
  if (code === 'ENTERPRISE') return 'indigo'
  if (code === 'PREMIUM') return 'amber'
  if (code === 'PRO') return 'sky'
  return 'slate'
}

export const PlansPage = () => {
  const { plans, loading } = usePlans()
  const [isEditing, setIsEditing] = useState<SaasPlan | null>(null);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Configuración de Planes"
        description="Define la estructura de precios, límites de producto y características de cada nivel de suscripción."
        actions={
          <button
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <Plus className="w-3 h-3" /> Crear Nuevo Plan
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-start mb-4">
                <Badge variant={planVariant(plan.code)}>{plan.name}</Badge>
                <div className={`flex items-center gap-1 text-[10px] font-bold ${plan.is_active ? 'text-emerald-600' : 'text-slate-400'}`}>
                  <CheckCircle2 className="w-3 h-3" /> {plan.is_active ? 'activo' : 'inactivo'}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black text-slate-900">
                  {(plan.monthly_price_cents / 100).toLocaleString('es-ES')}€
                  <span className="text-xs font-bold text-slate-400">/mes</span>
                </p>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                  {(plan.yearly_price_cents / 100).toLocaleString('es-ES')}€ / año
                </p>
              </div>
            </div>
            <div className="p-6 flex-1 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5"><Home className="w-3 h-3" /> Propiedad/Cuenta</span>
                  <span className="font-bold text-slate-900">{plan.max_properties}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5"><Database className="w-3 h-3" /> Unidades Alquilables</span>
                  <span className="font-bold text-slate-900">{plan.max_units}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5"><Users className="w-3 h-3" /> Usuarios</span>
                  <span className="font-bold text-slate-900">{plan.max_users}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5"><Globe className="w-3 h-3" /> Dominios</span>
                  <span className="font-bold text-slate-900">{plan.max_domains}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5"><BarChart3 className="w-3 h-3" /> Conexiones API / día</span>
                  <span className="font-bold text-slate-900">{plan.api_calls_per_day.toLocaleString('es-ES')}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                {plan.debacu_enabled && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 className="w-3 h-3" /> Debacu IA
                  </div>
                )}
                {plan.crm_enabled && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 className="w-3 h-3" /> CRM incluido
                  </div>
                )}
                {plan.dynamic_pricing_enabled && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 className="w-3 h-3" /> Precios dinámicos
                  </div>
                )}
                {plan.advanced_reporting && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 className="w-3 h-3" /> Reportes avanzados
                  </div>
                )}
              </div>
              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => setIsEditing(plan)}
                  className="flex-1 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="w-3 h-3" /> Ver detalle
                </button>
                <button className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-rose-600 transition-colors">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Detail Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(null)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 border border-slate-100">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Plan {isEditing.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">Stripe: {isEditing.stripe_product_id ?? '—'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(null)}
                  className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Precio mensual</p>
                    <p className="text-2xl font-black text-slate-900">{(isEditing.monthly_price_cents / 100).toLocaleString('es-ES')}€</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">{isEditing.stripe_price_id_monthly ?? '—'}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Precio anual</p>
                    <p className="text-2xl font-black text-slate-900">{(isEditing.yearly_price_cents / 100).toLocaleString('es-ES')}€</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">{isEditing.stripe_price_id_yearly ?? '—'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Propiedades', value: isEditing.max_properties },
                    { label: 'Unidades', value: isEditing.max_units },
                    { label: 'Usuarios', value: isEditing.max_users },
                    { label: 'Dominios', value: isEditing.max_domains },
                    { label: 'API / día', value: isEditing.api_calls_per_day.toLocaleString('es-ES') },
                    { label: 'Setup fee', value: isEditing.setup_fee_cents > 0 ? `${isEditing.setup_fee_cents / 100}€` : 'Gratis' },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                      <p className="text-sm font-black text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Funcionalidades</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Debacu IA', enabled: isEditing.debacu_enabled },
                      { label: 'CRM', enabled: isEditing.crm_enabled },
                      { label: 'Precios dinámicos', enabled: isEditing.dynamic_pricing_enabled },
                      { label: 'Reportes avanzados', enabled: isEditing.advanced_reporting },
                      { label: 'Multi-propiedad', enabled: isEditing.multi_property_enabled },
                    ].map(({ label, enabled }) => (
                      <div key={label} className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold ${enabled ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                        {enabled ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                  <Euro className="w-3 h-3" />
                  Modificar precios requiere actualizar Stripe manualmente
                </div>
                <button
                  onClick={() => setIsEditing(null)}
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
