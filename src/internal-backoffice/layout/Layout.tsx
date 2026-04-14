import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Layers, 
  Receipt, 
  Puzzle, 
  Terminal, 
  Activity, 
  LifeBuoy, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Zap 
} from 'lucide-react';
import { InternalSection } from '../types/common';

interface SidebarProps {
  activeSection: InternalSection;
  setActiveSection: (section: InternalSection) => void;
  onLogout: () => void;
}

export const Sidebar = ({ activeSection, setActiveSection, onLogout }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'suscripciones', label: 'Suscripciones', icon: CreditCard },
    { id: 'planes', label: 'Planes', icon: Layers },
    { id: 'facturacion', label: 'Facturación', icon: Receipt },
    { id: 'integraciones', label: 'Integraciones', icon: Puzzle },
    { id: 'api', label: 'API / Webhooks', icon: Terminal },
    { id: 'metricas', label: 'Métricas', icon: Activity },
    { id: 'soporte', label: 'Soporte', icon: LifeBuoy },
    { id: 'inbox', label: 'CRM', icon: Bell },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
      <div className="p-6 flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0">
          <Zap className="text-slate-950 w-5 h-5" fill="currentColor" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-white tracking-tighter leading-none">StayNexApp</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Internal Backoffice</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id as InternalSection)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
              activeSection === item.id 
                ? 'bg-slate-800 text-white' 
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            <item.icon className={`w-4 h-4 ${activeSection === item.id ? 'text-indigo-400' : 'text-slate-500'}`} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">AD</div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Admin User</span>
              <span className="text-[10px] text-slate-500">Super Admin</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-400/5 transition-all text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export const Header = () => (
  <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
    <div className="flex items-center gap-4 flex-1">
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Buscar clientes, facturas, logs..." 
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all font-medium"
        />
      </div>
    </div>

    <div className="flex items-center gap-4">
      <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
        <Bell className="w-5 h-5" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
      </button>
      <div className="h-8 w-px bg-slate-200 mx-2" />
      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">System Online</span>
      </div>
    </div>
  </header>
);
