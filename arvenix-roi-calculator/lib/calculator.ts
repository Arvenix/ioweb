export type RoiInputs = {
  annualRevenue: number;
  annualInventory: number;
  laborPct: number;
  materialPct: number;
  marketingPct: number;
  averageJobRevenue: number;
  annualArvenixCost: number;
  implementationCost: number;
  inventoryReductionPct: number;
  inventoryCarryingCostPct: number;
  warehouseSavings: number;
  freightTransferSavings: number;
  shrinkReduction: number;
  adminLaborSavings: number;
  reworkSavings: number;
  recoveredJobsPerMonth: number;
  backlogCancellationRevenueRecovered: number;
};

export type RoiResults = {
  contributionMarginPct: number;
  inventoryReleased: number;
  inventoryCarryingSavings: number;
  recoveredInstallRevenue: number;
  recoveredInstallContribution: number;
  backlogRecoveredContribution: number;
  directOperatingSavings: number;
  grossAnnualEbitdaImpact: number;
  recurringNetEbitdaImpact: number;
  yearOneNetBenefit: number;
  yearOneCost: number;
  yearOneRoiPct: number;
  recurringRoiPct: number;
  paybackMonths: number | null;
};

export const DEFAULT_INPUTS: RoiInputs = {
  annualRevenue: 50_000_000,
  annualInventory: 8_000_000,
  laborPct: 15,
  materialPct: 27,
  marketingPct: 20,
  averageJobRevenue: 15_000,
  annualArvenixCost: 75_000,
  implementationCost: 50_000,
  inventoryReductionPct: 15,
  inventoryCarryingCostPct: 18,
  warehouseSavings: 100_000,
  freightTransferSavings: 75_000,
  shrinkReduction: 100_000,
  adminLaborSavings: 75_000,
  reworkSavings: 125_000,
  recoveredJobsPerMonth: 8,
  backlogCancellationRevenueRecovered: 500_000,
};

export function calculateRoi(input: RoiInputs): RoiResults {
  const contributionMarginPct = Math.max(
    0,
    100 - input.laborPct - input.materialPct - input.marketingPct,
  );
  const contributionMargin = contributionMarginPct / 100;

  const inventoryReleased = input.annualInventory * (input.inventoryReductionPct / 100);
  const inventoryCarryingSavings = inventoryReleased * (input.inventoryCarryingCostPct / 100);

  const recoveredInstallRevenue =
    input.recoveredJobsPerMonth * 12 * input.averageJobRevenue;
  const recoveredInstallContribution = recoveredInstallRevenue * contributionMargin;
  const backlogRecoveredContribution =
    input.backlogCancellationRevenueRecovered * contributionMargin;

  const directOperatingSavings =
    inventoryCarryingSavings +
    input.warehouseSavings +
    input.freightTransferSavings +
    input.shrinkReduction +
    input.adminLaborSavings +
    input.reworkSavings;

  const grossAnnualEbitdaImpact =
    directOperatingSavings + recoveredInstallContribution + backlogRecoveredContribution;

  const recurringNetEbitdaImpact = grossAnnualEbitdaImpact - input.annualArvenixCost;
  const yearOneCost = input.annualArvenixCost + input.implementationCost;
  const yearOneNetBenefit = grossAnnualEbitdaImpact - yearOneCost;
  const yearOneRoiPct = yearOneCost > 0 ? (yearOneNetBenefit / yearOneCost) * 100 : 0;
  const recurringRoiPct =
    input.annualArvenixCost > 0
      ? (recurringNetEbitdaImpact / input.annualArvenixCost) * 100
      : 0;
  const monthlyGrossBenefit = grossAnnualEbitdaImpact / 12;
  const paybackMonths = monthlyGrossBenefit > 0 ? yearOneCost / monthlyGrossBenefit : null;

  return {
    contributionMarginPct,
    inventoryReleased,
    inventoryCarryingSavings,
    recoveredInstallRevenue,
    recoveredInstallContribution,
    backlogRecoveredContribution,
    directOperatingSavings,
    grossAnnualEbitdaImpact,
    recurringNetEbitdaImpact,
    yearOneNetBenefit,
    yearOneCost,
    yearOneRoiPct,
    recurringRoiPct,
    paybackMonths,
  };
}
