import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const Badge = ({ children, variant = 'default', ...props }: { children: React.ReactNode, variant?: string, [key: string]: any }) => {
  const variants: Record<string, string> = {
    default: 'bg-slate-100 text-slate-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    rose: 'bg-rose-100 text-rose-700',
    amber: 'bg-amber-100 text-amber-700',
    sky: 'bg-sky-100 text-sky-700',
    slate: 'bg-slate-100 text-slate-500',
  };
  return (
    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
};

export const MetricCard = ({ title, value, trend, trendValue, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
        <Icon className="w-5 h-5 text-slate-600" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trendValue}
        </div>
      )}
    </div>
    <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
    <h3 className="text-2xl font-bold text-slate-900 font-mono">{value}</h3>
  </div>
);

export const SectionHeader = ({ title, description, actions }: any) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
    <div>
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
      {description && <p className="text-slate-500 text-sm mt-1">{description}</p>}
    </div>
    <div className="flex items-center gap-3">
      {actions}
    </div>
  </div>
);
