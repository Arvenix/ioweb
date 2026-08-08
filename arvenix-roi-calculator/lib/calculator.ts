//
// ARVENIX FINANCIAL VALUE CREATION MODEL
//
// Designed around CFO / FP&A / PE underwriting principles.
//
// Key rules:
//
// 1. Gross profit is separated from operating expenses.
// 2. Marketing is NOT included in COGS.
// 3. Existing backlog recovery does NOT incur marketing again.
// 4. Inventory reduction is working capital, NOT EBITDA.
// 5. Inventory carrying cost is NOT automatically counted as EBITDA.
// 6. EBITDA improvements must come from identifiable P&L savings.
// 7. Revenue recovery is converted through contribution margin.
// 8. Enterprise value creation is shown separately from ROI.
//

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------

export type Scenario =
  | "conservative"
  | "base"
  | "upside";

export interface RoiInputs {
  // ----------------------------------------------------------
  // COMPANY BASELINE
  // ----------------------------------------------------------

  annualInstalls: number;
  averageJobRevenue: number;

  // Current company EBITDA
  currentEbitda: number;

  // ----------------------------------------------------------
  // GROSS PROFIT STRUCTURE
  // ----------------------------------------------------------

  materialPercent: number;
  directLaborPercent: number;
  otherDirectCogsPercent: number;

  // Marketing sits below gross profit
  marketingPercent: number;

  // ----------------------------------------------------------
  // INVENTORY / WORKING CAPITAL
  // ----------------------------------------------------------

  averageInventory: number;

  // Target improvement in inventory turns
  targetInventoryTurns: number;

  // ----------------------------------------------------------
  // MATERIAL PROCUREMENT
  // ----------------------------------------------------------

  // Example: 1% lower material acquisition cost
  materialProcurementImprovementPercent: number;

  // ----------------------------------------------------------
  // SHRINK / OBSOLESCENCE
  // ----------------------------------------------------------

  annualShrinkObsolescenceCost: number;
  shrinkObsolescenceReductionPercent: number;

  // ----------------------------------------------------------
  // FREIGHT / TRANSFERS
  // ----------------------------------------------------------

  annualFreightTransferCost: number;
  freightTransferReductionPercent: number;

  // ----------------------------------------------------------
  // REWORK / REPEAT TRIPS
  // ----------------------------------------------------------

  annualReworkRepeatTripCost: number;
  reworkReductionPercent: number;

  // ----------------------------------------------------------
  // WAREHOUSE
  // ----------------------------------------------------------

  annualWarehouseCost: number;
  warehouseCostReductionPercent: number;

  // ----------------------------------------------------------
  // ADMINISTRATIVE LABOR
  // ----------------------------------------------------------

  annualAdminLaborCost: number;
  adminLaborReductionPercent: number;

  // ----------------------------------------------------------
  // ADDRESSABLE BACKLOG / INSTALLATION RECOVERY
  // ----------------------------------------------------------

  // Jobs management believes are actually recoverable.
  //
  // This should NOT include:
  // credit declines
  // rescission
  // true customer cancellations
  // uncontrollable losses
  //
  addressableOperationalGapJobs: number;

  // Percentage of those addressable jobs Arvenix is expected
  // to recover.
  operationalGapRecoveryPercent: number;

  // ----------------------------------------------------------
  // ARVENIX INVESTMENT
  // ----------------------------------------------------------

  annualArvenixCost: number;
  implementationCost: number;
  internalImplementationCost: number;

  // ----------------------------------------------------------
  // VALUATION
  // ----------------------------------------------------------

  lowEbitdaMultiple: number;
  baseEbitdaMultiple: number;
  highEbitdaMultiple: number;
}

export interface RoiResults {
  scenario: Scenario;

  // ----------------------------------------------------------
  // BASELINE P&L
  // ----------------------------------------------------------

  annualRevenue: number;

  annualMaterialCogs: number;
  annualDirectLaborCogs: number;
  annualOtherDirectCogs: number;

