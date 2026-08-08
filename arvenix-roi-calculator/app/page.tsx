"use client";

import { useMemo, useState } from "react";

import {
  calculateRoi,
  defaultInputs,
  type RoiInputs,
  type Scenario,
  type ScenarioAssumptions,
} from "@/lib/calculator";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

const wholeNumber = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const multiple = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function percentInputValue(value: number): number {
  return Number((value * 100).toFixed(2));
}

function NumberInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
  min = 0,
  max,
  help,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
  help?: string;
}) {
  return (
    <label className="field">
      <span className="fieldLabel">{label}</span>

      <div className="inputWrap">
        {prefix && <span>{prefix}</span>}

        <input
          type="number"
          value={value}
          step={step}
          min={min}
          max={max}
          onChange={(event) => {
            const parsedValue = Number(event.target.value);

            onChange(
              Number.isFinite(parsedValue)
                ? parsedValue
                : 0
            );
          }}
        />

        {suffix && <span>{suffix}</span>}
      </div>

      {help && <small>{help}</small>}
    </label>
  );
}

function Metric({
  label,
  value,
  sub,
  emphasis = false,
}: {
  label: string;
  value: string;
  sub?: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={
        emphasis
          ? "metric emphasis"
          : "metric"
      }
    >
      <span>{label}</span>
      <strong>{value}</strong>
      {sub && <small>{sub}</small>}
    </div>
  );
}

