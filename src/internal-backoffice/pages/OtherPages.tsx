import React from 'react';
import { 
  Terminal, 
  Database, 
  Plus, 
  Key, 
  Globe, 
  Activity, 
  History, 
  Copy, 
  Trash2, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart, 
  BarChart3,
  Settings
} from 'lucide-react';
import { SectionHeader, Badge, MetricCard } from '../components/UI';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { MRR_DATA, PLAN_DISTRIBUTION } from '../mock/metrics.mock';

export const ApiPage = () => {
  const apiKeys = [
    { id: 'key_1', name: 'Production Main', key: 'sk_live_••••••••••••4242', created: '12 Oct 2025', lastUsed: '2 min ago', status: 'active' },
    { id: 'key_2', name: 'Staging Environment', key: 'sk_test_••••••••••••8899', created: '05 Jan 2026', lastUsed: '1 day ago', status: 'active' },
  ];

  const webhooks = [
    { id: 'wh_1', url: 'https://api.client.com/webhooks/staynex', events: ['payment.succeeded', 'subscription.created'], status: 'active' },
    { id: 'wh_2', url: 'https://hooks.slack.com/services/T000/B000/XXXX', events: ['ticket.critical'], status: 'failing' },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader 
        title="API & Webhooks" 
        description="Gestión de claves de API, configuración de webhooks y monitorización de tráfico técnico."
        actions={
          <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10">
            <Plus className="w-3 h-3" /> Crear API Key
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* API Keys */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-600" /> API Keys Activas
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-indigo-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{key.name}</p>
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5">{key.key}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Último uso</p>
                      <p className="text-[10px] text-slate-600 font-medium">{key.lastUsed}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Webhooks */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" /> Webhook Endpoints
              </h3>
              <button className="text-xs font-bold text-indigo-600 hover:underline">Añadir Endpoint</button>
            </div>
            <div className="p-6 space-y-4">
              {webhooks.map((wh) => (
                <div key={wh.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono text-slate-700 font-bold">{wh.url}</p>
                      <Badge variant={wh.status === 'active' ? 'emerald' : 'rose'}>{wh.status}</Badge>
                    </div>
                    <button className="p-1 text-slate-400 hover:text-slate-900">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {wh.events.map(ev => (
                      <span key={ev} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-mono text-slate-500">{ev}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* API Health */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="font-bold text-slate-900">Estado de API</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Uptime (24h)</span>
                <span className="text-xs font-bold text-emerald-600">99.98%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Latencia Media</span>
                <span className="text-xs font-bold text-slate-900">142ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Peticiones / min</span>
                <span className="text-xs font-bold text-slate-900">1,240</span>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <div className="flex gap-1 h-8 items-end">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="flex-1 bg-emerald-500 rounded-t-sm" style={{ height: `${Math.random() * 60 + 40}%` }} />
                ))}
              </div>
              <p className="text-[10px] text-center text-slate-400 mt-2 font-bold uppercase tracking-widest">Tráfico últimas 2 horas</p>
            </div>
          </div>

          {/* Recent Logs */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600" /> Logs Técnicos
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {[
                { method: 'POST', path: '/v1/bookings', status: 201, time: '12:42:01' },
                { method: 'GET', path: '/v1/clients/cli_92', status: 200, time: '12:41:55' },
                { method: 'PATCH', path: '/v1/subscriptions', status: 400, time: '12:41:30' },
                { method: 'POST', path: '/v1/webhooks/retry', status: 200, time: '12:40:12' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between text-[10px] font-mono p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className={log.status >= 400 ? 'text-rose-600' : 'text-emerald-600'}>{log.method}</span>
                    <span className="text-slate-600">{log.path}</span>
                  </div>
                  <span className="text-slate-400">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MetricsPage = () => {
  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Métricas Avanzadas" 
        description="Análisis profundo de datos de negocio, cohortes y proyecciones financieras."
        actions={
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
            <TrendingUp className="w-3 h-3" /> Reporte Completo
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Net Revenue" value="142.5k€" trend="up" trendValue="+12%" icon={TrendingUp} />
        <MetricCard title="Churn Rate" value="2.4%" trend="down" trendValue="-0.5%" icon={ArrowDownRight} />
        <MetricCard title="ARPU" value="84€" trend="up" trendValue="+4%" icon={Users} />
        <MetricCard title="LTV Proyectado" value="2.1M€" trend="up" trendValue="+15%" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* MRR Growth Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" /> Crecimiento MRR (Mensual)
            </h3>
            <Badge variant="indigo">+12.4% vs prev</Badge>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MRR_DATA}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600, fill: '#94a3b8'}} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-600" /> Distribución por Plan
            </h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PLAN_DISTRIBUTION} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600, fill: '#64748b'}} width={80} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ backgroundColor: '#020617', border: 'none', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {PLAN_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Análisis de Cohortes (Retención)</h3>
          <div className="flex gap-2">
            <Badge variant="slate">Últimos 6 meses</Badge>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="py-4 px-6">Cohorte</th>
                <th className="py-4 px-6">Clientes</th>
                <th className="py-4 px-6">Mes 1</th>
                <th className="py-4 px-6">Mes 2</th>
                <th className="py-4 px-6">Mes 3</th>
                <th className="py-4 px-6">Mes 4</th>
                <th className="py-4 px-6">Mes 5</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: 'Oct 2025', count: 120, values: [100, 92, 88, 85, 82] },
                { date: 'Nov 2025', count: 145, values: [100, 94, 90, 87, null] },
                { date: 'Dic 2025', count: 110, values: [100, 91, 86, null, null] },
                { date: 'Ene 2026', count: 160, values: [100, 95, null, null, null] },
                { date: 'Feb 2026', count: 130, values: [100, null, null, null, null] },
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-50 last:border-0">
                  <td className="py-4 px-6 text-xs font-bold text-slate-900">{row.date}</td>
                  <td className="py-4 px-6 text-xs text-slate-500">{row.count}</td>
                  {row.values.map((val, j) => (
                    <td key={j} className="py-4 px-6">
                      {val !== null ? (
                        <div className={`text-[10px] font-bold p-1 rounded text-center ${
                          val > 90 ? 'bg-emerald-100 text-emerald-700' : 
                          val > 85 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {val}%
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-300 text-center">-</div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const InboxPage = () => {
  const [selectedMsg, setSelectedMsg] = React.useState<any>(null);

  const messages = [
    { id: 1, sender: 'Juan Pérez', subject: 'Problema con reserva #1234', preview: 'Hola, tengo un problema con la reserva que hice ayer...', time: '10:30 AM', unread: true, category: 'Soporte' },
    { id: 2, sender: 'Stripe', subject: 'Pago fallido - Cliente cli_92', preview: 'El pago de 79.00€ ha fallado para el cliente...', time: '09:15 AM', unread: false, category: 'Billing' },
    { id: 3, sender: 'Sistema', subject: 'Uso de API elevado', preview: 'El cliente cli_45 ha superado el 90% de su límite...', time: 'Ayer', unread: false, category: 'Técnico' },
    { id: 4, sender: 'María García', subject: 'Consulta sobre plan Enterprise', preview: 'Me gustaría saber más sobre las opciones de personalización...', time: 'Ayer', unread: true, category: 'Ventas' },
  ];

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-6">
      {/* Sidebar / List */}
      <div className="w-96 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Bandeja de Entrada</h3>
          <Badge variant="indigo">4 nuevos</Badge>
        </div>
        <div className="flex-1 overflow-y-auto">
          {messages.map((msg) => (
            <button 
              key={msg.id}
              onClick={() => setSelectedMsg(msg)}
              className={`w-full p-4 border-b border-slate-50 text-left hover:bg-slate-50 transition-colors relative ${selectedMsg?.id === msg.id ? 'bg-indigo-50/50' : ''}`}
            >
              {msg.unread && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-600 rounded-full" />}
              <div className="flex justify-between items-start mb-1 pl-2">
                <span className="text-xs font-bold text-slate-900">{msg.sender}</span>
                <span className="text-[10px] text-slate-400 font-medium">{msg.time}</span>
              </div>
              <p className="text-xs font-bold text-slate-700 mb-1 pl-2 truncate">{msg.subject}</p>
              <p className="text-[10px] text-slate-500 pl-2 line-clamp-2">{msg.preview}</p>
              <div className="mt-2 pl-2">
                <Badge variant="slate">{msg.category}</Badge>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail View */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {selectedMsg ? (
          <div className="flex flex-col h-full">
            <div className="p-8 border-b border-slate-100 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{selectedMsg.subject}</h2>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    {selectedMsg.sender.split(' ').map((n: any) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{selectedMsg.sender}</p>
                    <p className="text-[10px] text-slate-500">Para: StayNex Support &lt;support@staynex.app&gt;</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors">
                  <History className="w-4 h-4" />
                </button>
                <button className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-rose-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-8 flex-1 overflow-y-auto space-y-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-700 leading-relaxed">
                {selectedMsg.preview}
                <br /><br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                <br /><br />
                Saludos,<br />
                {selectedMsg.sender}
              </div>
              
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Responder</h4>
                <div className="relative">
                  <textarea 
                    placeholder="Escribe tu respuesta aquí..."
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/10 min-h-[120px] resize-none"
                  />
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                      Enviar Respuesta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
              <Database className="w-10 h-10 opacity-20" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Selecciona un mensaje</h3>
            <p className="text-sm max-w-xs">Elige una conversación de la lista de la izquierda para ver los detalles y responder.</p>
          </div>
        )}
      </div>
    </div>
  );
};
