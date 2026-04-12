import { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  MessageSquare,
  User,
  Clock,
  ChevronRight,
  ArrowLeft,
  Send,
  Paperclip,
} from 'lucide-react';
import { SectionHeader, Badge } from '../components/UI';
import { MOCK_TICKETS, MOCK_TIMELINE } from '../mock/support.mock';
import type { TicketWithDetails } from '../types/support';

export const SupportPage = () => {
  const [selectedTicket, setSelectedTicket] = useState<TicketWithDetails | null>(null);

  if (selectedTicket) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-6">
          <button onClick={() => setSelectedTicket(null)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-xs transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Volver a Tickets
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">{selectedTicket.subject}</h1>
                  <Badge variant={selectedTicket.priority === 'critical' ? 'rose' : 'amber'}>{selectedTicket.priority}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                  <span>ID: {selectedTicket.id}</span>
                  <span>Cliente: {selectedTicket.client_name}</span>
                  <span>Tipo: {selectedTicket.type}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <select className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none">
                <option>Cambiar Estado: {selectedTicket.status}</option>
                <option>resolved</option>
                <option>closed</option>
              </select>
              <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">Cerrar Ticket</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Conversación y Timeline</h3>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Clock className="w-3 h-3" /> Última actividad: {new Date(selectedTicket.updated_at).toLocaleDateString('es-ES')}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {MOCK_TIMELINE.map((event) => (
                  <div key={event.id} className={`flex gap-4 ${event.type === 'note' ? 'bg-amber-50/50 p-4 rounded-2xl border border-amber-100' : ''}`}>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-900">{event.actor}</span>
                        <span className="text-[10px] font-medium text-slate-400">{new Date(event.created_at).toLocaleString('es-ES')}</span>
                      </div>
                      {event.type === 'note' && <Badge variant="amber">Nota Interna</Badge>}
                      <p className="text-sm text-slate-600 leading-relaxed">{event.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-slate-100">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <textarea
                    placeholder="Escribe una respuesta o nota interna..."
                    className="w-full bg-transparent border-none focus:outline-none text-sm min-h-[100px] resize-none"
                  />
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200/50">
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg">
                        <input type="checkbox" id="internal" className="rounded border-slate-300" />
                        <label htmlFor="internal" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer">Nota Interna</label>
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-2">
                      Enviar Respuesta <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-900">Información del Cliente</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold">
                    {(selectedTicket.client_name ?? '??').split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{selectedTicket.client_name}</p>
                    <p className="text-[10px] text-slate-500">ID: {selectedTicket.client_id}</p>
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Plan</span>
                    <Badge variant="indigo">Pro</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Health Score</span>
                    <span className="text-xs font-bold text-emerald-600">92/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Account Owner</span>
                    <span className="text-xs font-bold text-slate-900">Fernando Admin</span>
                  </div>
                </div>
                <button className="w-full py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold hover:text-indigo-600 transition-colors">Ver Ficha Completa</button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-900">Detalles del Ticket</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asignado a</label>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[8px] font-bold text-indigo-600">
                      {(selectedTicket.assignee_name ?? '?').split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span className="text-sm font-bold text-slate-900">{selectedTicket.assignee_name}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prioridad</label>
                  <Badge variant={selectedTicket.priority === 'critical' ? 'rose' : 'amber'}>{selectedTicket.priority}</Badge>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Creado el</label>
                  <p className="text-sm font-medium text-slate-700">{new Date(selectedTicket.created_at).toLocaleDateString('es-ES')}</p>
                </div>
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
        title="Centro de Soporte"
        description="Gestiona las incidencias, dudas y solicitudes de los clientes de la plataforma."
        actions={
          <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
            <Plus className="w-3 h-3" /> Nuevo Ticket
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Abiertos</p>
          <p className="text-2xl font-black text-rose-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">En Curso</p>
          <p className="text-2xl font-black text-amber-500">8</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pendiente Cliente</p>
          <p className="text-2xl font-black text-indigo-500">5</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tiempo Medio Respuesta</p>
          <p className="text-2xl font-black text-slate-900">45m</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por asunto, ID o cliente..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600/10 w-64 font-medium"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <Badge variant="indigo">Todos</Badge>
            <Badge variant="slate">Míos</Badge>
            <Badge variant="slate">Urgentes</Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="py-4 px-6">ID / Asunto</th>
                <th className="py-4 px-6">Cliente</th>
                <th className="py-4 px-6">Tipo</th>
                <th className="py-4 px-6">Prioridad</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TICKETS.map((ticket) => (
                <tr key={ticket.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900">{ticket.subject}</p>
                      <p className="text-[10px] font-mono text-slate-400">{ticket.id}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-xs font-medium text-slate-700">{ticket.client_name}</td>
                  <td className="py-4 px-6">
                    <Badge variant="slate">{ticket.type}</Badge>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={ticket.priority === 'critical' || ticket.priority === 'high' ? 'rose' : 'slate'}>{ticket.priority}</Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        ticket.status === 'open' ? 'bg-rose-500' :
                        ticket.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />
                      <span className="text-xs font-bold text-slate-700 capitalize">{ticket.status.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
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
  );
};
