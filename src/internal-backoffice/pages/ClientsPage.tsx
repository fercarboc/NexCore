import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Search, Filter, Download, Plus, MoreVertical, ChevronRight, ArrowUpRight } from 'lucide-react';
import { SectionHeader, Badge } from '../components/UI';
import { useClients } from '@/src/hooks/useClients';
import { NewClientWizard } from '../components/NewClientWizard';
import type { SaaSClientWithDetails } from '../types/clients';

interface ClientsPageProps {
  onSelectClient: (client: SaaSClientWithDetails) => void;
}

const clientDisplayName = (c: SaaSClientWithDetails) => c.trade_name || c.legal_name

const statusConfig: Record<string, { dot: string; label: string }> = {
  ACTIVE:    { dot: 'bg-emerald-500', label: 'Activo' },
  LEAD:      { dot: 'bg-sky-400',     label: 'Lead' },
  SUSPENDED: { dot: 'bg-rose-500',    label: 'Suspendido' },
  CANCELLED: { dot: 'bg-slate-400',   label: 'Cancelado' },
}

const planVariant = (code?: string) => {
  if (code === 'ENTERPRISE') return 'indigo'
  if (code === 'PREMIUM')    return 'amber'
  if (code === 'PRO')        return 'sky'
  return 'slate'
}

export const ClientsPage = ({ onSelectClient }: ClientsPageProps) => {
  const { clients, loading, error, refetch } = useClients()
  const [showWizard, setShowWizard] = useState(false)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-64 text-rose-500 text-sm font-bold">{error}</div>
  )

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Gestión de Clientes"
        description="Administra todas las cuentas SaaS, visualiza su estado y accede a su configuración detallada."
        actions={
          <>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
              <Download className="w-3 h-3" /> Exportar CSV
            </button>
            <button
              onClick={() => setShowWizard(true)}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10"
            >
              <Plus className="w-3 h-3" /> Nuevo Cliente
            </button>
          </>
        }
      />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrar por nombre, email o ID..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600/10 w-64 font-medium"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mostrando {clients.length} clientes</span>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-50" disabled>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-indigo-600 font-bold text-xs">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="py-4 px-6">Cliente / ID</th>
                <th className="py-4 px-6">Plan</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6">Contacto</th>
                <th className="py-4 px-6">Alta</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => {
                const planCode = client.subscription?.plan?.code
                const planName = client.subscription?.plan?.name ?? '—'
                const sc = statusConfig[client.status] ?? { dot: 'bg-slate-400', label: client.status }
                const initials = clientDisplayName(client).split(' ').map(n => n[0]).join('').slice(0, 2)

                return (
                  <tr
                    key={client.id}
                    className="border-b border-slate-50 last:border-0 group hover:bg-slate-50/50 transition-all cursor-pointer"
                    onClick={() => onSelectClient(client)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{clientDisplayName(client)}</p>
                          <p className="text-[10px] font-mono text-slate-400">{client.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={planVariant(planCode)}>{planName}</Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        <span className="text-xs font-bold text-slate-700">{sc.label}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs font-medium text-slate-700">{client.contact_name}</p>
                      <p className="text-[10px] text-slate-400">{client.contact_email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs text-slate-500">
                        {new Date(client.created_at).toLocaleDateString('es-ES')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showWizard && (
          <NewClientWizard
            onClose={() => setShowWizard(false)}
            onSuccess={refetch}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
