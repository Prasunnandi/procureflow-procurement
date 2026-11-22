import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Building2, 
  Send, 
  FileCheck2, 
  ShieldCheck, 
  DollarSign 
} from 'lucide-react';

const STAGES = [
  { key: 'REQUISITION_SUBMITTED', title: 'Requisition Submitted', role: 'Procurement Specialist', desc: 'Item specs, quantities, and initial supplier RFQ solicitation.' },
  { key: 'DEPT_HEAD_REVIEW', title: 'Department Head Review', role: 'Business Unit Director', desc: 'Technical feasibility and operational necessity verification.' },
  { key: 'FINANCE_DIRECTOR_APPROVED', title: 'Finance Approval', role: 'Finance Director / CFO', desc: 'Capital expenditure sign-off and cost-center allocation.' },
  { key: 'PO_DISPATCHED', title: 'PO Dispatched', role: 'Automated ERP Gateway', desc: 'Legally binding PO transmitted to vendor EDI & warehouse receiving.' }
];

export default function ApprovalChainView({ rfqs, onAdvanceApproval }) {
  const getStageIndex = (status) => {
    return STAGES.findIndex(s => s.key === status);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Multi-Tier Procurement Approval Workflows
        </h2>
        <p className="text-xs text-slate-400">
          Enforce corporate compliance, prevent rogue spending, and track multi-stage sign-offs.
        </p>
      </div>

      <div className="space-y-4">
        {rfqs.map(rfq => {
          const currentStageIndex = getStageIndex(rfq.approvalStatus);
          const isComplete = rfq.approvalStatus === 'PO_DISPATCHED';

          return (
            <div key={rfq.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {rfq.id}
                  </span>
                  <h3 className="text-base font-bold text-white">{rfq.title}</h3>
                  <span className="text-xs text-slate-400">({rfq.department})</span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right text-xs">
                    <span className="text-slate-400">Committed Value: </span>
                    <span className="text-emerald-400 font-bold font-mono">
                      ${(rfq.bids.find(b => b.isWinning)?.totalPrice || rfq.budgetAllocated).toLocaleString()}
                    </span>
                  </div>
                  {!isComplete && (
                    <button
                      onClick={() => onAdvanceApproval(rfq.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow"
                    >
                      Advance to Next Stage
                    </button>
                  )}
                  {isComplete && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      PO Dispatched: {rfq.poNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Workflow Stepper Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {STAGES.map((stage, idx) => {
                  const isPassed = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  const isFuture = idx > currentStageIndex;

                  return (
                    <div 
                      key={stage.key}
                      className={`p-3.5 rounded-lg border transition-all ${
                        isCurrent 
                          ? 'bg-emerald-950/20 border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/30' 
                          : isPassed 
                            ? 'bg-slate-950/60 border-slate-800/80 text-slate-300' 
                            : 'bg-slate-950/30 border-slate-800/40 opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          isPassed 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : isCurrent 
                              ? 'bg-amber-500/20 text-amber-300 animate-pulse' 
                              : 'bg-slate-800 text-slate-400'
                        }`}>
                          STAGE 0{idx + 1}
                        </span>

                        {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {isCurrent && <Clock className="w-4 h-4 text-amber-400" />}
                      </div>

                      <div className="font-bold text-xs text-white mb-0.5">{stage.title}</div>
                      <div className="text-[11px] text-emerald-400/90 font-mono mb-1.5">{stage.role}</div>
                      <p className="text-[11px] text-slate-400 leading-tight">{stage.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
