/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Check, 
  Shield, 
  Zap, 
  BarChart3, 
  Globe, 
  Users, 
  AlertTriangle, 
  MousePointerClick,
  ChevronRight,
  Menu,
  X,
  Star,
  Building2,
  Calendar,
  CreditCard,
  Search,
  Lock
} from "lucide-react";
import { useState, useEffect } from "react";
import InternalBackoffice from "./InternalBackoffice";

// --- Components ---

const Navbar = ({ onOpenLogin }: { onOpenLogin: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-3 glass shadow-sm" : "py-6 bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Zap className="text-white w-6 h-6" fill="currentColor" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-slate-900">StayNex</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#solucion" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Solución</a>
          <a href="#debacu" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Seguridad</a>
          <a href="#funcionalidades" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Funcionalidades</a>
          <a href="#precios" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Precios</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={onOpenLogin}
            className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors flex items-center gap-2"
          >
            <Lock className="w-4 h-4" /> Acceder
          </button>
          <button className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg active:scale-95">
            Solicitar Demo
          </button>
        </div>

        <button className="md:hidden text-slate-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 flex flex-col gap-4 md:hidden shadow-xl"
          >
            <a href="#solucion" className="text-lg font-medium text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Solución</a>
            <a href="#debacu" className="text-lg font-medium text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Seguridad</a>
            <a href="#funcionalidades" className="text-lg font-medium text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Funcionalidades</a>
            <a href="#precios" className="text-lg font-medium text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Precios</a>
            <hr className="border-slate-100" />
            <button onClick={onOpenLogin} className="w-full py-3 border border-slate-200 rounded-xl font-semibold text-slate-900">Acceder</button>
            <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold">Solicitar Demo</button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-grid">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Star className="w-3 h-3 fill-current" />
            <span>Nueva Era en Gestión Turística</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6"
          >
            Vende más directo. <br />
            <span className="text-gradient">Gestiona con inteligencia.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed"
          >
            StayNex es la plataforma todo-en-uno para alojamientos que quieren recuperar el control, eliminar comisiones y operar con seguridad gracias a la inteligencia de Debacu.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <button className="px-8 py-4 bg-slate-900 text-white rounded-full text-lg font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-indigo-200 flex items-center gap-2 group">
              Empezar ahora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full text-lg font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
              Ver Demo
            </button>
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative max-w-6xl mx-auto"
        >
          <div className="rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden aspect-[16/9] flex">
            {/* Sidebar Mockup */}
            <div className="w-20 md:w-64 border-r border-slate-100 bg-slate-50/50 hidden sm:flex flex-col p-6">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                  <Zap className="text-white w-4 h-4" />
                </div>
                <span className="font-bold hidden md:block">StayNex</span>
              </div>
              <div className="space-y-2">
                {[BarChart3, Calendar, Building2, Users, Shield].map((Icon, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${i === 0 ? "bg-white shadow-sm text-indigo-600" : "text-slate-400"}`}>
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-semibold hidden md:block">
                      {["Dashboard", "Reservas", "Unidades", "Clientes", "Seguridad"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Main Content Mockup */}
            <div className="flex-1 p-6 md:p-10 bg-white overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">Vista General</h3>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100" />
                  <div className="w-8 h-8 rounded-full bg-slate-100" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { label: "Ventas Directas", val: "€12,450", change: "+14%", color: "text-emerald-600" },
                  { label: "Ocupación", val: "84%", change: "+5%", color: "text-emerald-600" },
                  { label: "Ahorro Comisiones", val: "€1,820", change: "+22%", color: "text-indigo-600" },
                ].map((stat, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/30">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold">{stat.val}</span>
                      <span className={`text-xs font-bold ${stat.color}`}>{stat.change}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    Alertas Preventivas Debacu
                  </h4>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">En tiempo real</span>
                </div>
                
                <div className="space-y-4">
                  {[
                    { id: "P-XX234", user: "M**** J.", risk: "Alto", color: "bg-rose-500", text: "text-rose-600", bg: "bg-rose-50" },
                    { id: "P-XX235", user: "E**** S.", risk: "Bajo", color: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" },
                    { id: "P-XX236", user: "R****** L.", risk: "Medio", color: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-50" },
                  ].map((alert, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${alert.color}`} />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{alert.user}</p>
                          <p className="text-xs text-slate-400">Reserva {alert.id}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${alert.bg} ${alert.text}`}>
                        Riesgo {alert.risk}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 p-4 glass rounded-2xl shadow-xl hidden lg:block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Zap className="text-emerald-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">Pago Recibido</p>
                <p className="text-sm font-bold text-slate-800">+€450.00</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const Problem = () => {
  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              ¿Sigues regalando el <span className="text-rose-500">20% de tus ingresos</span> a las OTAs?
            </h2>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
              Depender exclusivamente de Booking o Airbnb no es una estrategia, es una trampa. Pierdes margen, pierdes el contacto con tu cliente y pierdes el control de quién entra en tu propiedad.
            </p>
            
            <div className="space-y-6">
              {[
                { title: "Dependencia de Booking/Airbnb", desc: "Vives bajo sus reglas y sus cambios de algoritmo." },
                { title: "Comisiones abusivas", desc: "Pagos constantes por clientes que podrías captar tú mismo." },
                { title: "Falta de control total", desc: "No eres dueño de los datos de tus clientes ni de tu marca." },
                { title: "Clientes conflictivos", desc: "No sabes quién reserva hasta que ya es demasiado tarde." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center mt-1">
                    <X className="text-rose-500 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/10 blur-[120px]" />
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
                  <AlertTriangle className="text-amber-500 w-8 h-8 mb-4" />
                  <p className="font-bold text-lg mb-1">Inseguridad</p>
                  <p className="text-sm text-slate-400">Sin filtros de riesgo reales.</p>
                </div>
                <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
                  <Users className="text-slate-400 w-8 h-8 mb-4" />
                  <p className="font-bold text-lg mb-1">Sin Datos</p>
                  <p className="text-sm text-slate-400">El cliente es de la plataforma, no tuyo.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
                  <CreditCard className="text-rose-500 w-8 h-8 mb-4" />
                  <p className="font-bold text-lg mb-1">-€2,400/mes</p>
                  <p className="text-sm text-slate-400">En comisiones perdidas.</p>
                </div>
                <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
                  <Zap className="text-indigo-500 w-8 h-8 mb-4" />
                  <p className="font-bold text-lg mb-1 Caos">Caos Operativo</p>
                  <p className="text-sm text-slate-400">Procesos manuales y lentos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Solution = () => {
  return (
    <section id="solucion" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">StayNex: Tu centro de mando</h2>
          <p className="text-lg text-slate-600">
            Una plataforma única diseñada para escalar tu negocio de alquiler vacacional, recuperando el control total de tus unidades.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              icon: MousePointerClick, 
              title: "Reservas Directas", 
              desc: "Convierte tu web en una máquina de ventas sin comisiones. El dinero va directo a tu cuenta.",
              color: "bg-indigo-50 text-indigo-600"
            },
            { 
              icon: Zap, 
              title: "Gestión Simple", 
              desc: "Controla disponibilidad, precios y unidades completas desde un panel intuitivo y rápido.",
              color: "bg-sky-50 text-sky-600"
            },
            { 
              icon: Shield, 
              title: "Seguridad Activa", 
              desc: "Filtra a tus huéspedes antes de que lleguen. Evita problemas antes de que ocurran.",
              color: "bg-emerald-50 text-emerald-600"
            },
            { 
              icon: BarChart3, 
              title: "Control de Negocio", 
              desc: "Métricas reales de rentabilidad, ahorro en comisiones y crecimiento de tu base de clientes.",
              color: "bg-amber-50 text-amber-600"
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${feature.color}`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DebacuSection = () => {
  return (
    <section id="debacu" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/10 blur-[100px]" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Shield className="w-3 h-3" />
                <span>Diferencial Exclusivo StayNex</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Detecta clientes problemáticos <br />
                <span className="text-indigo-400 text-gradient">antes de que lleguen.</span>
              </h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                StayNex integra la tecnología de Debacu para verificar la identidad y el riesgo de cada reserva. Evita fiestas, daños y fraudes con datos reales.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  "Verificación por email, teléfono y documento.",
                  "Alertas de riesgo visuales (Bajo/Medio/Alto).",
                  "Sin mostrar datos sensibles del huésped.",
                  "Prevención real basada en comportamiento previo."
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <Check className="text-indigo-400 w-3 h-3" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <button className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20">
                Solicitar demo de seguridad
              </button>
            </div>
            
            <div className="relative">
              <div className="p-8 rounded-3xl bg-slate-800 border border-slate-700 shadow-2xl">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                      <Shield className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-white font-bold">Análisis de Riesgo</p>
                      <p className="text-xs text-slate-500">Consulta vía Debacu</p>
                    </div>
                  </div>
                  <Search className="text-slate-500 w-5 h-5" />
                </div>
                
                <div className="space-y-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Huésped</span>
                      <span className="text-white font-medium">M**** J.</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Validación</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                      </div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "85%" }}
                        className="h-full bg-rose-500"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-rose-400 text-xs font-bold uppercase">Nivel de Riesgo</span>
                      <span className="text-rose-500 font-black">ALTO</span>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <p className="text-rose-200 text-sm leading-relaxed">
                      <span className="font-bold">Aviso:</span> Este cliente tiene antecedentes de comportamiento conflictivo en 3 unidades de la red.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section id="funcionalidades" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">Todo lo que necesitas para crecer</h2>
          <p className="text-slate-600">Herramientas potentes, lenguaje sencillo. Sin complicaciones técnicas.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              title: "Venta Directa", 
              items: ["Motor de reservas propio", "Pagos online con Stripe", "Sin comisiones por reserva", "Confirmación instantánea"] 
            },
            { 
              title: "Gestión Inteligente", 
              items: ["Control de unidades completas", "Calendario unificado", "Gestión de precios dinámica", "Métricas de rentabilidad"] 
            },
            { 
              title: "Automatización & Seguridad", 
              items: ["Emails automáticos a clientes", "Verificación con Debacu", "Alertas de riesgo en tiempo real", "API para integraciones"] 
            }
          ].map((group, i) => (
            <div key={i} className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 border-l-4 border-indigo-600 pl-4">{group.title}</h3>
              <ul className="space-y-4">
                {group.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-slate-600">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Audience = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Diseñado para propietarios reales</h2>
          <p className="text-slate-600">StayNex se adapta a tu modelo de negocio, no al revés.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Casas Rurales", icon: Building2 },
            { name: "Apartamentos", icon: Globe },
            { name: "Villas de Lujo", icon: Star },
            { name: "Gestores", icon: Users },
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 text-center hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-900">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  return (
    <section id="precios" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Planes claros, sin sorpresas</h2>
          <p className="text-slate-600 mb-8">Ahorra miles de euros en comisiones desde el primer mes.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { 
              name: "BASIC", 
              price: "29", 
              desc: "Ideal para propietarios individuales",
              features: ["1 Propiedad", "Motor de reservas", "Pagos online", "Emails básicos"],
              cta: "Empezar con Basic"
            },
            { 
              name: "PRO", 
              price: "79", 
              desc: "Para quienes buscan automatizar",
              features: ["Hasta 5 unidades", "Automatización completa", "API básica", "Debacu limitado"],
              popular: true,
              cta: "Elegir Pro"
            },
            { 
              name: "PREMIUM", 
              price: "149", 
              desc: "Control total y seguridad máxima",
              features: ["Unidades ilimitadas", "Debacu avanzado", "Métricas de negocio", "Soporte prioritario"],
              cta: "Ir a Premium"
            },
            { 
              name: "ENTERPRISE", 
              price: "Custom", 
              desc: "Soluciones a medida para gestores",
              features: ["Todo ilimitado", "Onboarding dedicado", "Integraciones custom", "SLA garantizado"],
              cta: "Contactar ventas"
            }
          ].map((plan, i) => (
            <div 
              key={i} 
              className={`p-8 rounded-3xl border ${plan.popular ? "bg-slate-900 text-white border-slate-900 shadow-2xl scale-105 z-10" : "bg-white text-slate-900 border-slate-200"}`}
            >
              <h3 className="text-sm font-black tracking-widest uppercase opacity-60 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black">{plan.price !== "Custom" ? `€${plan.price}` : "Custom"}</span>
                {plan.price !== "Custom" && <span className="text-sm opacity-60">/mes</span>}
              </div>
              <p className="text-xs mb-8 opacity-70">{plan.desc}</p>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm">
                    <Check className={`w-4 h-4 ${plan.popular ? "text-emerald-400" : "text-emerald-500"}`} />
                    <span className="opacity-80">{feat}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.popular ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-slate-900 hover:bg-slate-800 text-white"}`}>
                {plan.cta}
              </button>
              
              {plan.price !== "Custom" && (
                <p className="text-[10px] text-center mt-4 opacity-50 font-medium">
                  Ahorro estimado vs Booking: €{parseInt(plan.price) * 5}/mes
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Comparison = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">¿Por qué StayNex?</h2>
          <p className="text-slate-600">Compara y decide por ti mismo.</p>
        </div>
        
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-6 text-sm font-bold text-slate-900">Característica</th>
                <th className="p-6 text-sm font-bold text-indigo-600">StayNex</th>
                <th className="p-6 text-sm font-bold text-slate-400">Booking/Airbnb</th>
                <th className="p-6 text-sm font-bold text-slate-400">Otras herramientas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { label: "Comisiones por reserva", staynex: "0%", others: "15-20%", pms: "1-3%" },
                { label: "Control de datos cliente", staynex: "Total", others: "Nulo", pms: "Parcial" },
                { label: "Prevención de riesgo (Debacu)", staynex: "Sí", others: "No", pms: "No" },
                { label: "Venta Directa", staynex: "Enfocado", others: "No", pms: "Secundario" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6 text-sm font-medium text-slate-700">{row.label}</td>
                  <td className="p-6 text-sm font-bold text-indigo-600">{row.staynex}</td>
                  <td className="p-6 text-sm text-slate-500">{row.others}</td>
                  <td className="p-6 text-sm text-slate-500">{row.pms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const Demos = () => {
  return (
    <section id="demo" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Explora la experiencia StayNex</h2>
          <p className="text-slate-600">Prueba nuestras demos interactivas y descubre el potencial.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="group cursor-pointer">
            <div className="rounded-3xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 mb-6 relative">
              <img 
                src="https://picsum.photos/seed/staynex-public/1200/800" 
                alt="Demo Pública" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <MousePointerClick className="text-slate-900 w-8 h-8" />
                </div>
              </div>
            </div>
            <h4 className="text-2xl font-bold mb-2">Web Pública / Motor de Reservas</h4>
            <p className="text-slate-600">Mira cómo tus clientes verán y reservarán en tu propiedad.</p>
          </div>
          
          <div className="group cursor-pointer">
            <div className="rounded-3xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 mb-6 relative">
              <img 
                src="https://picsum.photos/seed/staynex-admin/1200/800" 
                alt="Demo Panel" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <BarChart3 className="text-slate-900 w-8 h-8" />
                </div>
              </div>
            </div>
            <h4 className="text-2xl font-bold mb-2">Panel de Gestión (Dashboard)</h4>
            <p className="text-slate-600">Explora las herramientas de control, automatización y Debacu.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const CaseStudy = () => {
  return (
    <section className="py-24 bg-indigo-600 text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-10" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              "Recuperamos el control y ahorramos €1,200 el primer mes"
            </h2>
            <p className="text-xl text-indigo-100 mb-10 italic">
              "Antes de StayNex, vivíamos pendientes de las comisiones de Booking. Ahora, el 60% de nuestras reservas son directas y dormimos tranquilos gracias a los avisos de Debacu."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 overflow-hidden">
                <img src="https://picsum.photos/seed/owner/200/200" alt="Owner" referrerPolicy="no-referrer" />
              </div>
              <div>
                <p className="font-bold text-lg">María G.</p>
                <p className="text-indigo-200">Propietaria, Casa Rural La Rasilla</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-[2.5rem] p-8 text-slate-900 shadow-2xl relative">
            <div className="absolute -top-4 -right-4 bg-amber-400 text-slate-900 font-black px-4 py-2 rounded-xl shadow-lg rotate-12">
              CASO REAL
            </div>
            <h4 className="text-2xl font-bold mb-8 text-center">Impacto en 3 meses</h4>
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <Globe className="text-indigo-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold">Venta Directa</p>
                    <p className="text-xs text-slate-400">De 5% a 62%</p>
                  </div>
                </div>
                <span className="text-2xl font-black text-emerald-500">+1,140%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
                    <CreditCard className="text-rose-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold">Comisiones OTAs</p>
                    <p className="text-xs text-slate-400">Ahorro mensual medio</p>
                  </div>
                </div>
                <span className="text-2xl font-black text-rose-500">-€1,240</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                    <Shield className="text-amber-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold">Incidencias</p>
                    <p className="text-xs text-slate-400">Gracias a Debacu</p>
                  </div>
                </div>
                <span className="text-2xl font-black text-slate-900">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ onOpenInternal }: { onOpenInternal: () => void }) => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tighter">StayNex</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              La plataforma premium para la gestión inteligente de alojamientos turísticos.
            </p>
          </div>
          
          <div>
            <h5 className="font-bold mb-6">Producto</h5>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#solucion" className="hover:text-white transition-colors">Venta Directa</a></li>
              <li><a href="#funcionalidades" className="hover:text-white transition-colors">Gestión de Unidades</a></li>
              <li><a href="#debacu" className="hover:text-white transition-colors">Seguridad Debacu</a></li>
              <li><a href="#funcionalidades" className="hover:text-white transition-colors">Automatización</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-bold mb-6">Empresa</h5>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Sobre nosotros</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-bold mb-6">Legal</h5>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
              <li><button onClick={onOpenInternal} className="hover:text-white transition-colors text-left cursor-pointer">Acceso Staff</button></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs">© 2026 StayNex. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            {/* Social Icons Placeholder */}
            <div className="w-5 h-5 bg-slate-800 rounded-full" />
            <div className="w-5 h-5 bg-slate-800 rounded-full" />
            <div className="w-5 h-5 bg-slate-800 rounded-full" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const FinalCTA = () => {
  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-8">¿Listo para recuperar el control?</h2>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
          Únete a los propietarios que ya están vendiendo directo y sin comisiones con StayNex.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-10 py-5 bg-slate-900 text-white rounded-full text-xl font-bold hover:bg-slate-800 transition-all shadow-2xl flex items-center justify-center gap-2 group">
            Solicitar demo
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-full text-xl font-bold hover:bg-slate-50 transition-all">
            Empieza ahora
          </button>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[120px] -z-10 opacity-50" />
    </section>
  );
};

const LandingPage = ({ onOpenLogin, onOpenInternal }: { onOpenLogin: () => void, onOpenInternal: () => void }) => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar onOpenLogin={onOpenLogin} />
      <Hero />
      <Problem />
      <Solution />
      <DebacuSection />
      <Features />
      <Audience />
      <Pricing />
      <Comparison />
      <FinalCTA />
      <Footer onOpenInternal={onOpenInternal} />
    </div>
  );
};

export default function App() {
  return <InternalBackoffice />;
}
