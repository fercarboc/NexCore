import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Activity, 
  Settings, 
  ChevronRight, 
  ArrowLeft, 
  Globe, 
  Shield, 
  History, 
  AlertCircle, 
  CheckCircle2,
  Puzzle
} from 'lucide-react';
import { SectionHeader, Badge, MetricCard } from '../components/UI';
import { MOCK_INTEGRATIONS, MOCK_INTEGRATION_LOGS } from '../mock/integrations.mock';
import type { InfraIntegration } from '../types/integrations';

export const IntegrationsPage = () => {
  const [selectedIntegration, setSelectedIntegration] = useState<InfraIntegration | null>(null);

  if (selectedIntegration) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-6">
          <button onClick={() => setSelectedIntegration(null)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-xs transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Volver a Integraciones
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                <Globe className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">{selectedIntegration.name}</h1>
                  <Badge variant={selectedIntegration.status === 'active' ? 'emerald' : 'rose'}>{selectedIntegration.status}</Badge>
                </div>
                <p className="text-sm text-slate-500 font-medium">{selectedIntegration.description}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold hover:text-indigo-600 transition-colors">Configurar API</button>
              <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">Pausar Integración</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard title="Uptime" value={selectedIntegration.uptime} icon={Activity} />
          <MetricCard title="Latencia Media" value={selectedIntegration.latency} icon={Activity} />
          <MetricCard title="Tasa de Éxito" value={selectedIntegration.successRate} icon={CheckCircle2} />
          <MetricCard title="Salud" value={`${selectedIntegration.health}%`} icon={Shield} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600" /> Logs de Eventos
              </h3>
              <button className="text-xs font-bold text-indigo-600 hover:underline">Ver todos los logs</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                    <th className="py-4 px-6">Timestamp</th>
                    <th className="py-4 px-6">Evento</th>
                    <th className="py-4 px-6">Resultado</th>
                    <th className="py-4 px-6">Código</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_INTEGRATION_LOGS.map((log) => (
                    <tr key={log.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 text-[10px] font-mono text-slate-500">{log.timestamp}</td>
                      <td className="py-4 px-6">
                        <p className="text-xs font-bold text-slate-900">{log.type}</p>
                        <p className="text-[10px] text-slate-500">{log.details}</p>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={log.result === 'success' ? 'emerald' : log.result === 'error' ? 'rose' : 'amber'}>{log.result}</Badge>
                      </td>
                      <td className="py-4 px-6 text-[10px] font-mono text-slate-600">{log.code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-600" /> Parámetros Técnicos
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Versión SDK</label>
                <p className="text-sm font-bold text-slate-900">{selectedIntegration.version}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Entorno</label>
                <Badge variant={selectedIntegration.environment === 'production' ? 'indigo' : 'slate'}>{selectedIntegration.environment}</Badge>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Última Sincronización</label>
                <p className="text-sm font-medium text-slate-700">{selectedIntegration.lastSync}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Responsable Interno</label>
                <p className="text-sm font-bold text-slate-900">{selectedIntegration.owner}</p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <button className="w-full py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all">Revocar Acceso</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Integraciones y Ecosistema" 
        description="Gestiona las conexiones con servicios externos, automatizaciones AI y conectores de plataforma."
        actions={
          <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
            <Plus className="w-3 h-3" /> Nueva Integración
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_INTEGRATIONS.map((integration) => (
          <div 
            key={integration.id} 
            onClick={() => setSelectedIntegration(integration)}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:border-indigo-200 group transition-all cursor-pointer flex flex-col"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                <Puzzle className="w-6 h-6" />
              </div>
              <Badge variant={integration.status === 'active' ? 'emerald' : integration.status === 'error' ? 'rose' : 'slate'}>
                {integration.status}
              </Badge>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-bold text-slate-900">{integration.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{integration.description}</p>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${integration.health > 90 ? 'bg-emerald-500' : integration.health > 70 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Salud: {integration.health}%</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
