export interface RoiInputs {
  // Company baseline
  annualInstalls: number;
  averageJobRevenue: number;
  inventoryValue: number;

  // Cost structure
  laborPercent: number;
  materialPercent: number;
  marketingPercent: number;

  // Inventory and operating improvement
  inventoryReductionPercent: number;
  inventoryCarryingCostPercent: number;

  warehouseSavings: number;
  freightTransferSavings: number;
  inventoryShrinkSavings: number;
  adminLaborSavings: number;
  reworkSavings: number;

  // Sustainable capacity recovery
  sustainableCapacityRecoveryPercent: number;

  // Backlog recovery
  backlogCancellationSavings: number;

  // Arvenix investment
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

  directOperatingSavings: number;

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
  // Company baseline
  annualInstalls: 4000,
  averageJobRevenue: 15000,
  inventoryValue: 8000000,

  // Cost structure
  laborPercent: 0.15,
  materialPercent: 0.27,
  marketingPercent: 0.20,

  // Inventory
  inventoryReductionPercent: 0.15,
  inventoryCarryingCostPercent: 0.18,

  // Operating improvements
  warehouseSavings: 50000,
  freightTransferSavings: 35000,
  inventoryShrinkSavings: 30000,
  adminLaborSavings: 37500,
  reworkSavings: 50000,

  // Sustainable capacity recovery
  sustainableCapacityRecoveryPercent: 0.07,

  // Backlog recovery
  // Zero by default to avoid double counting capacity recovery
  backlogCancellationSavings: 0,

  // Arvenix investment
  annualArvenixCost: 75000,
  implementationCost: 50000,
};

export function calculateRoi(inputs: RoiInputs): RoiResults {
  /*
   * CONTRIBUTION MARGIN
   *
   * Recovered revenue is not treated as EBITDA.
   *
   * Revenue
   * less labor
   * less materials
   * less marketing
   * equals contribution available toward EBITDA.
   */

  const contributionMargin = Math.max(
    0,
    1 -
      inputs.laborPercent -
      inputs.materialPercent -
      inputs.marketingPercent
  );

  /*
   * SUSTAINABLE CAPACITY RECOVERY
   *
   * Based on a percentage of existing annual installation volume,
   * not theoretical maximum technician capacity.
   */

  const recoveredInstalls =
    inputs.annualInstalls *
    inputs.sustainableCapacityRecoveryPercent;

  const recoveredRevenue =
    recoveredInstalls *
    inputs.averageJobRevenue;

  const capacityEbitdaContribution =
    recoveredRevenue *
    contributionMargin;

  /*
   * INVENTORY
   *
   * Inventory reduction is working capital release.
   * It is not EBITDA.
   */

  const inventoryReduction =
    inputs.inventoryValue *
    inputs.inventoryReductionPercent;

  /*
   * Only avoided inventory carrying cost is included
   * as an annual EBITDA improvement.
   */

  const inventoryCarryingCostSavings =
    inventoryReduction *
    inputs.inventoryCarryingCostPercent;

  /*
   * DIRECT OPERATING SAVINGS
   */

  const directOperatingSavings =
    inventoryCarryingCostSavings +
    inputs.warehouseSavings +
    inputs.freightTransferSavings +
    inputs.inventoryShrinkSavings +
    inputs.adminLaborSavings +
    inputs.reworkSavings +
    inputs.backlogCancellationSavings;

  /*
   * GROSS EBITDA OPPORTUNITY
   */

  const grossEbitdaOpportunity =
    directOperatingSavings +
    capacityEbitdaContribution;

  /*
   * RECURRING EBITDA IMPACT
   */

  const recurringNetEbitdaImpact =
    grossEbitdaOpportunity -
    inputs.annualArvenixCost;

  /*
   * WORKING CAPITAL
   */

  const workingCapitalReleased =
    inventoryReduction;

  /*
   * YEAR ONE INVESTMENT
   */

  const yearOneCost =
    inputs.annualArvenixCost +
    inputs.implementationCost;

  /*
   * YEAR ONE NET BENEFIT
   */

  const yearOneNetBenefit =
    grossEbitdaOpportunity -
    yearOneCost;

  /*
   * YEAR ONE ROI
   */

  const yearOneRoi =
    yearOneCost > 0
      ? yearOneNetBenefit / yearOneCost
      : 0;

  /*
   * RECURRING ROI
   */

  const recurringRoi =
    inputs.annualArvenixCost > 0
      ? recurringNetEbitdaImpact /
        inputs.annualArvenixCost
      : 0;

  /*
   * PAYBACK
   *
   * Based on EBITDA benefit only.
   * Working capital release is intentionally excluded.
   */

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

    directOperatingSavings,

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
