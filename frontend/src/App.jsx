import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import RfqComparisonMatrix from './pages/RfqComparisonMatrix';
import ApprovalChainView from './pages/ApprovalChainView';
import SpendAnalyticsView from './pages/SpendAnalyticsView';
import { fetchRfqs, fetchMetrics, advanceApproval, selectWinningBid, fallbackRfqs } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('matrix');
  const [rfqs, setRfqs] = useState(fallbackRfqs);
  const [metrics, setMetrics] = useState({
    totalActiveRfqs: 3,
    totalCommittedSpendUsd: 170700.00,
    averageCostSavingsPercent: 12.8,
    pendingApprovalsCount: 2
  });

  useEffect(() => {
    async function loadData() {
      const r = await fetchRfqs();
      if (r && r.length) setRfqs(r);
      const m = await fetchMetrics();
      if (m) setMetrics(m);
    }
    loadData();
  }, []);

  const handleSelectBid = async (rfqId, bidId) => {
    await selectWinningBid(rfqId, bidId);
    setRfqs(prev => prev.map(r => {
      if (r.id === rfqId) {
        return {
          ...r,
          selectedBidId: bidId,
          bids: r.bids.map(b => ({
            ...b,
            isWinning: b.id === bidId
          }))
        };
      }
      return r;
    }));
  };

  const handleAdvanceApproval = async (rfqId) => {
    await advanceApproval(rfqId);
    const stages = ['REQUISITION_SUBMITTED', 'DEPT_HEAD_REVIEW', 'FINANCE_DIRECTOR_APPROVED', 'PO_DISPATCHED'];
    setRfqs(prev => prev.map(r => {
      if (r.id === rfqId) {
        const curIdx = stages.indexOf(r.approvalStatus);
        if (curIdx < stages.length - 1) {
          const nextStage = stages[curIdx + 1];
          return {
            ...r,
            approvalStatus: nextStage,
            poNumber: nextStage === 'PO_DISPATCHED' && !r.poNumber ? `PO-2026-${Math.floor(1000 + Math.random() * 9000)}` : r.poNumber
          };
        }
      }
      return r;
    }));
  };

  const committedSpend = rfqs.reduce((acc, r) => {
    const winning = r.bids.find(b => b.isWinning) || r.bids[0];
    return acc + (winning ? winning.totalPrice : 0);
  }, 0);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar activeRfqsCount={rfqs.length} committedSpend={committedSpend} />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'matrix' && (
              <RfqComparisonMatrix 
                rfqs={rfqs} 
                onSelectBid={handleSelectBid} 
                onAdvanceApproval={handleAdvanceApproval} 
              />
            )}
            {activeTab === 'approvals' && (
              <ApprovalChainView 
                rfqs={rfqs} 
                onAdvanceApproval={handleAdvanceApproval} 
              />
            )}
            {activeTab === 'analytics' && (
              <SpendAnalyticsView 
                metrics={metrics} 
                rfqs={rfqs} 
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
