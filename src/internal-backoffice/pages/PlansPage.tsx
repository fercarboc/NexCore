import React, { useState } from 'react';
import { 
  Plus, 
  Settings, 
  CheckCircle2, 
  XCircle,
  X,
  Euro,
  Home,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { SectionHeader, Badge } from '../components/UI';
import { motion, AnimatePresence } from 'motion/react';

export const PlansPage = () => {
  const [isEditing, setIsEditing] = useState<any>(null);

  const plans = [
    { id: 'p_1', name: 'Basic', priceMonthly: 29, priceYearly: 290, properties: 1, debacu: 50, status: 'active' },
    { id: 'p_2', name: 'Pro', priceMonthly: 79, priceYearly: 790, properties: 5, debacu: 250, status: 'active' },
    { id: 'p_3', name: 'Premium', priceMonthly: 149, priceYearly: 1490, properties: 15, debacu: 1000, status: 'active' },
    { id: 'p_4', name: 'Enterprise', priceMonthly: 499, priceYearly: 4990, properties: 100, debacu: 5000, status: 'active' },
  ];

  const handleEdit = (plan: any) => {
    setIsEditing(plan);
  };

  const handleCreate = () => {
    setIsEditing({ name: '', priceMonthly: 0, priceYearly: 0, properties: 0, debacu: 0, status: 'active' });
  };

  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Configuración de Planes" 
        description="Define la estructura de precios, límites de producto y características de cada nivel de suscripción."
        actions={
          <button 
            onClick={handleCreate}
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
                <Badge variant={plan.name === 'Enterprise' ? 'indigo' : 'slate'}>{plan.name}</Badge>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                  <CheckCircle2 className="w-3 h-3" /> {plan.status}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black text-slate-900">{plan.priceMonthly}€<span className="text-xs font-bold text-slate-400">/mes</span></p>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{plan.priceYearly}€ / año</p>
              </div>
            </div>
            <div className="p-6 flex-1 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Propiedades</span>
                  <span className="font-bold text-slate-900">{plan.properties}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Uso Debacu</span>
                  <span className="font-bold text-slate-900">{plan.debacu} / mes</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Soporte</span>
                  <span className="font-bold text-slate-900">{plan.name === 'Basic' ? 'Email' : 'Prioritario'}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button 
                  onClick={() => handleEdit(plan)}
                  className="flex-1 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="w-3 h-3" /> Editar
                </button>
                <button className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-rose-600 transition-colors">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Editor Modal */}
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
                    <h3 className="text-lg font-bold text-slate-900">{isEditing.id ? 'Editar Plan' : 'Crear Nuevo Plan'}</h3>
                    <p className="text-xs text-slate-500 font-medium">Configura precios y límites del nivel</p>
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
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nombre del Plan</label>
                    <input 
                      type="text" 
                      defaultValue={isEditing.name}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600/10" 
                      placeholder="Ej: Pro Plus"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Estado</label>
                    <select className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none appearance-none">
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                      <option value="archived">Archivado</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Precio Mensual (€)</label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="number" 
                        defaultValue={isEditing.priceMonthly}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Precio Anual (€)</label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="number" 
                        defaultValue={isEditing.priceYearly}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Límite Propiedades</label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="number" 
                        defaultValue={isEditing.properties}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Créditos Debacu</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="number" 
                        defaultValue={isEditing.debacu}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Características Incluidas</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Reservas Directas', 'Channel Manager', 'IA Automation', 'Informes Avanzados', 'Soporte 24/7', 'API Access'].map((feat) => (
                      <label key={feat} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-white transition-colors">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600/20" />
                        <span className="text-xs font-medium text-slate-700">{feat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => setIsEditing(null)}
                  className="px-6 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Cancelar
                </button>
                <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                  {isEditing.id ? 'Actualizar Plan' : 'Crear Plan'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
