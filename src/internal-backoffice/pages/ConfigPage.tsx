import { useState } from 'react';
import { 
  Building2, 
  Palette, 
  FileText, 
  Bell, 
  Shield, 
  Users, 
  Globe, 
  Plus, 
  Settings, 
  Euro, 
  Lock,
  Mail,
  MessageSquare,
  Zap
} from 'lucide-react';
import { SectionHeader, Badge } from '../components/UI';
import { useStaff } from '@/src/hooks/useStaff';

export const ConfigPage = () => {
  const [configTab, setConfigTab] = useState('empresa');
  const { staff } = useStaff()

  const tabs = [
    { id: 'empresa', label: 'Empresa', icon: Building2 },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'legal', label: 'Legal', icon: FileText },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
    { id: 'seguridad', label: 'Seguridad', icon: Shield },
    { id: 'usuarios', label: 'Equipo Interno', icon: Users },
    { id: 'parametros', label: 'Parámetros Globales', icon: Globe },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Configuración de Plataforma" 
        description="Ajustes globales de StayNexApp, gestión de equipo interno y parámetros de sistema."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-64 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setConfigTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                configTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8">
            {configTab === 'empresa' && (
              <div className="space-y-8">
                <div className="pb-6 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Datos de Empresa</h3>
                  <p className="text-sm text-slate-500">Información fiscal y de contacto oficial de StayNexApp.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Razón Social</label>
                    <input type="text" defaultValue="StayNex Technologies S.L." className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">CIF / VAT ID</label>
                    <input type="text" defaultValue="B12345678" className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email de Soporte</label>
                    <input type="email" defaultValue="support@staynexapp.com" className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Teléfono</label>
                    <input type="text" defaultValue="+34 900 000 000" className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold" />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Dirección Fiscal</label>
                    <input type="text" defaultValue="Paseo de la Castellana 200, 28046 Madrid, España" className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold" />
                  </div>
                </div>
                <div className="pt-6 flex justify-end">
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all">Guardar Cambios</button>
                </div>
              </div>
            )}

            {configTab === 'branding' && (
              <div className="space-y-8">
                <div className="pb-6 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Identidad Visual</h3>
                  <p className="text-sm text-slate-500">Logotipos, colores y recursos de marca de la plataforma.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Logotipo Principal</label>
                      <div className="w-full aspect-video bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 relative group overflow-hidden">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                            <Settings className="text-slate-950 w-6 h-6" />
                          </div>
                          <span className="text-xl font-bold text-white tracking-tighter">StayNexApp</span>
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold">Cambiar Logo</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Color Primario</label>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20" />
                        <input type="text" defaultValue="#6366f1" className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-mono" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Color Secundario</label>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-950 rounded-xl shadow-lg shadow-slate-950/20" />
                        <input type="text" defaultValue="#020617" className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-mono" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {configTab === 'legal' && (
              <div className="space-y-8">
                <div className="pb-6 border-b border-slate-100 flex justify-between items-end">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Documentación Legal</h3>
                    <p className="text-sm text-slate-500">Gestión de textos legales y políticas de plataforma.</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold hover:text-indigo-600 transition-colors flex items-center gap-2">
                    <Plus className="w-3 h-3" /> Nuevo Documento
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-xs font-medium">
                  <FileText className="w-8 h-8 mb-3 opacity-20" />
                  Gestión de documentos legales disponible próximamente
                </div>
              </div>
            )}

            {configTab === 'usuarios' && (
              <div className="space-y-8">
                <div className="pb-6 border-b border-slate-100 flex justify-between items-end">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Equipo Interno</h3>
                    <p className="text-sm text-slate-500">Gestión de accesos y roles para el equipo de StayNexApp.</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                    <Plus className="w-3 h-3" /> Invitar Usuario
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                        <th className="pb-4 px-2">Usuario</th>
                        <th className="pb-4 px-2">Rol</th>
                        <th className="pb-4 px-2">Estado</th>
                        <th className="pb-4 px-2">Último Acceso</th>
                        <th className="pb-4 px-2 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map((user) => (
                        <tr key={user.id} className="border-b border-slate-50 last:border-0">
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                {user.name.split(' ').map((n: string) => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                <p className="text-[10px] text-slate-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <span className="text-xs font-medium text-slate-700">{user.role}</span>
                          </td>
                          <td className="py-4 px-2">
                            <Badge variant={user.status === 'active' ? 'emerald' : 'slate'}>{user.status}</Badge>
                          </td>
                          <td className="py-4 px-2 text-xs text-slate-400">
                            {user.last_sign_in_at
                              ? new Date(user.last_sign_in_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
                              : '—'}
                          </td>
                          <td className="py-4 px-2 text-right">
                            <button className="p-2 text-slate-400 hover:text-indigo-600">
                              <Settings className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {configTab === 'parametros' && (
              <div className="space-y-8">
                <div className="pb-6 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Parámetros Globales</h3>
                  <p className="text-sm text-slate-500">Variables de sistema y configuración técnica de la plataforma.</p>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nombre del Producto</label>
                      <input type="text" defaultValue="StayNex" className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Dominio API Principal</label>
                      <input type="text" defaultValue="api.staynex.app" className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-mono" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Moneda por Defecto</label>
                      <div className="relative">
                        <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold appearance-none focus:outline-none">
                          <option>EUR - Euro</option>
                          <option>USD - Dollar</option>
                          <option>GBP - Pound</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Zona Horaria</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold appearance-none focus:outline-none">
                          <option>Europe/Madrid (UTC+1)</option>
                          <option>Europe/London (UTC+0)</option>
                          <option>America/New_York (UTC-5)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-slate-900 rounded-2xl text-white">
                    <div className="flex items-center gap-3 mb-6">
                      <Lock className="w-5 h-5 text-indigo-400" />
                      <h4 className="font-bold">Variables de Entorno (Solo Lectura)</h4>
                    </div>
                    <div className="space-y-3 font-mono text-[10px] text-slate-400">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span>NODE_ENV</span>
                        <span className="text-emerald-400">production</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span>DATABASE_URL</span>
                        <span className="text-white">postgresql://db.staynex.app:5432/main</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span>REDIS_HOST</span>
                        <span className="text-white">cache.staynex.app</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ENCRYPTION_KEY</span>
                        <span className="text-slate-600">••••••••••••••••••••••••••••••••</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {configTab === 'notificaciones' && (
              <div className="space-y-8">
                <div className="pb-6 border-b border-slate-100 flex justify-between items-end">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Centro de Notificaciones</h3>
                    <p className="text-sm text-slate-500">Configura los canales y reglas de envío para eventos de sistema.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <Mail className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Activo</span>
                        <div className="w-8 h-4 bg-indigo-600 rounded-full relative">
                          <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Email (SMTP)</h4>
                      <p className="text-[10px] text-slate-500">Amazon SES • support@staynex.app</p>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <MessageSquare className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Activo</span>
                        <div className="w-8 h-4 bg-indigo-600 rounded-full relative">
                          <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Slack</h4>
                      <p className="text-[10px] text-slate-500">Workspace: StayNex • #alerts</p>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <Bell className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Inactivo</span>
                        <div className="w-8 h-4 bg-slate-200 rounded-full relative">
                          <div className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Web Push</h4>
                      <p className="text-[10px] text-slate-500">Notificaciones en navegador</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Reglas de Envío</h4>
                  <div className="space-y-2">
                    {[
                      { event: 'Nuevo Registro de Cliente', channels: ['Email', 'Slack'], recipient: 'Ventas' },
                      { event: 'Pago Fallido (Stripe)', channels: ['Email', 'Slack'], recipient: 'Billing' },
                      { event: 'Nuevo Ticket Crítico', channels: ['Slack'], recipient: 'Soporte' },
                      { event: 'Uso de API > 90%', channels: ['Email'], recipient: 'Técnico' },
                    ].map((rule, i) => (
                      <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                            <Zap className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{rule.event}</p>
                            <p className="text-[10px] text-slate-500">Destinatario: {rule.recipient}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {rule.channels.map(c => <Badge key={c} variant="slate">{c}</Badge>)}
                          <button className="p-2 text-slate-400 hover:text-indigo-600">
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {configTab === 'seguridad' && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                <Shield className="w-12 h-12 mb-4 opacity-20 animate-spin-slow" />
                <p className="font-medium italic">Módulo de Seguridad en desarrollo...</p>
              </div>
            )}
        </div>
      </div>
    </div>
  </div>
);
};
