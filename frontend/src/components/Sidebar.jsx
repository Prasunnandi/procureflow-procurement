import React from 'react';
import { 
  FileText, 
  CheckSquare, 
  Layers, 
  TrendingDown, 
  Building2, 
  ShieldCheck, 
  BarChart3,
  ExternalLink
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'matrix', label: 'RFQ Comparison Matrix', icon: Layers, badge: 'Core' },
    { id: 'approvals', label: 'Multi-Tier Approvals', icon: CheckSquare, badge: '2 Pending' },
    { id: 'analytics', label: 'Spend & Savings KPI', icon: BarChart3 }
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Brand */}
        <div className="h-16 px-6 flex items-center space-x-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shadow-inner">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-1.5">
              ProcureFlow
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Enterprise
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">B2B RFQ & PO Hub</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 px-3 py-2 uppercase tracking-wider">
            Procurement Lifecycle
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm' 
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center space-x-3 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Audit-Compliant PO v2.8</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500">
          Connected to Kaggle Industrial Spend Benchmark
        </div>
      </div>
    </aside>
  );
}
