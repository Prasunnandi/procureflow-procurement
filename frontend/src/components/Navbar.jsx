import React from 'react';
import { Bell, Search, Shield, Building, Filter } from 'lucide-react';

export default function Navbar({ activeRfqsCount, committedSpend }) {
  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search RFQs, Purchase Orders, Suppliers..."
            className="w-80 bg-slate-800/80 border border-slate-700/60 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded border border-slate-700/40">
          <Building className="w-3.5 h-3.5 text-emerald-400" />
          <span>Entity: Global Manufacturing Corp (US-East)</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="text-[11px] text-slate-400 font-mono">Active Committed Spend</div>
          <div className="text-sm font-bold text-emerald-400 font-mono">
            ${committedSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="h-7 w-[1px] bg-slate-800"></div>

        <button className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
        </button>

        <div className="flex items-center space-x-2 pl-2">
          <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-xs font-bold text-emerald-300">
            JD
          </div>
          <div className="text-left text-xs">
            <div className="font-semibold text-slate-200">Jane Doe</div>
            <div className="text-[10px] text-slate-400">Head of Procurement</div>
          </div>
        </div>
      </div>
    </header>
  );
}
