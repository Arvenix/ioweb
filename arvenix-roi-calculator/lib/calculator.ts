export type Scenario = "conservative" | "base" | "upside";

export interface ScenarioAssumptions {
  materialProcurementImprovementPercent: number;
  shrinkObsolescenceReductionPercent: number;
  freightTransferReductionPercent: number;
  reworkReductionPercent: number;
  warehouseCostReductionPercent: number;
  adminLaborReductionPercent: number;
  operationalGapRecoveryPercent: number;
  targetInventoryTurns: number;
}

export interface RoiInputs {
  annualInstalls: number;
  averageJobRevenue: number;
  currentEbitda: number;

  materialPercent: number;
  directLaborPercent: number;
  otherDirectCogsPercent: number;
  marketingPercent: number;

  recoveredJobContributionMarginPercent: number;

  averageInventory: number;

  annualShrinkObsolescenceCost: number;
  annualFreightTransferCost: number;
  annualReworkRepeatTripCost: number;
  annualWarehouseCost: number;
  annualAdminLaborCost: number;

  addressableOperationalGapJobs: number;

  conservative: ScenarioAssumptions;
  base: ScenarioAssumptions;
  upside: ScenarioAssumptions;

  annualArvenixCost: number;
  implementationCost: number;
  internalImplementationCost: number;

  lowEbitdaMultiple: number;
  baseEbitdaMultiple: number;
  highEbitdaMultiple: number;
}

export interface RoiResults {
  scenario: Scenario;

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

  currentInventoryTurns: number;
  targetInventoryTurns: number;
  targetInventory: number;
  workingCapitalReleased: number;

  materialProcurementImprovementPercent: number;
  shrinkObsolescenceReductionPercent: number;
  freightTransferReductionPercent: number;
  reworkReductionPercent: number;
  warehouseCostReductionPercent: number;
  adminLaborReductionPercent: number;
  operationalGapRecoveryPercent: number;

  materialProcurementSavings: number;
  shrinkObsolescenceSavings: number;
  freightTransferSavings: number;
  reworkSavings: number;
  warehouseSavings: number;
  adminLaborSavings: number;

  directOperatingSavings: number;

  recoveredJobs: number;
  recoveredRevenue: number;
  recoveredJobContributionMargin: number;
  recoveredRevenueContribution: number;

  grossAnnualEbitdaImprovement: number;
  recurringNetEbitdaImprovement: number;

  proFormaEbitda: number;
  proFormaEbitdaMargin: number;

  upfrontImplementationInvestment: number;
  yearOneInvestment: number;

  yearOneNetBenefit: number;
  yearOneRoi: number;

  annualNetRecurringBenefit: number;
  recurringRoi: number;

  benefitCostRatio: number;
  paybackMonths: number;

  enterpriseValueLow: number;
  enterpriseValueBase: number;
  enterpriseValueHigh: number;
}

export const defaultInputs: RoiInputs = {
  annualInstalls: 4000,
  averageJobRevenue: 19100,
  currentEbitda: 7640000,

  materialPercent: 0.22,
  directLaborPercent: 0.15,
  otherDirectCogsPercent: 0.08,
  marketingPercent: 0.20,

  recoveredJobContributionMarginPercent: 0.55,

  averageInventory: 8000000,

  annualShrinkObsolescenceCost: 150000,
  annualFreightTransferCost: 250000,
  annualReworkRepeatTripCost: 400000,
  annualWarehouseCost: 750000,
  annualAdminLaborCost: 600000,

  addressableOperationalGapJobs: 150,

  conservative: {
    materialProcurementImprovementPercent: 0.005,
    shrinkObsolescenceReductionPercent: 0.10,
    freightTransferReductionPercent: 0.05,
    reworkReductionPercent: 0.05,
    warehouseCostReductionPercent: 0.02,
    adminLaborReductionPercent: 0.02,
    operationalGapRecoveryPercent: 0.10,
    targetInventoryTurns: 2.25,
  },

  base: {
    materialProcurementImprovementPercent: 0.01,
    shrinkObsolescenceReductionPercent: 0.20,
    freightTransferReductionPercent: 0.15,
    reworkReductionPercent: 0.15,
    warehouseCostReductionPercent: 0.05,
    adminLaborReductionPercent: 0.05,
    operationalGapRecoveryPercent: 0.20,
    targetInventoryTurns: 2.50,
  },

  upside: {
    materialProcurementImprovementPercent: 0.015,
    shrinkObsolescenceReductionPercent: 0.30,
    freightTransferReductionPercent: 0.25,
    reworkReductionPercent: 0.25,
    warehouseCostReductionPercent: 0.08,
    adminLaborReductionPercent: 0.08,
    operationalGapRecoveryPercent: 0.30,
    targetInventoryTurns: 2.75,
  },

  annualArvenixCost: 75000,
  implementationCost: 50000,
  internalImplementationCost: 25000,

  lowEbitdaMultiple: 6,
  baseEbitdaMultiple: 8,
  highEbitdaMultiple: 10,
};

