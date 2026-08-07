export interface RoiInputs {
  // Company baseline
  annualInstalls: number;
  averageJobRevenue: number;
  inventoryValue: number;

  // Cost structure
  laborPercent: number;
  materialPercent: number;
  marketingPercent: number;

  // Inventory improvement
  inventoryReductionPercent: number;
  inventoryCarryingCostPercent: number;

  // Direct operating savings
  warehouseSavings: number;
  freightTransferSavings: number;
  inventoryShrinkSavings: number;
  adminLaborSavings: number;
  reworkSavings: number;

  // Capacity recovery
  capacityLeakagePercent: number;
  sustainableCapacityRecoveryPercent: number;

  // Backlog / cancellation
  backlogCancellationSavings: number;

  // Arvenix investment
  annualArvenixCost: number;
  implementationCost: number;
}

export interface RoiResults {
  contributionMargin: number;

  estimatedLostCapacityInstalls: number;
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

  // Inventory improvement
  inventoryReductionPercent: 0.15,
  inventoryCarryingCostPercent: 0.18,

  // Direct operating savings
  warehouseSavings: 50000,
  freightTransferSavings: 35000,
  inventoryShrinkSavings: 30000,
  adminLaborSavings: 37500,
  reworkSavings: 50000,

  // Capacity recovery
  capacityLeakagePercent: 0.10,
  sustainableCapacityRecoveryPercent: 0.07,

  // Backlog / cancellation
  // Default is zero to avoid double counting recovered capacity.
  backlogCancellationSavings: 0,

  // Arvenix investment
  annualArvenixCost: 75000,
  implementationCost: 50000,
};

export function calculateRoi(inputs: RoiInputs): RoiResults {
  /*
   * FULLY LOADED CONTRIBUTION MARGIN
   *
   * Recovered revenue is not treated dollar-for-dollar as EBITDA.
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
   * CAPACITY LEAKAGE
   *
   * First estimate the portion of current annual install volume
   * affected by operational capacity leakage.
   *
   * Example:
   * 4,000 installs x 10% leakage = 400 install opportunities
   */

  const estimatedLostCapacityInstalls =
    inputs.annualInstalls *
    inputs.capacityLeakagePercent;

  /*
   * SUSTAINABLE CAPACITY RECOVERY
   *
   * Arvenix only receives credit for recovering a percentage of
   * the estimated lost capacity.
   *
   * Example:
   * 400 lost opportunities x 7% recovery = 28 recovered installs
   */

  const recoveredInstalls =
    estimatedLostCapacityInstalls *
    inputs.sustainableCapacityRecoveryPercent;

  /*
   * RECOVERED REVENUE
   */

  const recoveredRevenue =
    recoveredInstalls *
    inputs.averageJobRevenue;

  /*
   * CAPACITY EBITDA CONTRIBUTION
   *
   * Recovered revenue is converted using the fully loaded
   * contribution margin.
   */

  const capacityEbitdaContribution =
    recoveredRevenue *
    contributionMargin;

  /*
   * INVENTORY REDUCTION
   *
   * Inventory reduction represents working capital release.
   * It is not counted as EBITDA.
   */

  const inventoryReduction =
    inputs.inventoryValue *
    inputs.inventoryReductionPercent;

  /*
   * INVENTORY CARRYING COST
   *
   * Only the avoided carrying cost is counted as annual
   * EBITDA improvement.
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
   * NET RECURRING EBITDA IMPACT
   *
   * Annual Arvenix platform expense reduces recurring EBITDA.
   */

  const recurringNetEbitdaImpact =
    grossEbitdaOpportunity -
    inputs.annualArvenixCost;

  /*
   * WORKING CAPITAL
   *
   * Kept separate from EBITDA.
   */

  const workingCapitalReleased =
    inventoryReduction;

  /*
   * YEAR ONE COST
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
   * EBITDA PAYBACK
   *
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

    estimatedLostCapacityInstalls,
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
