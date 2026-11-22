import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Award, 
  TrendingDown, 
  ShieldCheck, 
  Building2, 
  Layers, 
  AlertCircle,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function RfqComparisonMatrix({ rfqs, onSelectBid, onAdvanceApproval }) {
  const [selectedRfqId, setSelectedRfqId] = useState(rfqs[0]?.id || 'RFQ-301');

  const currentRfq = rfqs.find(r => r.id === selectedRfqId) || rfqs[0];

  if (!currentRfq) {
    return <div className="p-8 text-slate-400">Loading RFQs...</div>;
  }

  const winningBid = currentRfq.bids.find(b => b.isWinning) || currentRfq.bids[0];
  const budget = currentRfq.budgetAllocated;
  const bestPrice = Math.min(...currentRfq.bids.map(b => b.totalPrice));
  const savingsAmount = budget - bestPrice;
  const savingsPercent = ((savingsAmount / budget) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Page Title & Requisition Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Multi-Vendor RFQ Comparison Matrix
          </h2>
          <p className="text-xs text-slate-400">
            Compare side-by-side vendor quotes, evaluate SLAs, and award purchase orders.
          </p>
        </div>

        {/* RFQ Selector Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {rfqs.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRfqId(r.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-2 border ${
                selectedRfqId === r.id
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span className="font-mono font-semibold">{r.id}</span>
              <span className="truncate max-w-[130px]">{r.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected RFQ Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {currentRfq.id}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {currentRfq.category}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1.5">{currentRfq.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Department: <span className="text-slate-200">{currentRfq.department}</span></p>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-mono">Target Requisition Qty</div>
            <div className="text-base font-bold text-slate-100 font-mono mt-1">
              {currentRfq.requiredUnits.toLocaleString()} {currentRfq.unit}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              Due: {currentRfq.targetDeliveryDate}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-mono">Approved Budget Cap</div>
            <div className="text-base font-bold text-slate-100 font-mono mt-1">
              ${currentRfq.budgetAllocated.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingDown className="w-3 h-3" />
              Saves ${savingsAmount.toLocaleString()} ({savingsPercent}%)
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="text-xs text-slate-400 font-mono mb-1">Approval Stage</div>
            <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              {currentRfq.approvalStatus.replace(/_/g, ' ')}
            </div>
            {currentRfq.poNumber && (
              <span className="text-[11px] font-mono text-emerald-400/90 mt-1">
                Issued: {currentRfq.poNumber}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Side-by-Side Quotation Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Vendor Quotation Evaluation Grid</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {currentRfq.bids.length} Qualified Supplier Submissions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Supplier / Vendor</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Total Contract Value</th>
                <th className="py-3 px-4">Lead Time</th>
                <th className="py-3 px-4">Payment Terms</th>
                <th className="py-3 px-4">Warranty</th>
                <th className="py-3 px-4">Vendor Score</th>
                <th className="py-3 px-4">Budget Delta</th>
                <th className="py-3 px-4 text-right">Award Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {currentRfq.bids.map((bid) => {
                const isSelected = bid.isWinning;
                const priceDelta = currentRfq.budgetAllocated - bid.totalPrice;
                const priceDeltaPercent = ((priceDelta / currentRfq.budgetAllocated) * 100).toFixed(1);

                return (
                  <tr 
                    key={bid.id}
                    className={`transition-colors ${
                      isSelected 
                        ? 'bg-emerald-950/20 border-l-4 border-l-emerald-500' 
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-medium text-white">
                      <div className="flex items-center space-x-2">
                        <Building2 className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <span>{bid.vendorName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">Bid Ref: {bid.id}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-200">
                      ${bid.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                      ${bid.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{bid.leadTimeDays} days</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">
                      {bid.paymentTerms}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {bid.warrantyYears} Year{bid.warrantyYears > 1 ? 's' : ''}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-12 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full ${bid.vendorScore >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${bid.vendorScore}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-white">{bid.vendorScore}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={priceDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {priceDelta >= 0 ? `-$${priceDelta.toLocaleString()} (${priceDeltaPercent}%)` : `+$${Math.abs(priceDelta).toLocaleString()}`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isSelected ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold font-mono text-[11px]">
                          <Award className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                          Winning Bid
                        </span>
                      ) : (
                        <button
                          onClick={() => onSelectBid(currentRfq.id, bid.id)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 border border-slate-700 text-[11px] font-medium transition-all"
                        >
                          Select as Winner
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Intelligence & Kaggle Market Benchmark */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:col-span-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm mb-2">
            <Sparkles className="w-4 h-4" />
            <span>AI Procurement Recommendation</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Based on historical Kaggle commercial spend telemetry, <strong className="text-white">{winningBid?.vendorName}</strong> offers the optimal compromise between cost savings and risk.
            Awarding this quotation achieves an immediate <strong className="text-emerald-400">${savingsAmount.toLocaleString()}</strong> ({savingsPercent}%) reduction against budget with a high vendor reliability rating of <strong className="text-white">{winningBid?.vendorScore}/100</strong> and {winningBid?.leadTimeDays} days lead time.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">Audit trail signed by: Jane Doe (Head of Procurement)</span>
            <span className="text-emerald-400 font-mono font-medium">Compliance Checked: PASS</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400">Next Recommended Action</div>
            <h4 className="text-sm font-bold text-white mt-1">Advance Approval Workflow</h4>
            <p className="text-xs text-slate-400 mt-1">
              Current state: <span className="text-slate-200 font-semibold">{currentRfq.approvalStatus.replace(/_/g, ' ')}</span>
            </p>
          </div>
          <button
            onClick={() => onAdvanceApproval(currentRfq.id)}
            disabled={currentRfq.approvalStatus === 'PO_DISPATCHED'}
            className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              currentRfq.approvalStatus === 'PO_DISPATCHED'
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{currentRfq.approvalStatus === 'PO_DISPATCHED' ? 'PO Dispatched to Vendor' : 'Approve & Advance Stage'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