  totalDirectCogs: number;

  grossProfit: number;
  grossMargin: number;

  annualMarketingExpense: number;

  currentEbitda: number;
  currentEbitdaMargin: number;

  // ----------------------------------------------------------
  // INVENTORY
  // ----------------------------------------------------------

  currentInventoryTurns: number;

  targetInventory: number;

  workingCapitalReleased: number;

  // ----------------------------------------------------------
  // EBITDA VALUE CREATION LEVERS
  // ----------------------------------------------------------

  materialProcurementSavings: number;

  shrinkObsolescenceSavings: number;

  freightTransferSavings: number;

  reworkSavings: number;

  warehouseSavings: number;

  adminLaborSavings: number;

  // ----------------------------------------------------------
  // BACKLOG / REVENUE RECOVERY
  // ----------------------------------------------------------

  recoveredJobs: number;

  recoveredRevenue: number;

  existingBacklogContributionMargin: number;

  recoveredRevenueContribution: number;

  // ----------------------------------------------------------
  // EBITDA
  // ----------------------------------------------------------

  directOperatingSavings: number;

  grossAnnualEbitdaImprovement: number;

  recurringNetEbitdaImprovement: number;

  proFormaEbitda: number;

  proFormaEbitdaMargin: number;

  // ----------------------------------------------------------
  // INVESTMENT / ROI
  // ----------------------------------------------------------

  yearOneInvestment: number;

  yearOneNetBenefit: number;

  yearOneRoi: number;

  recurringRoi: number;

  paybackMonths: number;

  // ----------------------------------------------------------
  // ENTERPRISE VALUE
  // ----------------------------------------------------------

  enterpriseValueLow: number;

  enterpriseValueBase: number;

  enterpriseValueHigh: number;
}

// ------------------------------------------------------------
// DEFAULT ASSUMPTIONS
// ------------------------------------------------------------

export const defaultInputs: RoiInputs = {
  // ----------------------------------------------------------
  // COMPANY BASELINE
  // ----------------------------------------------------------

  annualInstalls: 4000,

  averageJobRevenue: 19100,

  // Illustrative 10% EBITDA margin.
  // Customer should replace this with actual EBITDA.
  currentEbitda: 7640000,

  // ----------------------------------------------------------
  // GROSS PROFIT STRUCTURE
  // ----------------------------------------------------------

  // 22% materials
  materialPercent: 0.22,

  // 15% direct installer labor
  directLaborPercent: 0.15,

  // Freight directly tied to jobs, permits, disposal,
  // commissions classified in COGS, etc.
  //
  // This brings modeled gross margin to 55%.
  otherDirectCogsPercent: 0.08,

  // Marketing is an operating expense.
  marketingPercent: 0.20,

  // ----------------------------------------------------------
  // INVENTORY
  // ----------------------------------------------------------

  averageInventory: 8000000,

  // Current turns at the baseline are approximately 2.1x.
  //
  // Moving to 2.5x is the initial base underwriting case.
  targetInventoryTurns: 2.5,

  // ----------------------------------------------------------
  // MATERIAL PROCUREMENT
  // ----------------------------------------------------------

  // 1% improvement against material COGS.
  materialProcurementImprovementPercent: 0.01,

  // ----------------------------------------------------------
  // SHRINK / OBSOLESCENCE
  // ----------------------------------------------------------

  annualShrinkObsolescenceCost: 150000,

  shrinkObsolescenceReductionPercent: 0.20,

  // ----------------------------------------------------------
  // FREIGHT / TRANSFERS
  // ----------------------------------------------------------

  annualFreightTransferCost: 250000,

  freightTransferReductionPercent: 0.15,

  // ----------------------------------------------------------
  // REWORK
  // ----------------------------------------------------------

  annualReworkRepeatTripCost: 400000,

  reworkReductionPercent: 0.15,

  // ----------------------------------------------------------
  // WAREHOUSE
  // ----------------------------------------------------------

  annualWarehouseCost: 750000,

  warehouseCostReductionPercent: 0.05,

  // ----------------------------------------------------------
  // ADMINISTRATIVE LABOR
  // ----------------------------------------------------------

  annualAdminLaborCost: 600000,

  adminLaborReductionPercent: 0.05,

  // ----------------------------------------------------------
  // ADDRESSABLE OPERATIONAL GAP
  // ----------------------------------------------------------

  // Example:
  //
  // 4,500 sold
  // 4,000 completed
  // 500 gross gap
  //
  // Remove rescission, credit failure, true customer
  // cancellations, etc.
  //
  // Assume 150 are operationally addressable.
  //
  addressableOperationalGapJobs: 150,

  // Base underwriting assumes Arvenix contributes to the
  // recovery of 20% of those jobs.
  operationalGapRecoveryPercent: 0.20,

  // ----------------------------------------------------------
  // ARVENIX INVESTMENT
  // ----------------------------------------------------------

  annualArvenixCost: 75000,

  implementationCost: 50000,

  internalImplementationCost: 25000,

  // ----------------------------------------------------------
  // PE VALUATION
  // ----------------------------------------------------------

  lowEbitdaMultiple: 6,

  baseEbitdaMultiple: 8,

  highEbitdaMultiple: 10,
};

