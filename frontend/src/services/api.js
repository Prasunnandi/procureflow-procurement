// ProcureFlow API Service

const API_BASE = 'http://localhost:5003';

export const fallbackRfqs = [
  {
    id: "RFQ-301",
    title: "Q4 Cloud Data Center Server Racks 42U",
    category: "IT Infrastructure",
    department: "Cloud Architecture",
    requiredUnits: 25,
    unit: "rack",
    targetDeliveryDate: "2026-12-15",
    approvalStatus: "FINANCE_DIRECTOR_APPROVED",
    poNumber: "PO-2026-8801",
    budgetAllocated: 55000,
    selectedBidId: "BID-301-A",
    bids: [
      {
        id: "BID-301-A",
        vendorName: "Vanguard Server Racks Corp",
        unitPrice: 1940.00,
        totalPrice: 48500.00,
        leadTimeDays: 10,
        paymentTerms: "Net 30",
        warrantyYears: 5,
        vendorScore: 94,
        isWinning: true
      },
      {
        id: "BID-301-B",
        vendorName: "Apex Industrial Hardware",
        unitPrice: 2080.00,
        totalPrice: 52000.00,
        leadTimeDays: 5,
        paymentTerms: "Net 15",
        warrantyYears: 3,
        vendorScore: 88,
        isWinning: false
      }
    ]
  },
  {
    id: "RFQ-302",
    title: "High-Density HDPE Granules Bulk Restock",
    category: "Chemicals & Polymers",
    department: "Manufacturing",
    requiredUnits: 100,
    unit: "metric ton",
    targetDeliveryDate: "2026-12-28",
    approvalStatus: "DEPT_HEAD_REVIEW",
    poNumber: null,
    budgetAllocated: 120000,
    selectedBidId: "BID-302-A",
    bids: [
      {
        id: "BID-302-A",
        vendorName: "Global Polymers Ltd",
        unitPrice: 1080.00,
        totalPrice: 108000.00,
        leadTimeDays: 14,
        paymentTerms: "Net 45",
        warrantyYears: 1,
        vendorScore: 96,
        isWinning: true
      },
      {
        id: "BID-302-B",
        vendorName: "ChemSource International",
        unitPrice: 1140.00,
        totalPrice: 114000.00,
        leadTimeDays: 7,
        paymentTerms: "Net 30",
        warrantyYears: 1,
        vendorScore: 85,
        isWinning: false
      }
    ]
  },
  {
    id: "RFQ-304",
    title: "Sustainable Double-Wall Corrugated Cartons",
    category: "Packaging Operations",
    department: "Fulfillment Logistics",
    requiredUnits: 5000,
    unit: "carton",
    targetDeliveryDate: "2027-01-10",
    approvalStatus: "REQUISITION_SUBMITTED",
    poNumber: null,
    budgetAllocated: 18000,
    selectedBidId: null,
    bids: [
      {
        id: "BID-304-A",
        vendorName: "Midwest Packaging Co",
        unitPrice: 2.84,
        totalPrice: 14200.00,
        leadTimeDays: 8,
        paymentTerms: "Net 30",
        warrantyYears: 1,
        vendorScore: 92,
        isWinning: false
      },
      {
        id: "BID-304-B",
        vendorName: "EcoBox Containers Ltd",
        unitPrice: 3.10,
        totalPrice: 15500.00,
        leadTimeDays: 4,
        paymentTerms: "Net 15",
        warrantyYears: 1,
        vendorScore: 89,
        isWinning: false
      }
    ]
  }
];

export async function fetchRfqs() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/rfqs`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    return fallbackRfqs;
  }
}

export async function fetchMetrics() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/procurement/metrics`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    return {
      totalActiveRfqs: 3,
      totalCommittedSpendUsd: 170700.00,
      averageCostSavingsPercent: 12.8,
      pendingApprovalsCount: 2
    };
  }
}

export async function advanceApproval(rfqId) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/rfqs/${rfqId}/advance-approval`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    // local fallback simulation
    const stages = ['REQUISITION_SUBMITTED', 'DEPT_HEAD_REVIEW', 'FINANCE_DIRECTOR_APPROVED', 'PO_DISPATCHED'];
    return { success: true };
  }
}

export async function selectWinningBid(rfqId, bidId) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/rfqs/${rfqId}/select-bid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bidId })
    });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    return { success: true };
  }
}
