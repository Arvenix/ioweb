export interface RoiInputs {
  // Company operating assumptions
  annualInstalls: number;
  averageJobRevenue: number;

  // Cost structure
  laborPercent: number;
  materialPercent: number;
  marketingPercent: number;

  // Inventory
  inventoryValue: number;
  inventoryReductionPercent: number;
  inventoryCarryingCostPercent: number;

  // Sustainable capacity recovery
  sustainableCapacityRecoveryPercent: number;

  // Other annual EBITDA opportunities
  warehouseSavings: number;
  freightTransferSavings: number;
  inventoryShrinkSavings: number;
  adminLaborSavings: number;
  reworkSavings: number;
  backlogCancellationSavings: number;

  // Arvenix costs
  annualArvenixCost: number;
  implementationCost: number;
}

export interface RoiResults {
  contributionMargin: number;

  recoveredInstalls: number;
  recoveredRevenue: number;
  capacityEbitdaContribution: number;

  inventoryReduction: number;
  inventoryCarryingCostSavings: number;

  grossEbitdaOpportunity: number;
  recurringNetEbitdaImpact: number;

  workingCapitalReleased: number;

  yearOneCost: number;
  yearOneNetBenefit: number;
  yearOneRoi: number;
  recurringRoi: number;
  paybackMonths: number;
}

export const defaultInputs: RoiInputs = {
  // Operating assumptions
  annualInstalls: 4000,
  averageJobRevenue: 15000,

  // Cost structure
  laborPercent: 0.15,
  materialPercent: 0.27,
  marketingPercent: 0.20,

  // Inventory assumptions
  inventoryValue: 8000000,
  inventoryReductionPercent: 0.15,
  inventoryCarryingCostPercent: 0.18,

  // Default sustainable recovery
  sustainableCapacityRecoveryPercent: 0.07,

  // Other EBITDA opportunities
  warehouseSavings: 50000,
  freightTransferSavings: 35000,
  inventoryShrinkSavings: 30000,
  adminLaborSavings: 37500,
  reworkSavings: 50000,

  // Keep this separate from capacity recovery
  backlogCancellationSavings: 0,

  // Arvenix pricing assumptions
  annualArvenixCost: 75000,
  implementationCost: 50000,
};

export function calculateRoi(inputs: RoiInputs): RoiResults {
  // Fully loaded contribution margin.
  // 100% - Labor - Materials - Marketing
  const contributionMargin =
    1 -
    inputs.laborPercent -
    inputs.materialPercent -
    inputs.marketingPercent;

  // Sustainable capacity recovery.
  // Arvenix does NOT assume theoretical technician capacity.
  // It assumes a percentage of EXISTING annual installation volume
  // can be sustainably recovered through better operational execution.
  const recoveredInstalls =
    inputs.annualInstalls *
    inputs.sustainableCapacityRecoveryPercent;

  // Revenue associated with recovered installation capacity.
  const recoveredRevenue =
    recoveredInstalls *
    inputs.averageJobRevenue;

  // Only contribution margin is credited to EBITDA.
  // We do NOT treat recovered revenue as EBITDA.
  const capacityEbitdaContribution =
    recoveredRevenue *
    contributionMargin;

  // Inventory reduction is primarily a working-capital benefit.
  const inventoryReduction =
    inputs.inventoryValue *
    inputs.inventoryReductionPercent;

  // Only avoided inventory carrying cost flows into EBITDA.
  const inventoryCarryingCostSavings =
    inventoryReduction *
    inputs.inventoryCarryingCostPercent;

  // Total annual EBITDA opportunity before Arvenix subscription.
  const grossEbitdaOpportunity =
    capacityEbitdaContribution +
    inventoryCarryingCostSavings +
    inputs.warehouseSavings +
    inputs.freightTransferSavings +
    inputs.inventoryShrinkSavings +
    inputs.adminLaborSavings +
    inputs.reworkSavings +
    inputs.backlogCancellationSavings;

  // Recurring EBITDA impact after annual Arvenix expense.
  const recurringNetEbitdaImpact =
    grossEbitdaOpportunity -
    inputs.annualArvenixCost;

  // Inventory reduction releases cash but is NOT EBITDA.
  const workingCapitalReleased =
    inventoryReduction;

  // First-year Arvenix investment.
  const yearOneCost =
    inputs.annualArvenixCost +
    inputs.implementationCost;

  // Year-one EBITDA benefit after Arvenix costs.
  const yearOneNetBenefit =
    grossEbitdaOpportunity -
    yearOneCost;

  const yearOneRoi =
    yearOneCost > 0
      ? yearOneNetBenefit / yearOneCost
      : 0;

  const recurringRoi =
    inputs.annualArvenixCost > 0
      ? recurringNetEbitdaImpact /
        inputs.annualArvenixCost
      : 0;

  // Payback based on EBITDA benefit only.
  // Working-capital release is intentionally excluded.
  const monthlyGrossEbitda =
    grossEbitdaOpportunity / 12;

  const paybackMonths =
    monthlyGrossEbitda > 0
      ? yearOneCost / monthlyGrossEbitda
      : 0;

  return {
    contributionMargin,

    recoveredInstalls,
    recoveredRevenue,
    capacityEbitdaContribution,

    inventoryReduction,
    inventoryCarryingCostSavings,

    grossEbitdaOpportunity,
    recurringNetEbitdaImpact,

    workingCapitalReleased,

    yearOneCost,
    yearOneNetBenefit,
    yearOneRoi,
    recurringRoi,
    paybackMonths,
  };
}
