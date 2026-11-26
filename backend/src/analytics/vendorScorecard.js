/**
 * Enterprise Vendor Performance Scorecard Engine
 * Evaluates suppliers on On-Time In-Full (OTIF) Delivery, Quality & Defect Rates,
 * Price/Invoice Compliance, and Customer SLA Responsiveness.
 */

export const VENDOR_TIERS = {
  STRATEGIC_PREFERRED: { tier: 'Tier 1', label: 'STRATEGIC_PREFERRED', minScore: 90 },
  APPROVED_PERFORMING: { tier: 'Tier 2', label: 'APPROVED_PERFORMING', minScore: 75 },
  CONDITIONAL_AT_RISK: { tier: 'Tier 3', label: 'CONDITIONAL_AT_RISK', minScore: 60 },
  PROBATION_DISQUALIFIED: { tier: 'Tier 4', label: 'PROBATION_DISQUALIFIED', minScore: 0 }
};

export class VendorScorecardEngine {
  /**
   * @param {Object} [options]
   * @param {Object} [options.weights] - Custom scoring dimensions weights
   * @param {number} [options.weights.otif=0.35] - On-Time Delivery weight (35%)
   * @param {number} [options.weights.quality=0.35] - Quality & Low Defect weight (35%)
   * @param {number} [options.weights.priceCompliance=0.20] - Invoice Price Compliance weight (20%)
   * @param {number} [options.weights.responsiveness=0.10] - Communication SLA weight (10%)
   */
  constructor(options = {}) {
    const w = options.weights || {};
    this.weightOtif = w.otif ?? 0.35;
    this.weightQuality = w.quality ?? 0.35;
    this.weightPrice = w.priceCompliance ?? 0.20;
    this.weightResp = w.responsiveness ?? 0.10;
  }

  /**
   * Calculate composite vendor rating from delivery orders and quality records
   * @param {Object} vendorData
   * @param {string} vendorData.vendorId - Supplier ID
   * @param {string} vendorData.vendorName - Supplier corporate name
   * @param {Array<Object>} vendorData.deliveries - PO fulfillment logs [{ poId, scheduledDate, deliveredDate, orderedQty, receivedQty }]
   * @param {Array<Object>} vendorData.qualityInspections - [{ inspectionId, totalUnits, defectiveUnits }]
   * @param {Array<Object>} vendorData.invoices - [{ invoiceId, poAmount, invoiceAmount, variance }]
   * @param {number} [vendorData.averageResponseHours=12] - Supplier average acknowledgment time
   * @returns {Object} Comprehensive scorecard rating, tier status, and corrective action flags
   */
  evaluateVendor(vendorData) {
    const { vendorId, vendorName, deliveries = [], qualityInspections = [], invoices = [], averageResponseHours = 24 } = vendorData;

    // 1. OTIF Score (0 - 100)
    let onTimeCount = 0;
    deliveries.forEach(d => {
      const scheduled = new Date(d.scheduledDate);
      const actual = new Date(d.deliveredDate);
      const isFull = (d.receivedQty || 0) >= (d.orderedQty || 0);
      const isOnTime = actual <= scheduled;
      if (isOnTime && isFull) onTimeCount++;
    });
    const otifScore = deliveries.length > 0 ? (onTimeCount / deliveries.length) * 100 : 100;

    // 2. Quality Score (0 - 100)
    let totalInspected = 0;
    let totalDefects = 0;
    qualityInspections.forEach(q => {
      totalInspected += (q.totalUnits || 0);
      totalDefects += (q.defectiveUnits || 0);
    });
    const defectRatePct = totalInspected > 0 ? (totalDefects / totalInspected) * 100 : 0;
    // Score: 100 minus defect rate penalties (e.g. 1% defect = 90 score, 5%+ defect = 50 score)
    const qualityScore = Math.max(0, 100 - (defectRatePct * 10));

    // 3. Price & Invoice Compliance Score (0 - 100)
    let compliantInvoices = 0;
    invoices.forEach(inv => {
      const variancePct = inv.poAmount > 0 ? Math.abs(inv.invoiceAmount - inv.poAmount) / inv.poAmount : 0;
      if (variancePct <= 0.02) compliantInvoices++; // Within 2% acceptable variance
    });
    const priceComplianceScore = invoices.length > 0 ? (compliantInvoices / invoices.length) * 100 : 100;

    // 4. Responsiveness Score (0 - 100)
    // SLA target: < 24 hours = 100%, 48h = 70%, > 72h = 40%
    const respScore = Math.max(0, Math.min(100, 120 - (averageResponseHours * 1.5)));

    // Composite Weighted Score
    const compositeScore = (otifScore * this.weightOtif) +
                          (qualityScore * this.weightQuality) +
                          (priceComplianceScore * this.weightPrice) +
                          (respScore * this.weightResp);

    const roundedScore = Number(compositeScore.toFixed(1));

    // Determine Tier
    let assignedTier = VENDOR_TIERS.PROBATION_DISQUALIFIED;
    if (roundedScore >= VENDOR_TIERS.STRATEGIC_PREFERRED.minScore) {
      assignedTier = VENDOR_TIERS.STRATEGIC_PREFERRED;
    } else if (roundedScore >= VENDOR_TIERS.APPROVED_PERFORMING.minScore) {
      assignedTier = VENDOR_TIERS.APPROVED_PERFORMING;
    } else if (roundedScore >= VENDOR_TIERS.CONDITIONAL_AT_RISK.minScore) {
      assignedTier = VENDOR_TIERS.CONDITIONAL_AT_RISK;
    }

    // Corrective Action Requests (CAR)
    const correctiveActionRecommendations = [];
    if (otifScore < 80) correctiveActionRecommendations.push('Issue formal Carrier & Logistics SLA warning for sub-80% OTIF delivery rate');
    if (qualityScore < 80) correctiveActionRecommendations.push(`Quality alert: Defect rate (${defectRatePct.toFixed(2)}%) exceeds tolerance; mandate vendor factory inspection audit`);
    if (priceComplianceScore < 85) correctiveActionRecommendations.push('Audit recurring invoice price variance mismatch with procurement pricing agreement');

    return {
      vendorId,
      vendorName,
      compositeScore: roundedScore,
      tier: assignedTier.label,
      tierBadge: assignedTier.tier,
      dimensions: {
        otifRatePct: Number(otifScore.toFixed(1)),
        qualityScorePct: Number(qualityScore.toFixed(1)),
        defectRatePct: Number(defectRatePct.toFixed(2)),
        priceCompliancePct: Number(priceComplianceScore.toFixed(1)),
        responsivenessScorePct: Number(respScore.toFixed(1))
      },
      correctiveActions: correctiveActionRecommendations,
      evaluatedDeliveriesCount: deliveries.length,
      evaluatedInvoicesCount: invoices.length
    };
  }
}

export default VendorScorecardEngine;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VendorScorecardEngine;
  module.exports.VendorScorecardEngine = VendorScorecardEngine;
  module.exports.VENDOR_TIERS = VENDOR_TIERS;
}
