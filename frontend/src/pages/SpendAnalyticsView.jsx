import React from 'react';
import { 
  BarChart3, 
  TrendingDown, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  ArrowUpRight,
  PieChart
} from 'lucide-react';

export default function SpendAnalyticsView({ metrics, rfqs }) {
  const categoryBreakdown = [
    { name: 'Chemicals & Polymers', amount: 108000, percent: 63.3, color: 'bg-emerald-500' },
    { name: 'IT Infrastructure', amount: 48500, percent: 28.4, color: 'bg-blue-500' },
    { name: 'Packaging Operations', amount: 14200, percent: 8.3, color: 'bg-amber-500' }
  ];

  const vendorRatings = [
    { name: 'Global Polymers Ltd', score: 96, spend: '$108,000', onTimeRate: '98.5%' },
    { name: 'Vanguard Server Racks Corp', score: 94, spend: '$48,500', onTimeRate: '99.0%' },
    { name: 'Midwest Packaging Co', score: 92, spend: '$14,200', onTimeRate: '95.2%' },
    { name: 'Apex Industrial Hardware', score: 88, spend: '$0 (Bidder)', onTimeRate: '92.0%' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          Spend & Savings KPI Intelligence
        </h2>
        <p className="text-xs text-slate-400">
          Analytics derived from Kaggle B2B Procurement & Freight Benchmark dataset.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">Total Active RFQs</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">3</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% Sourced & Quoted
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">Total Committed Spend</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">$170,700.00</div>
          <div className="text-[11px] text-slate-400 mt-1">Across 3 business units</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">Average Cost Savings</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">12.8%</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> $24,300 below budget
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">Audit Compliance</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">99.4%</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Zero unapproved spend
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Spend Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-400" />
            Spend Distribution by Procurement Category
          </h3>
          <div className="space-y-4">
            {categoryBreakdown.map(cat => (
              <div key={cat.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">{cat.name}</span>
                  <span className="text-slate-200 font-mono font-bold">${cat.amount.toLocaleString()} ({cat.percent}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Supplier Scorecard */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Top Supplier Reliability Scorecard
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="pb-2">Supplier</th>
                  <th className="pb-2">Score</th>
                  <th className="pb-2">Spend</th>
                  <th className="pb-2 text-right">On-Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {vendorRatings.map(v => (
                  <tr key={v.name} className="py-2">
                    <td className="py-2.5 text-white font-sans font-medium">{v.name}</td>
                    <td className="py-2.5 text-emerald-400 font-bold">{v.score}</td>
                    <td className="py-2.5 text-slate-300">{v.spend}</td>
                    <td className="py-2.5 text-right text-emerald-400">{v.onTimeRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
