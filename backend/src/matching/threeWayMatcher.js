/**
 * Automated 3-Way Matching & Invoice Reconciliation Engine
 * Reconciles Purchase Orders (PO), Goods Receipt Notes (GRN), and Vendor Invoices (INV)
 * to prevent overbilling, unauthorized charges, and phantom inventory disbursements.
 */

class ThreeWayMatchingEngine {
  constructor(options = {}) {
    this.priceTolerancePct = options.priceTolerancePct !== undefined ? options.priceTolerancePct : 2.0; // 2% tolerance
    this.qtyTolerancePct = options.qtyTolerancePct !== undefined ? options.qtyTolerancePct : 0.0;     // 0% tolerance on qty
    this.autoApproveThresholdUsd = options.autoApproveThresholdUsd || 10000.0;
  }

  /**
   * Reconciles PO, Goods Receipt, and Invoice across all line items
   * @param {Object} po - Authorized Purchase Order
   * @param {Object} grn - Warehouse Goods Receipt Note (physical intake confirmation)
   * @param {Object} invoice - Vendor Commercial Invoice
   * @returns {Object} Reconciliation outcome, line item audit, and payment clearance status
   */
  reconcile(po, grn, invoice) {
    const discrepancies = [];
    let totalAuthorizedUsd = 0;
    let totalInvoicedUsd = 0;
    let totalReceivedUsd = 0;

    const poItemsMap = new Map((po.items || []).map(i => [i.sku, i]));
    const grnItemsMap = new Map((grn.items || []).map(i => [i.sku, i]));

    const auditedLineItems = (invoice.items || []).map(invItem => {
      const poItem = poItemsMap.get(invItem.sku);
      const grnItem = grnItemsMap.get(invItem.sku);

      totalInvoicedUsd += invItem.quantity * invItem.unitPrice;

      // 1. Check for Unauthorized / Phantom SKU
      if (!poItem) {
        const error = `SKU ${invItem.sku} is NOT present in authorized PO #${po.id}`;
        discrepancies.push({ sku: invItem.sku, type: 'UNAUTHORIZED_ITEM', message: error });
        return {
          sku: invItem.sku,
          status: 'UNAUTHORIZED',
          invoicedQty: invItem.quantity,
          invoicedUnitPrice: invItem.unitPrice,
          authorizedQty: 0,
          authorizedUnitPrice: 0,
          receivedQty: 0,
          discrepancy: error
        };
      }

      totalAuthorizedUsd += poItem.quantity * poItem.unitPrice;
      const receivedQty = grnItem ? grnItem.receivedQuantity : 0;
      totalReceivedUsd += receivedQty * poItem.unitPrice;

      let lineStatus = 'MATCHED';
      const itemDiscrepancies = [];

      // 2. Unit Price Variance Check (PO Unit Price vs Invoice Unit Price)
      const priceDiff = invItem.unitPrice - poItem.unitPrice;
      const priceVariancePct = (priceDiff / poItem.unitPrice) * 100.0;

      if (priceVariancePct > this.priceTolerancePct) {
        lineStatus = 'PRICE_VARIANCE';
        const msg = `Unit price $${invItem.unitPrice} exceeds contracted PO price $${poItem.unitPrice} (+${priceVariancePct.toFixed(2)}%)`;
        itemDiscrepancies.push(msg);
        discrepancies.push({ sku: invItem.sku, type: 'PRICE_VARIANCE', message: msg, varianceUsd: priceDiff * invItem.quantity });
      }

      // 3. Quantity Discrepancy Check (Billed Qty vs physically Received Qty)
      if (invItem.quantity > receivedQty) {
        lineStatus = 'QUANTITY_EXCESS';
        const unreceivedQty = invItem.quantity - receivedQty;
        const msg = `Invoiced quantity (${invItem.quantity}) exceeds warehouse received goods (${receivedQty}) by ${unreceivedQty} units`;
        itemDiscrepancies.push(msg);
        discrepancies.push({ sku: invItem.sku, type: 'UNRECEIVED_GOODS', message: msg, exposureUsd: unreceivedQty * invItem.unitPrice });
      }

      return {
        sku: invItem.sku,
        description: poItem.description || invItem.description,
        status: lineStatus,
        authorizedQty: poItem.quantity,
        receivedQty,
        invoicedQty: invItem.quantity,
        authorizedUnitPrice: poItem.unitPrice,
        invoicedUnitPrice: invItem.unitPrice,
        priceVariancePct: Math.round(priceVariancePct * 100) / 100,
        discrepancies: itemDiscrepancies
      };
    });

    // Check for items on PO that were unbilled
    po.items?.forEach(poItem => {
      if (!invoice.items?.some(invItem => invItem.sku === poItem.sku)) {
        auditedLineItems.push({
          sku: poItem.sku,
          description: poItem.description,
          status: 'UNBILLED',
          authorizedQty: poItem.quantity,
          receivedQty: grnItemsMap.get(poItem.sku)?.receivedQuantity || 0,
          invoicedQty: 0,
          authorizedUnitPrice: poItem.unitPrice,
          invoicedUnitPrice: 0,
          priceVariancePct: 0,
          discrepancies: ['Item authorized on PO but omitted from vendor invoice']
        });
      }
    });

    // Determine Final Clearance Decision
    let matchDecision = 'AUTO_CLEARED_FOR_PAYMENT';
    if (discrepancies.length > 0) {
      const hasUnauthorized = discrepancies.some(d => d.type === 'UNAUTHORIZED_ITEM');
      const hasUnreceived = discrepancies.some(d => d.type === 'UNRECEIVED_GOODS');
      const hasPriceVariance = discrepancies.some(d => d.type === 'PRICE_VARIANCE');

      if (hasUnauthorized) {
        matchDecision = 'BLOCKED_FRAUD_RISK';
      } else if (hasUnreceived && hasPriceVariance) {
        matchDecision = 'HELD_PRICE_AND_QUANTITY_VARIANCE';
      } else if (hasUnreceived) {
        matchDecision = 'HELD_PENDING_GOODS_RECEIPT';
      } else {
        matchDecision = 'HELD_PRICE_TOLERANCE_EXCEEDED';
      }
    }

    return {
      matchDecision,
      isClearedForDisbursement: matchDecision === 'AUTO_CLEARED_FOR_PAYMENT',
      summary: {
        poId: po.id,
        grnId: grn.id,
        invoiceId: invoice.id,
        totalAuthorizedUsd: Math.round(totalAuthorizedUsd * 100) / 100,
        totalReceivedUsd: Math.round(totalReceivedUsd * 100) / 100,
        totalInvoicedUsd: Math.round(totalInvoicedUsd * 100) / 100,
        netVarianceUsd: Math.round((totalInvoicedUsd - totalReceivedUsd) * 100) / 100,
        discrepancyCount: discrepancies.length
      },
      discrepancies,
      auditedLineItems,
      reconciledAt: new Date().toISOString()
    };
  }
}

export default ThreeWayMatchingEngine;
export { ThreeWayMatchingEngine };
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThreeWayMatchingEngine;
}
