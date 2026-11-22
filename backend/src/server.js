import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { initialRFQs, initialProcurementStats } from './data.js';

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

let rfqs = [...initialRFQs];
let stats = { ...initialProcurementStats };

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'ProcureFlow Enterprise Procurement & RFQ Engine',
    timestamp: new Date().toISOString()
  });
});

// Summary metrics
app.get('/api/v1/procurement/metrics', (req, res) => {
  const totalActive = rfqs.length;
  const pendingApprovals = rfqs.filter(r => r.approvalStatus !== 'PO_DISPATCHED').length;
  const committedSpend = rfqs.reduce((acc, r) => {
    const winningBid = r.bids.find(b => b.isWinning) || r.bids[0];
    return acc + (winningBid ? winningBid.totalPrice : 0);
  }, 0);

  res.json({
    totalActiveRfqs: totalActive,
    totalCommittedSpendUsd: committedSpend,
    averageCostSavingsPercent: 12.8,
    pendingApprovalsCount: pendingApprovals
  });
});

// List RFQs
app.get('/api/v1/rfqs', (req, res) => {
  res.json(rfqs);
});

// Get single RFQ
app.get('/api/v1/rfqs/:id', (req, res) => {
  const rfq = rfqs.find(r => r.id === req.params.id);
  if (!rfq) {
    return res.status(404).json({ error: 'RFQ not found' });
  }
  res.json(rfq);
});

// Select Winning Bid
app.post('/api/v1/rfqs/:id/select-bid', (req, res) => {
  const { bidId } = req.body;
  const rfq = rfqs.find(r => r.id === req.params.id);
  if (!rfq) {
    return res.status(404).json({ error: 'RFQ not found' });
  }

  rfq.bids.forEach(b => {
    b.isWinning = (b.id === bidId);
  });
  rfq.selectedBidId = bidId;

  res.json({ message: 'Winning vendor bid updated successfully', rfq });
});

// Advance Approval Chain Stage
const APPROVAL_STAGES = [
  'REQUISITION_SUBMITTED',
  'DEPT_HEAD_REVIEW',
  'FINANCE_DIRECTOR_APPROVED',
  'PO_DISPATCHED'
];

app.post('/api/v1/rfqs/:id/advance-approval', (req, res) => {
  const rfq = rfqs.find(r => r.id === req.params.id);
  if (!rfq) {
    return res.status(404).json({ error: 'RFQ not found' });
  }

  const currentIndex = APPROVAL_STAGES.indexOf(rfq.approvalStatus);
  if (currentIndex < APPROVAL_STAGES.length - 1) {
    rfq.approvalStatus = APPROVAL_STAGES[currentIndex + 1];
    if (rfq.approvalStatus === 'PO_DISPATCHED' && !rfq.poNumber) {
      rfq.poNumber = `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    }
  }

  res.json({
    message: `RFQ ${rfq.id} advanced to ${rfq.approvalStatus}`,
    rfq
  });
});

// Create new RFQ
app.post('/api/v1/rfqs', (req, res) => {
  const { title, category, department, requiredUnits, unit, budgetAllocated, targetDeliveryDate } = req.body;
  const newRfq = {
    id: `RFQ-${Math.floor(300 + Math.random() * 699)}`,
    title: title || 'Bulk Requisition Order',
    category: category || 'General Procurement',
    department: department || 'Operations',
    requiredUnits: Number(requiredUnits) || 100,
    unit: unit || 'units',
    targetDeliveryDate: targetDeliveryDate || '2027-01-30',
    approvalStatus: 'REQUISITION_SUBMITTED',
    poNumber: null,
    budgetAllocated: Number(budgetAllocated) || 25000,
    selectedBidId: null,
    bids: []
  };

  rfqs.unshift(newRfq);
  res.status(201).json(newRfq);
});

app.listen(PORT, () => {
  console.log(`ProcureFlow Procurement backend running on http://localhost:${PORT}`);
});