// ------------------------------------------------------------
// SCENARIO FACTORS
// ------------------------------------------------------------
//
// We do NOT change the customer's baseline financials.
//
// Scenario factors only change the amount of improvement
// Arvenix is assumed to capture.
//
// Conservative = 75% of base case
// Base         = 100%
// Upside       = 125%
//
// The upside factor is capped when applied to percentages.
//

const scenarioFactors: Record<Scenario, number> = {
  conservative: 0.75,
  base: 1,
  upside: 1.25,
};

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

function clamp(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.min(
    Math.max(value, minimum),
    maximum
  );
}

function safeDivide(
  numerator: number,
  denominator: number
): number {
  if (denominator === 0) {
    return 0;
  }

  return numerator / denominator;
}

// ------------------------------------------------------------
// CALCULATOR
// ------------------------------------------------------------

export function calculateRoi(
  inputs: RoiInputs,
  scenario: Scenario = "base"
): RoiResults {
  const factor =
    scenarioFactors[scenario];

  // ==========================================================
  // BASELINE REVENUE
  // ==========================================================

  const annualRevenue =
    inputs.annualInstalls *
    inputs.averageJobRevenue;

  // ==========================================================
  // BASELINE COGS
  // ==========================================================

  const annualMaterialCogs =
    annualRevenue *
    inputs.materialPercent;

  const annualDirectLaborCogs =
    annualRevenue *
    inputs.directLaborPercent;

  const annualOtherDirectCogs =
    annualRevenue *
    inputs.otherDirectCogsPercent;

  const totalDirectCogs =
    annualMaterialCogs +
    annualDirectLaborCogs +
    annualOtherDirectCogs;

  // ==========================================================
  // GROSS PROFIT
  // ==========================================================

  const grossProfit =
    annualRevenue -
    totalDirectCogs;

  const grossMargin =
    safeDivide(
      grossProfit,
      annualRevenue
    );

  // ==========================================================
  // MARKETING
  // ==========================================================

  const annualMarketingExpense =
    annualRevenue *
    inputs.marketingPercent;

  // ==========================================================
  // CURRENT EBITDA
  // ==========================================================

  const currentEbitda =
    inputs.currentEbitda;

  const currentEbitdaMargin =
    safeDivide(
      currentEbitda,
      annualRevenue
    );

  // ==========================================================
  // INVENTORY TURNS
  // ==========================================================
  //
  // Material consumption is used here rather than revenue.
  //
  // Inventory Turns =
  //
  // Annual Material COGS
  // --------------------
  // Average Inventory
  //

  const currentInventoryTurns =
    safeDivide(
      annualMaterialCogs,
      inputs.averageInventory
    );

  // ==========================================================
  // TARGET INVENTORY
  // ==========================================================
  //
  // Target Inventory =
  //
  // Annual Material COGS
  // --------------------
  // Target Turns
  //

  const targetInventory =
    inputs.targetInventoryTurns > 0
      ? annualMaterialCogs /
        inputs.targetInventoryTurns
      : inputs.averageInventory;

  // ==========================================================
  // WORKING CAPITAL RELEASE
  // ==========================================================
  //
  // This is NOT EBITDA.
  //
  // We do not allow inventory "release" to become negative.
  //

  const workingCapitalReleased =
    Math.max(
      0,
      inputs.averageInventory -
        targetInventory
    );

  // ==========================================================
  // MATERIAL PROCUREMENT SAVINGS
  // ==========================================================
  //
  // Base calculation:
  //
  // Annual Material Spend
  // x Procurement Improvement
  //

  const adjustedMaterialImprovement =
    clamp(
      inputs.materialProcurementImprovementPercent *
        factor,
      0,
      1
    );

  const materialProcurementSavings =
    annualMaterialCogs *
    adjustedMaterialImprovement;

  // ==========================================================
  // SHRINK / OBSOLESCENCE
  // ==========================================================

  const adjustedShrinkReduction =
    clamp(
      inputs.shrinkObsolescenceReductionPercent *
        factor,
      0,
      1
    );

  const shrinkObsolescenceSavings =
    inputs.annualShrinkObsolescenceCost *
    adjustedShrinkReduction;

  // ==========================================================
  // FREIGHT / TRANSFERS
  // ==========================================================

  const adjustedFreightReduction =
    clamp(
      inputs.freightTransferReductionPercent *
        factor,
      0,
      1
    );

  const freightTransferSavings =
    inputs.annualFreightTransferCost *
    adjustedFreightReduction;

  // ==========================================================
  // REWORK
  // ==========================================================

  const adjustedReworkReduction =
    clamp(
      inputs.reworkReductionPercent *
        factor,
      0,
      1
    );

  const reworkSavings =
    inputs.annualReworkRepeatTripCost *
    adjustedReworkReduction;

  // ==========================================================
  // WAREHOUSE
  // ==========================================================

  const adjustedWarehouseReduction =
    clamp(
      inputs.warehouseCostReductionPercent *
        factor,
      0,
      1
    );

  const warehouseSavings =
    inputs.annualWarehouseCost *
    adjustedWarehouseReduction;

  // ==========================================================
  // ADMIN LABOR
  // ==========================================================

  const adjustedAdminReduction =
    clamp(
      inputs.adminLaborReductionPercent *
        factor,
      0,
      1
    );

  const adminLaborSavings =
    inputs.annualAdminLaborCost *
    adjustedAdminReduction;

  // ==========================================================
  // ADDRESSABLE OPERATIONAL RECOVERY
  // ==========================================================
  //
  // Unlike the old model, we DO NOT say:
  //
  // installs x arbitrary leakage % x recovery %
  //
  // Management must first identify how many jobs are actually
  // operationally addressable.
  //
  // Then Arvenix receives credit for recovering a conservative
  // percentage of that addressable pool.
  //

  const adjustedGapRecovery =
    clamp(
      inputs.operationalGapRecoveryPercent *
        factor,
      0,
      1
    );

  const recoveredJobs =
    inputs.addressableOperationalGapJobs *
    adjustedGapRecovery;

  const recoveredRevenue =
    recoveredJobs *
    inputs.averageJobRevenue;

  // ==========================================================
  // EXISTING BACKLOG CONTRIBUTION MARGIN
  // ==========================================================
  //
  // Marketing has already been incurred on sold backlog.
  //
  // Therefore we use gross margin rather than deducting the
  // marketing percentage again.
  //

  const existingBacklogContributionMargin =
    grossMargin;

  const recoveredRevenueContribution =
    recoveredRevenue *
    existingBacklogContributionMargin;

  // ==========================================================
  // DIRECT OPERATING SAVINGS
  // ==========================================================

  const directOperatingSavings =
    materialProcurementSavings +
    shrinkObsolescenceSavings +
    freightTransferSavings +
    reworkSavings +
    warehouseSavings +
    adminLaborSavings;

  // ==========================================================
  // GROSS ANNUAL EBITDA IMPROVEMENT
  // ==========================================================

  const grossAnnualEbitdaImprovement =
    directOperatingSavings +
    recoveredRevenueContribution;

  // ==========================================================
  // NET RECURRING EBITDA IMPROVEMENT
  // ==========================================================

  const recurringNetEbitdaImprovement =
    grossAnnualEbitdaImprovement -
    inputs.annualArvenixCost;

  // ==========================================================
  // PRO FORMA EBITDA
  // ==========================================================

  const proFormaEbitda =
    currentEbitda +
    recurringNetEbitdaImprovement;

  const proFormaEbitdaMargin =
    safeDivide(
      proFormaEbitda,
      annualRevenue
    );

  // ==========================================================
  // YEAR ONE INVESTMENT
  // ==========================================================

  const yearOneInvestment =
    inputs.annualArvenixCost +
    inputs.implementationCost +
    inputs.internalImplementationCost;

  // ==========================================================
  // YEAR ONE NET BENEFIT
  // ==========================================================

  const yearOneNetBenefit =
    grossAnnualEbitdaImprovement -
    yearOneInvestment;

  // ==========================================================
  // YEAR ONE ROI
  // ==========================================================

  const yearOneRoi =
    safeDivide(
      yearOneNetBenefit,
      yearOneInvestment
    );

  // ==========================================================
  // RECURRING ROI
  // ==========================================================

  const recurringRoi =
    safeDivide(
      recurringNetEbitdaImprovement,
      inputs.annualArvenixCost
    );

  // ==========================================================
  // PAYBACK
  // ==========================================================
  //
  // Working capital is intentionally excluded.
  //
  // Payback is based only on recurring EBITDA creation.
  //

  const monthlyGrossEbitdaImprovement =
    grossAnnualEbitdaImprovement /
    12;

  const paybackMonths =
    monthlyGrossEbitdaImprovement > 0
      ? yearOneInvestment /
        monthlyGrossEbitdaImprovement
      : 0;

  // ==========================================================
  // ENTERPRISE VALUE CREATION
  // ==========================================================
  //
  // Uses NET sustainable recurring EBITDA improvement.
  //
  // Working capital is NOT included here.
  //
  // These values should be labeled illustrative.
  //

  const enterpriseValueLow =
    recurringNetEbitdaImprovement *
    inputs.lowEbitdaMultiple;

  const enterpriseValueBase =
    recurringNetEbitdaImprovement *
    inputs.baseEbitdaMultiple;

  const enterpriseValueHigh =
    recurringNetEbitdaImprovement *
    inputs.highEbitdaMultiple;

  // ==========================================================
  // RETURN
  // ==========================================================

  return {
    scenario,

    annualRevenue,

    annualMaterialCogs,
    annualDirectLaborCogs,
    annualOtherDirectCogs,

    totalDirectCogs,

    grossProfit,
    grossMargin,

    annualMarketingExpense,

    currentEbitda,
    currentEbitdaMargin,

    currentInventoryTurns,

    targetInventory,

    workingCapitalReleased,

    materialProcurementSavings,

    shrinkObsolescenceSavings,

    freightTransferSavings,

    reworkSavings,

    warehouseSavings,

    adminLaborSavings,

    recoveredJobs,

    recoveredRevenue,

    existingBacklogContributionMargin,

    recoveredRevenueContribution,

    directOperatingSavings,

    grossAnnualEbitdaImprovement,

    recurringNetEbitdaImprovement,

    proFormaEbitda,

    proFormaEbitdaMargin,

    yearOneInvestment,

    yearOneNetBenefit,

    yearOneRoi,

    recurringRoi,

    paybackMonths,

    enterpriseValueLow,

    enterpriseValueBase,

    enterpriseValueHigh,
  };
}