export default function Home() {
  const [inputs, setInputs] =
    useState<RoiInputs>(defaultInputs);

  const [scenario, setScenario] =
    useState<Scenario>("base");

  const results = useMemo(
    () => calculateRoi(inputs, scenario),
    [inputs, scenario]
  );

  const scenarioInputs =
    inputs[scenario];

  const setInput = (
    key: keyof RoiInputs,
    value: number
  ) => {
    setInputs((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const setScenarioInput = (
    key: keyof ScenarioAssumptions,
    value: number
  ) => {
    setInputs((current) => ({
      ...current,
      [scenario]: {
        ...current[scenario],
        [key]: value,
      },
    }));
  };

  const resetAssumptions = () => {
    setInputs(defaultInputs);
    setScenario("base");
  };

  const valueCreationRows = [
    {
      label: "Material procurement",
      value:
        results.materialProcurementSavings,
    },
    {
      label: "Shrink / obsolescence",
      value:
        results.shrinkObsolescenceSavings,
    },
    {
      label: "Freight / transfers",
      value:
        results.freightTransferSavings,
    },
    {
      label: "Rework / repeat trips",
      value: results.reworkSavings,
    },
    {
      label: "Warehouse",
      value: results.warehouseSavings,
    },
    {
      label: "Administrative labor",
      value: results.adminLaborSavings,
    },
    {
      label: "Recovered job contribution",
      value:
        results.recoveredRevenueContribution,
    },
  ];

  const maxBenefit = Math.max(
    ...valueCreationRows.map(
      (row) => row.value
    ),
    1
  );

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">
            ARVENIX
          </p>

          <h1>
            Operational Value Creation Calculator
          </h1>

          <p className="lede">
            Model EBITDA improvement, working
            capital release, operating leverage,
            payback, and illustrative enterprise
            value from operational improvements.
          </p>
        </div>

        <button
          className="reset"
          type="button"
          onClick={resetAssumptions}
        >
          Reset assumptions
        </button>
      </header>

      <section className="summaryGrid">
        <Metric
          label="Net recurring EBITDA improvement"
          value={money.format(
            results.recurringNetEbitdaImprovement
          )}
          sub={`Pro forma EBITDA ${money.format(
            results.proFormaEbitda
          )}`}
          emphasis
        />

        <Metric
          label="Working capital released"
          value={money.format(
            results.workingCapitalReleased
          )}
          sub="Inventory cash release. Not included in EBITDA."
        />

        <Metric
          label="Year 1 ROI"
          value={`${number.format(
            results.yearOneRoi * 100
          )}%`}
          sub={`${number.format(
            results.paybackMonths
          )} month payback`}
        />

        <Metric
          label="Illustrative EV impact"
          value={money.format(
            results.enterpriseValueBase
          )}
          sub={`${number.format(
            inputs.baseEbitdaMultiple
          )}x net recurring EBITDA`}
        />
      </section>

      <section className="panel">
        <div className="panelTitle">
          <h2>Underwriting case</h2>
          <span>Scenario selection</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
            gap: "12px",
          }}
        >
          {(
            [
              "conservative",
              "base",
              "upside",
            ] as Scenario[]
          ).map((option) => (
            <button
              key={option}
              type="button"
              className={
                scenario === option
                  ? "reset"
                  : "inputWrap"
              }
              onClick={() =>
                setScenario(option)
              }
              style={{
                cursor: "pointer",
                textTransform: "capitalize",
                justifyContent: "center",
                minHeight: "48px",
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <div className="layout">
        <div className="inputsColumn">
          <section className="panel">
            <div className="panelTitle">
              <h2>Company baseline</h2>
              <span>Current state</span>
            </div>

            <div className="fieldGrid">
              <NumberInput
                label="Annual completed installs"
                value={inputs.annualInstalls}
                onChange={(value) =>
                  setInput(
                    "annualInstalls",
                    value
                  )
                }
                step={100}
              />

              <NumberInput
                label="Average sale price"
                prefix="$"
                value={
                  inputs.averageJobRevenue
                }
                onChange={(value) =>
                  setInput(
                    "averageJobRevenue",
                    value
                  )
                }
                step={100}
              />

              <NumberInput
                label="Current EBITDA"
                prefix="$"
                value={inputs.currentEbitda}
                onChange={(value) =>
                  setInput(
                    "currentEbitda",
                    value
                  )
                }
                step={100000}
              />

              <NumberInput
                label="Average inventory"
                prefix="$"
                value={
                  inputs.averageInventory
                }
                onChange={(value) =>
                  setInput(
                    "averageInventory",
                    value
                  )
                }
                step={100000}
              />
            </div>

            <div className="resultList">
              <div>
                <span>Annual revenue</span>
                <strong>
                  {money.format(
                    results.annualRevenue
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Current EBITDA margin
                </span>
                <strong>
                  {number.format(
                    results.currentEbitdaMargin *
                      100
                  )}
                  %
                </strong>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panelTitle">
              <h2>Gross profit model</h2>
              <span>Cost structure</span>
            </div>

            <div className="fieldGrid">
              <NumberInput
                label="Materials"
                suffix="%"
                value={percentInputValue(
                  inputs.materialPercent
                )}
                onChange={(value) =>
                  setInput(
                    "materialPercent",
                    value / 100
                  )
                }
                step={0.5}
                max={100}
              />

              <NumberInput
                label="Direct installation labor"
                suffix="%"
                value={percentInputValue(
                  inputs.directLaborPercent
                )}
                onChange={(value) =>
                  setInput(
                    "directLaborPercent",
                    value / 100
                  )
                }
                step={0.5}
                max={100}
              />

              <NumberInput
                label="Other direct COGS"
                suffix="%"
                value={percentInputValue(
                  inputs.otherDirectCogsPercent
                )}
                onChange={(value) =>
                  setInput(
                    "otherDirectCogsPercent",
                    value / 100
                  )
                }
                step={0.5}
                max={100}
              />

              <NumberInput
                label="Marketing"
                suffix="%"
                value={percentInputValue(
                  inputs.marketingPercent
                )}
                onChange={(value) =>
                  setInput(
                    "marketingPercent",
                    value / 100
                  )
                }
                step={0.5}
                max={100}
              />

              <NumberInput
                label="Recovered job contribution margin"
                suffix="%"
                value={percentInputValue(
                  inputs.recoveredJobContributionMarginPercent
                )}
                onChange={(value) =>
                  setInput(
                    "recoveredJobContributionMarginPercent",
                    value / 100
                  )
                }
                step={0.5}
                max={100}
              />
            </div>

            <div className="resultList">
              <div>
                <span>Material COGS</span>
                <strong>
                  {money.format(
                    results.annualMaterialCogs
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Direct labor COGS
                </span>
                <strong>
                  {money.format(
                    results.annualDirectLaborCogs
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Other direct COGS
                </span>
                <strong>
                  {money.format(
                    results.annualOtherDirectCogs
                  )}
                </strong>
              </div>

              <div>
                <span>Total direct COGS</span>
                <strong>
                  {money.format(
                    results.totalDirectCogs
                  )}
                </strong>
              </div>

              <div className="total">
                <span>Gross profit</span>
                <strong>
                  {money.format(
                    results.grossProfit
                  )}
                </strong>
              </div>

              <div>
                <span>Gross margin</span>
                <strong>
                  {number.format(
                    results.grossMargin *
                      100
                  )}
                  %
                </strong>
              </div>

              <div>
                <span>
                  Annual marketing expense
                </span>
                <strong>
                  {money.format(
                    results.annualMarketingExpense
                  )}
                </strong>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panelTitle">
              <h2>Inventory optimization</h2>
              <span>
                Working capital
              </span>
            </div>

            <div className="fieldGrid">
              <NumberInput
                label="Average material inventory"
                prefix="$"
                value={
                  inputs.averageInventory
                }
                onChange={(value) =>
                  setInput(
                    "averageInventory",
                    value
                  )
                }
                step={100000}
              />

              <NumberInput
                label={`${scenario} target inventory turns`}
                suffix="x"
                value={
                  scenarioInputs.targetInventoryTurns
                }
                onChange={(value) =>
                  setScenarioInput(
                    "targetInventoryTurns",
                    value
                  )
                }
                step={0.05}
                min={0.1}
              />
            </div>

            <div className="resultList">
              <div>
                <span>
                  Annual material consumption
                </span>
                <strong>
                  {money.format(
                    results.annualMaterialCogs
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Current inventory turns
                </span>
                <strong>
                  {multiple.format(
                    results.currentInventoryTurns
                  )}
                  x
                </strong>
              </div>

              <div>
                <span>
                  Target inventory turns
                </span>
                <strong>
                  {multiple.format(
                    results.targetInventoryTurns
                  )}
                  x
                </strong>
              </div>

              <div>
                <span>
                  Target inventory
                </span>
                <strong>
                  {money.format(
                    results.targetInventory
                  )}
                </strong>
              </div>

              <div className="total">
                <span>
                  Working capital released
                </span>
                <strong>
                  {money.format(
                    results.workingCapitalReleased
                  )}
                </strong>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panelTitle">
              <h2>
                Operating cost pools
              </h2>
              <span>
                Current annual spend
              </span>
            </div>

            <div className="fieldGrid">
              <NumberInput
                label="Shrink / obsolescence cost"
                prefix="$"
                value={
                  inputs.annualShrinkObsolescenceCost
                }
                onChange={(value) =>
                  setInput(
                    "annualShrinkObsolescenceCost",
                    value
                  )
                }
                step={10000}
              />

              <NumberInput
                label="Freight / transfer cost"
                prefix="$"
                value={
                  inputs.annualFreightTransferCost
                }
                onChange={(value) =>
                  setInput(
                    "annualFreightTransferCost",
                    value
                  )
                }
                step={10000}
              />

              <NumberInput
                label="Rework / repeat trip cost"
                prefix="$"
                value={
                  inputs.annualReworkRepeatTripCost
                }
                onChange={(value) =>
                  setInput(
                    "annualReworkRepeatTripCost",
                    value
                  )
                }
                step={10000}
              />

              <NumberInput
                label="Warehouse cost"
                prefix="$"
                value={
                  inputs.annualWarehouseCost
                }
                onChange={(value) =>
                  setInput(
                    "annualWarehouseCost",
                    value
                  )
                }
                step={25000}
              />

              <NumberInput
                label="Administrative labor cost"
                prefix="$"
                value={
                  inputs.annualAdminLaborCost
                }
                onChange={(value) =>
                  setInput(
                    "annualAdminLaborCost",
                    value
                  )
                }
                step={25000}
              />
            </div>
          </section>

          <section className="panel">
            <div className="panelTitle">
              <h2>
                Underwritten improvements
              </h2>
              <span>
                {scenario} case
              </span>
            </div>

            <div className="fieldGrid">
              <NumberInput
                label="Material cost reduction"
                suffix="%"
                value={percentInputValue(
                  scenarioInputs.materialProcurementImprovementPercent
                )}
                onChange={(value) =>
                  setScenarioInput(
                    "materialProcurementImprovementPercent",
                    value / 100
                  )
                }
                step={0.1}
                max={100}
              />

              <NumberInput
                label="Shrink / obsolescence reduction"
                suffix="%"
                value={percentInputValue(
                  scenarioInputs.shrinkObsolescenceReductionPercent
                )}
                onChange={(value) =>
                  setScenarioInput(
                    "shrinkObsolescenceReductionPercent",
                    value / 100
                  )
                }
                step={1}
                max={100}
              />

              <NumberInput
                label="Freight / transfer reduction"
                suffix="%"
                value={percentInputValue(
                  scenarioInputs.freightTransferReductionPercent
                )}
                onChange={(value) =>
                  setScenarioInput(
                    "freightTransferReductionPercent",
                    value / 100
                  )
                }
                step={1}
                max={100}
              />

              <NumberInput
                label="Rework reduction"
                suffix="%"
                value={percentInputValue(
                  scenarioInputs.reworkReductionPercent
                )}
                onChange={(value) =>
                  setScenarioInput(
                    "reworkReductionPercent",
                    value / 100
                  )
                }
                step={1}
                max={100}
              />

              <NumberInput
                label="Warehouse cost reduction"
                suffix="%"
                value={percentInputValue(
                  scenarioInputs.warehouseCostReductionPercent
                )}
                onChange={(value) =>
                  setScenarioInput(
                    "warehouseCostReductionPercent",
                    value / 100
                  )
                }
                step={1}
                max={100}
              />

              <NumberInput
                label="Administrative labor reduction"
                suffix="%"
                value={percentInputValue(
                  scenarioInputs.adminLaborReductionPercent
                )}
                onChange={(value) =>
                  setScenarioInput(
                    "adminLaborReductionPercent",
                    value / 100
                  )
                }
                step={1}
                max={100}
              />
            </div>
          </section>

          <section className="panel">
            <div className="panelTitle">
              <h2>
                Addressable operational gap
              </h2>
              <span>
                Existing sold revenue
              </span>
            </div>

            <div className="fieldGrid">
              <NumberInput
                label="Addressable gap jobs"
                value={
                  inputs.addressableOperationalGapJobs
                }
                onChange={(value) =>
                  setInput(
                    "addressableOperationalGapJobs",
                    value
                  )
                }
                step={10}
                help="Sold jobs considered operationally recoverable."
              />

              <NumberInput
                label={`${scenario} recovery rate`}
                suffix="%"
                value={percentInputValue(
                  scenarioInputs.operationalGapRecoveryPercent
                )}
                onChange={(value) =>
                  setScenarioInput(
                    "operationalGapRecoveryPercent",
                    value / 100
                  )
                }
                step={1}
                max={100}
              />

              <NumberInput
                label="Recovered job contribution margin"
                suffix="%"
                value={percentInputValue(
                  inputs.recoveredJobContributionMarginPercent
                )}
                onChange={(value) =>
                  setInput(
                    "recoveredJobContributionMarginPercent",
                    value / 100
                  )
                }
                step={0.5}
                max={100}
              />
            </div>

            <div className="resultList">
              <div>
                <span>
                  Addressable jobs
                </span>
                <strong>
                  {wholeNumber.format(
                    inputs.addressableOperationalGapJobs
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Underwritten recovery
                </span>
                <strong>
                  {number.format(
                    results.operationalGapRecoveryPercent *
                      100
                  )}
                  %
                </strong>
              </div>

              <div>
                <span>Recovered jobs</span>
                <strong>
                  {number.format(
                    results.recoveredJobs
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Recovered revenue
                </span>
                <strong>
                  {money.format(
                    results.recoveredRevenue
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Contribution margin
                </span>
                <strong>
                  {number.format(
                    results.recoveredJobContributionMargin *
                      100
                  )}
                  %
                </strong>
              </div>

              <div className="total">
                <span>
                  Recovered EBITDA contribution
                </span>
                <strong>
                  {money.format(
                    results.recoveredRevenueContribution
                  )}
                </strong>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panelTitle">
              <h2>Arvenix investment</h2>
              <span>
                Year 1 and recurring
              </span>
            </div>

            <div className="fieldGrid">
              <NumberInput
                label="Implementation cost"
                prefix="$"
                value={
                  inputs.implementationCost
                }
                onChange={(value) =>
                  setInput(
                    "implementationCost",
                    value
                  )
                }
                step={5000}
              />

              <NumberInput
                label="Internal implementation cost"
                prefix="$"
                value={
                  inputs.internalImplementationCost
                }
                onChange={(value) =>
                  setInput(
                    "internalImplementationCost",
                    value
                  )
                }
                step={5000}
              />

              <NumberInput
                label="Annual platform cost"
                prefix="$"
                value={
                  inputs.annualArvenixCost
                }
                onChange={(value) =>
                  setInput(
                    "annualArvenixCost",
                    value
                  )
                }
                step={5000}
              />
            </div>
          </section>

          <section className="panel">
            <div className="panelTitle">
              <h2>
                Valuation assumptions
              </h2>
              <span>
                Illustrative only
              </span>
            </div>

            <div className="fieldGrid">
              <NumberInput
                label="Low EBITDA multiple"
                suffix="x"
                value={
                  inputs.lowEbitdaMultiple
                }
                onChange={(value) =>
                  setInput(
                    "lowEbitdaMultiple",
                    value
                  )
                }
                step={0.5}
              />

              <NumberInput
                label="Base EBITDA multiple"
                suffix="x"
                value={
                  inputs.baseEbitdaMultiple
                }
                onChange={(value) =>
                  setInput(
                    "baseEbitdaMultiple",
                    value
                  )
                }
                step={0.5}
              />

              <NumberInput
                label="High EBITDA multiple"
                suffix="x"
                value={
                  inputs.highEbitdaMultiple
                }
                onChange={(value) =>
                  setInput(
                    "highEbitdaMultiple",
                    value
                  )
                }
                step={0.5}
              />
            </div>
          </section>
        </div>

        <div className="resultsColumn">
          <section className="panel sticky">
            <div className="panelTitle">
              <h2>
                Annual value creation
              </h2>
              <span>
                {scenario} case
              </span>
            </div>

            <div className="bars">
              {valueCreationRows.map(
                (row) => {
                  const width = Math.max(
                    0,
                    Math.min(
                      100,
                      (row.value /
                        maxBenefit) *
                        100
                    )
                  );

                  return (
                    <div
                      className="barRow"
                      key={row.label}
                    >
                      <div className="barLabel">
                        <span>
                          {row.label}
                        </span>

                        <strong>
                          {money.format(
                            row.value
                          )}
                        </strong>
                      </div>

                      <div className="track">
                        <div
                          className="fill"
                          style={{
                            width: `${width}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            <div className="divider" />

            <div className="resultList">
              <div>
                <span>
                  Material procurement
                </span>
                <strong>
                  {money.format(
                    results.materialProcurementSavings
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Shrink / obsolescence
                </span>
                <strong>
                  {money.format(
                    results.shrinkObsolescenceSavings
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Freight / transfer
                </span>
                <strong>
                  {money.format(
                    results.freightTransferSavings
                  )}
                </strong>
              </div>

              <div>
                <span>Rework</span>
                <strong>
                  {money.format(
                    results.reworkSavings
                  )}
                </strong>
              </div>

              <div>
                <span>Warehouse</span>
                <strong>
                  {money.format(
                    results.warehouseSavings
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Administrative labor
                </span>
                <strong>
                  {money.format(
                    results.adminLaborSavings
                  )}
                </strong>
              </div>

              <div className="total">
                <span>
                  Direct operating savings
                </span>
                <strong>
                  {money.format(
                    results.directOperatingSavings
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Recovered jobs
                </span>
                <strong>
                  {number.format(
                    results.recoveredJobs
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Recovered revenue
                </span>
                <strong>
                  {money.format(
                    results.recoveredRevenue
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Recovered job contribution
                </span>
                <strong>
                  {money.format(
                    results.recoveredRevenueContribution
                  )}
                </strong>
              </div>

              <div className="total">
                <span>
                  Gross annual EBITDA improvement
                </span>
                <strong>
                  {money.format(
                    results.grossAnnualEbitdaImprovement
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Annual Arvenix cost
                </span>
                <strong>
                  (
                  {money.format(
                    inputs.annualArvenixCost
                  )}
                  )
                </strong>
              </div>

              <div className="net">
                <span>
                  Net recurring EBITDA improvement
                </span>
                <strong>
                  {money.format(
                    results.recurringNetEbitdaImprovement
                  )}
                </strong>
              </div>
            </div>

            <div className="divider" />

            <div className="resultList">
              <div>
                <span>
                  Current EBITDA
                </span>
                <strong>
                  {money.format(
                    results.currentEbitda
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Current EBITDA margin
                </span>
                <strong>
                  {number.format(
                    results.currentEbitdaMargin *
                      100
                  )}
                  %
                </strong>
              </div>

              <div className="net">
                <span>
                  Pro forma EBITDA
                </span>
                <strong>
                  {money.format(
                    results.proFormaEbitda
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Pro forma EBITDA margin
                </span>
                <strong>
                  {number.format(
                    results.proFormaEbitdaMargin *
                      100
                  )}
                  %
                </strong>
              </div>
            </div>

            <div className="roiBox">
              <div>
                <span>
                  Upfront implementation
                </span>
                <strong>
                  {money.format(
                    results.upfrontImplementationInvestment
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Year 1 investment
                </span>
                <strong>
                  {money.format(
                    results.yearOneInvestment
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Year 1 net benefit
                </span>
                <strong>
                  {money.format(
                    results.yearOneNetBenefit
                  )}
                </strong>
              </div>

              <div>
                <span>Year 1 ROI</span>
                <strong>
                  {number.format(
                    results.yearOneRoi *
                      100
                  )}
                  %
                </strong>
              </div>

              <div>
                <span>
                  Recurring ROI
                </span>
                <strong>
                  {number.format(
                    results.recurringRoi *
                      100
                  )}
                  %
                </strong>
              </div>

              <div>
                <span>
                  Benefit / cost
                </span>
                <strong>
                  {number.format(
                    results.benefitCostRatio
                  )}
                  x
                </strong>
              </div>

              <div>
                <span>Payback</span>
                <strong>
                  {number.format(
                    results.paybackMonths
                  )}{" "}
                  months
                </strong>
              </div>

              <div>
                <span>
                  Working capital released
                </span>
                <strong>
                  {money.format(
                    results.workingCapitalReleased
                  )}
                </strong>
              </div>
            </div>

            <div className="divider" />

            <div className="panelTitle">
              <h2>
                Illustrative enterprise value
              </h2>
              <span>
                Net recurring EBITDA
              </span>
            </div>

            <div className="resultList">
              <div>
                <span>
                  {number.format(
                    inputs.lowEbitdaMultiple
                  )}
                  x EBITDA
                </span>

                <strong>
                  {money.format(
                    results.enterpriseValueLow
                  )}
                </strong>
              </div>

              <div className="total">
                <span>
                  {number.format(
                    inputs.baseEbitdaMultiple
                  )}
                  x EBITDA
                </span>

                <strong>
                  {money.format(
                    results.enterpriseValueBase
                  )}
                </strong>
              </div>

              <div>
                <span>
                  {number.format(
                    inputs.highEbitdaMultiple
                  )}
                  x EBITDA
                </span>

                <strong>
                  {money.format(
                    results.enterpriseValueHigh
                  )}
                </strong>
              </div>
            </div>

            <div className="divider" />

            <div className="panelTitle">
              <h2>
                Inventory impact
              </h2>
              <span>
                Cash conversion
              </span>
            </div>

            <div className="resultList">
              <div>
                <span>
                  Current average inventory
                </span>

                <strong>
                  {money.format(
                    inputs.averageInventory
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Current inventory turns
                </span>

                <strong>
                  {multiple.format(
                    results.currentInventoryTurns
                  )}
                  x
                </strong>
              </div>

              <div>
                <span>
                  Target inventory turns
                </span>

                <strong>
                  {multiple.format(
                    results.targetInventoryTurns
                  )}
                  x
                </strong>
              </div>

              <div>
                <span>
                  Target inventory
                </span>

                <strong>
                  {money.format(
                    results.targetInventory
                  )}
                </strong>
              </div>

              <div className="net">
                <span>
                  Working capital released
                </span>

                <strong>
                  {money.format(
                    results.workingCapitalReleased
                  )}
                </strong>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