function safeDivide(numerator: number, denominator: number): number {
  if (denominator === 0) {
    return 0;
  }

  return numerator / denominator;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

export function calculateRoi(
  inputs: RoiInputs,
  scenario: Scenario = "base"
): RoiResults {
  const assumptions = inputs[scenario];

  const annualRevenue =
    inputs.annualInstalls * inputs.averageJobRevenue;

  const annualMaterialCogs =
    annualRevenue * inputs.materialPercent;

  const annualDirectLaborCogs =
    annualRevenue * inputs.directLaborPercent;

  const annualOtherDirectCogs =
    annualRevenue * inputs.otherDirectCogsPercent;

  const totalDirectCogs =
    annualMaterialCogs +
    annualDirectLaborCogs +
    annualOtherDirectCogs;

  const grossProfit =
    annualRevenue - totalDirectCogs;

  const grossMargin =
    safeDivide(grossProfit, annualRevenue);

  const annualMarketingExpense =
    annualRevenue * inputs.marketingPercent;

  const currentEbitda =
    inputs.currentEbitda;

  const currentEbitdaMargin =
    safeDivide(currentEbitda, annualRevenue);

  const currentInventoryTurns =
    safeDivide(annualMaterialCogs, inputs.averageInventory);

  const targetInventoryTurns =
    assumptions.targetInventoryTurns;

  const targetInventory =
    targetInventoryTurns > 0
      ? annualMaterialCogs / targetInventoryTurns
      : inputs.averageInventory;

  const workingCapitalReleased =
    Math.max(0, inputs.averageInventory - targetInventory);

  const materialProcurementImprovementPercent =
    clamp(
      assumptions.materialProcurementImprovementPercent,
      0,
      1
    );

  const materialProcurementSavings =
    annualMaterialCogs *
    materialProcurementImprovementPercent;

  const shrinkObsolescenceReductionPercent =
    clamp(
      assumptions.shrinkObsolescenceReductionPercent,
      0,
      1
    );

  const shrinkObsolescenceSavings =
    inputs.annualShrinkObsolescenceCost *
    shrinkObsolescenceReductionPercent;

  const freightTransferReductionPercent =
    clamp(
      assumptions.freightTransferReductionPercent,
      0,
      1
    );

  const freightTransferSavings =
    inputs.annualFreightTransferCost *
    freightTransferReductionPercent;

  const reworkReductionPercent =
    clamp(
      assumptions.reworkReductionPercent,
      0,
      1
    );

  const reworkSavings =
    inputs.annualReworkRepeatTripCost *
    reworkReductionPercent;

  const warehouseCostReductionPercent =
    clamp(
      assumptions.warehouseCostReductionPercent,
      0,
      1
    );

  const warehouseSavings =
    inputs.annualWarehouseCost *
    warehouseCostReductionPercent;

  const adminLaborReductionPercent =
    clamp(
      assumptions.adminLaborReductionPercent,
      0,
      1
    );

  const adminLaborSavings =
    inputs.annualAdminLaborCost *
    adminLaborReductionPercent;

  const directOperatingSavings =
    materialProcurementSavings +
    shrinkObsolescenceSavings +
    freightTransferSavings +
    reworkSavings +
    warehouseSavings +
    adminLaborSavings;

  const operationalGapRecoveryPercent =
    clamp(
      assumptions.operationalGapRecoveryPercent,
      0,
      1
    );

  const recoveredJobs =
    inputs.addressableOperationalGapJobs *
    operationalGapRecoveryPercent;

  const recoveredRevenue =
    recoveredJobs *
    inputs.averageJobRevenue;

  const recoveredJobContributionMargin =
    clamp(
      inputs.recoveredJobContributionMarginPercent,
      0,
      1
    );

  const recoveredRevenueContribution =
    recoveredRevenue *
    recoveredJobContributionMargin;

  const grossAnnualEbitdaImprovement =
    directOperatingSavings +
    recoveredRevenueContribution;

  const recurringNetEbitdaImprovement =
    grossAnnualEbitdaImprovement -
    inputs.annualArvenixCost;

  const proFormaEbitda =
    currentEbitda +
    recurringNetEbitdaImprovement;

  const proFormaEbitdaMargin =
    safeDivide(proFormaEbitda, annualRevenue);

  const upfrontImplementationInvestment =
    inputs.implementationCost +
    inputs.internalImplementationCost;

  const yearOneInvestment =
    upfrontImplementationInvestment +
    inputs.annualArvenixCost;

  const yearOneNetBenefit =
    grossAnnualEbitdaImprovement -
    yearOneInvestment;

  const yearOneRoi =
    safeDivide(
      yearOneNetBenefit,
      yearOneInvestment
    );

  const annualNetRecurringBenefit =
    recurringNetEbitdaImprovement;

  const recurringRoi =
    safeDivide(
      annualNetRecurringBenefit,
      inputs.annualArvenixCost
    );

  const benefitCostRatio =
    safeDivide(
      grossAnnualEbitdaImprovement,
      inputs.annualArvenixCost
    );

  const monthlyNetRecurringBenefit =
    annualNetRecurringBenefit / 12;

  const paybackMonths =
    monthlyNetRecurringBenefit > 0
      ? upfrontImplementationInvestment /
        monthlyNetRecurringBenefit
      : 0;

  const enterpriseValueLow =
    annualNetRecurringBenefit *
    inputs.lowEbitdaMultiple;

  const enterpriseValueBase =
    annualNetRecurringBenefit *
    inputs.baseEbitdaMultiple;

  const enterpriseValueHigh =
    annualNetRecurringBenefit *
    inputs.highEbitdaMultiple;

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
    targetInventoryTurns,
    targetInventory,
    workingCapitalReleased,

    materialProcurementImprovementPercent,
    shrinkObsolescenceReductionPercent,
    freightTransferReductionPercent,
    reworkReductionPercent,
    warehouseCostReductionPercent,
    adminLaborReductionPercent,
    operationalGapRecoveryPercent,

    materialProcurementSavings,
    shrinkObsolescenceSavings,
    freightTransferSavings,
    reworkSavings,
    warehouseSavings,
    adminLaborSavings,

    directOperatingSavings,

    recoveredJobs,
    recoveredRevenue,
    recoveredJobContributionMargin,
    recoveredRevenueContribution,

    grossAnnualEbitdaImprovement,
    recurringNetEbitdaImprovement,

    proFormaEbitda,
    proFormaEbitdaMargin,

    upfrontImplementationInvestment,
    yearOneInvestment,

    yearOneNetBenefit,
    yearOneRoi,

    annualNetRecurringBenefit,
    recurringRoi,

    benefitCostRatio,
    paybackMonths,

    enterpriseValueLow,
    enterpriseValueBase,
    enterpriseValueHigh,
  };
}
