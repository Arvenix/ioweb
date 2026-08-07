"use client";

import { useMemo, useState } from "react";

import {
  calculateRoi,
  defaultInputs,
  type RoiInputs,
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
          step={step}
          min={min}
          max={max}
          value={value}
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

  const results = useMemo(
    () => calculateRoi(inputs),
    [inputs]
  );

  const setInput = (
    key: keyof RoiInputs,
    value: number
  ) => {
    setInputs((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const benefitRows = [
    {
      label: "Inventory carrying cost",
      value:
        results.inventoryCarryingCostSavings,
    },
    {
      label: "Warehouse footprint",
      value: inputs.warehouseSavings,
    },
    {
      label: "Freight & transfers",
      value:
        inputs.freightTransferSavings,
    },
    {
      label: "Inventory shrink",
      value:
        inputs.inventoryShrinkSavings,
    },
    {
      label: "Administrative labor",
      value: inputs.adminLaborSavings,
    },
    {
      label: "Rework / repeat trips",
      value: inputs.reworkSavings,
    },
    {
      label: "Capacity leakage recovery",
      value:
        results.capacityEbitdaContribution,
    },
    {
      label:
        "Backlog / cancellation recovery",
      value:
        inputs.backlogCancellationSavings,
    },
  ];

  const maxBenefit = Math.max(
    ...benefitRows.map(
      (row) => row.value
    ),
    1
  );

  return (
    <main>
      {/* HEADER */}

      <header className="hero">
        <div>
          <p className="eyebrow">
            ARVENIX
          </p>

          <h1>
            Operational ROI Calculator
          </h1>

          <p className="lede">
            Quantify EBITDA recovery,
            revenue capacity, and working
            capital released by improving
            inventory, material readiness,
            scheduling, backlog management,
            and install execution.
          </p>
        </div>

        <button
          className="reset"
          type="button"
          onClick={() =>
            setInputs(defaultInputs)
          }
        >
          Reset assumptions
        </button>
      </header>

      {/* SUMMARY */}

      <section className="summaryGrid">
        <Metric
          label="Gross annual EBITDA opportunity"
          value={money.format(
            results.grossEbitdaOpportunity
          )}
          emphasis
        />

        <Metric
          label="Net recurring EBITDA impact"
          value={money.format(
            results.recurringNetEbitdaImpact
          )}
          sub="After annual Arvenix platform cost"
          emphasis
        />

        <Metric
          label="Working capital released"
          value={money.format(
            results.workingCapitalReleased
          )}
          sub="Cash released from inventory. Not counted as EBITDA."
        />

        <Metric
          label="Year 1 ROI"
          value={`${number.format(
            results.yearOneRoi * 100
          )}%`}
          sub={`${results.paybackMonths.toFixed(
            1
          )} month EBITDA payback`}
        />
      </section>

      <div className="layout">
        {/* LEFT COLUMN */}

        <div className="inputsColumn">
          {/* COMPANY BASELINE */}

          <section className="panel">
            <div className="panelTitle">
              <h2>
                Company baseline
              </h2>

              <span>
                Core economics
              </span>
            </div>

            <div className="fieldGrid">
              <NumberInput
                label="Annual install volume"
                value={
                  inputs.annualInstalls
                }
                onChange={(value) =>
                  setInput(
                    "annualInstalls",
                    value
                  )
                }
                step={100}
                help="Current annual completed installation volume."
              />

              <NumberInput
                label="Average job revenue"
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
                step={500}
              />

              <NumberInput
                label="Inventory on hand"
                prefix="$"
                value={
                  inputs.inventoryValue
                }
                onChange={(value) =>
                  setInput(
                    "inventoryValue",
                    value
                  )
                }
                step={100000}
                help="Predetermined Arvenix baseline: $8 million."
              />

              <NumberInput
                label="Labor"
                suffix="%"
                value={percentInputValue(
                  inputs.laborPercent
                )}
                onChange={(value) =>
                  setInput(
                    "laborPercent",
                    value / 100
                  )
                }
                step={0.5}
                max={100}
              />

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
            </div>

            <div className="formulaCallout">
              <span>
                Fully loaded contribution
                margin
              </span>

              <strong>
                {number.format(
                  results.contributionMargin *
                    100
                )}
                %
              </strong>

              <small>
                100% less labor, materials,
                and marketing. Recovered
                revenue is converted to
                EBITDA contribution using
                this margin.
              </small>
            </div>
          </section>

          {/* CAPACITY LEAKAGE */}

          <section className="panel">
            <div className="panelTitle">
              <h2>
                Capacity leakage recovery
              </h2>

              <span>
                Revenue opportunity
              </span>
            </div>

            <div className="fieldGrid">
              <NumberInput
                label="Estimated capacity leakage"
                suffix="%"
                value={percentInputValue(
                  inputs.capacityLeakagePercent
                )}
                onChange={(value) =>
                  setInput(
                    "capacityLeakagePercent",
                    value / 100
                  )
                }
                step={1}
                max={100}
                help="Estimated portion of current install volume lost to operational constraints. Default: 10%."
              />

              <NumberInput
                label="Sustainable recovery of leakage"
                suffix="%"
                value={percentInputValue(
                  inputs.sustainableCapacityRecoveryPercent
                )}
                onChange={(value) =>
                  setInput(
                    "sustainableCapacityRecoveryPercent",
                    value / 100
                  )
                }
                step={1}
                max={100}
                help="Percentage of identified capacity leakage Arvenix is assumed to sustainably recover. Default: 7%."
              />
            </div>

            <div className="resultList">
              <div>
                <span>
                  Current annual installs
                </span>

                <strong>
                  {wholeNumber.format(
                    inputs.annualInstalls
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Estimated capacity leakage
                </span>

                <strong>
                  {number.format(
                    inputs.capacityLeakagePercent *
                      100
                  )}
                  %
                </strong>
              </div>

              <div>
                <span>
                  Estimated lost install
                  opportunities
                </span>

                <strong>
                  {number.format(
                    results.estimatedLostCapacityInstalls
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Sustainable recovery rate
                </span>

                <strong>
                  {number.format(
                    inputs.sustainableCapacityRecoveryPercent *
                      100
                  )}
                  %
                </strong>
              </div>

              <div>
                <span>
                  Recovered installs
                </span>

                <strong>
                  {number.format(
                    results.recoveredInstalls
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

              <div className="total">
                <span>
                  Capacity EBITDA
                  contribution
                </span>

                <strong>
                  {money.format(
                    results.capacityEbitdaContribution
                  )}
                </strong>
              </div>
            </div>

            <p className="disclaimer">
              Capacity recovery is not
              calculated against all
              installation volume. Arvenix
              first estimates the portion of
              install volume affected by
              operational leakage, then
              applies the sustainable
              recovery assumption only to
              that leakage.
            </p>
          </section>

          {/* INVENTORY */}

          <section className="panel">
            <div className="panelTitle">
              <h2>
                Inventory optimization
              </h2>

              <span>
                Working capital + EBITDA
              </span>
            </div>

            <div className="fieldGrid">
              <NumberInput
                label="Inventory reduction"
                suffix="%"
                value={percentInputValue(
                  inputs.inventoryReductionPercent
                )}
                onChange={(value) =>
                  setInput(
                    "inventoryReductionPercent",
                    value / 100
                  )
                }
                step={1}
                max={100}
                help="Reduction in inventory required to support the same operating volume."
              />

              <NumberInput
                label="Inventory carrying cost"
                suffix="%"
                value={percentInputValue(
                  inputs.inventoryCarryingCostPercent
                )}
                onChange={(value) =>
                  setInput(
                    "inventoryCarryingCostPercent",
                    value / 100
                  )
                }
                step={1}
                max={100}
                help="Estimated annual cost of carrying inventory."
              />
            </div>

            <div className="resultList">
              <div>
                <span>
                  Inventory baseline
                </span>

                <strong>
                  {money.format(
                    inputs.inventoryValue
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Working capital released
                </span>

                <strong>
                  {money.format(
                    results.inventoryReduction
                  )}
                </strong>
              </div>

              <div className="total">
                <span>
                  Annual carrying cost
                  savings
                </span>

                <strong>
                  {money.format(
                    results.inventoryCarryingCostSavings
                  )}
                </strong>
              </div>
            </div>

            <p className="disclaimer">
              Inventory reduction is
              treated as working capital
              release. Only the avoided
              annual carrying cost is
              included in EBITDA
              improvement.
            </p>
          </section>

          {/* OPERATIONAL IMPROVEMENT */}

          <section className="panel">
            <div className="panelTitle">
              <h2>
                Operational improvement
              </h2>

              <span>
                Editable annual assumptions
              </span>
            </div>

            <div className="fieldGrid">
              <NumberInput
                label="Warehouse savings"
                prefix="$"
                value={
                  inputs.warehouseSavings
                }
                onChange={(value) =>
                  setInput(
                    "warehouseSavings",
                    value
                  )
                }
                step={5000}
                help="Reduced storage footprint, overflow, or third-party warehouse expense."
              />

              <NumberInput
                label="Freight / transfer savings"
                prefix="$"
                value={
                  inputs.freightTransferSavings
                }
                onChange={(value) =>
                  setInput(
                    "freightTransferSavings",
                    value
                  )
                }
                step={5000}
                help="Reduced unnecessary transfers, repositioning, and expedited freight."
              />

              <NumberInput
                label="Inventory shrink savings"
                prefix="$"
                value={
                  inputs.inventoryShrinkSavings
                }
                onChange={(value) =>
                  setInput(
                    "inventoryShrinkSavings",
                    value
                  )
                }
                step={5000}
                help="Reduction in lost, damaged, stranded, or unaccounted inventory."
              />

              <NumberInput
                label="Administrative labor savings"
                prefix="$"
                value={
                  inputs.adminLaborSavings
                }
                onChange={(value) =>
                  setInput(
                    "adminLaborSavings",
                    value
                  )
                }
                step={5000}
                help="Reduced manual reconciliation, reporting, follow-up, and exception handling."
              />

              <NumberInput
                label="Rework / repeat trip savings"
                prefix="$"
                value={
                  inputs.reworkSavings
                }
                onChange={(value) =>
                  setInput(
                    "reworkSavings",
                    value
                  )
                }
                step={5000}
                help="Avoided repeat trips, material errors, and preventable operational rework."
              />

              <NumberInput
                label="Backlog / cancellation savings"
                prefix="$"
                value={
                  inputs.backlogCancellationSavings
                }
                onChange={(value) =>
                  setInput(
                    "backlogCancellationSavings",
                    value
                  )
                }
                step={5000}
                help="Defaults to $0 to avoid double counting capacity recovery."
              />
            </div>
          </section>

          {/* ARVENIX INVESTMENT */}

          <section className="panel">
            <div className="panelTitle">
              <h2>
                Arvenix investment
              </h2>

              <span>
                Customer cost
              </span>
            </div>

            <div className="fieldGrid two">
              <NumberInput
                label="Implementation"
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
        </div>

        {/* RIGHT COLUMN */}

        <div className="resultsColumn">
          <section className="panel sticky">
            <div className="panelTitle">
              <h2>
                Annual value creation
              </h2>

              <span>
                EBITDA impact
              </span>
            </div>

            <div className="bars">
              {benefitRows.map(
                (row) => {
                  const width =
                    Math.max(
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
                  Estimated lost install
                  opportunities
                </span>

                <strong>
                  {number.format(
                    results.estimatedLostCapacityInstalls
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Recovered installs
                </span>

                <strong>
                  {number.format(
                    results.recoveredInstalls
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
                  Fully loaded contribution
                  margin
                </span>

                <strong>
                  {number.format(
                    results.contributionMargin *
                      100
                  )}
                  %
                </strong>
              </div>

              <div>
                <span>
                  Capacity EBITDA
                  contribution
                </span>

                <strong>
                  {money.format(
                    results.capacityEbitdaContribution
                  )}
                </strong>
              </div>

              <div className="total">
                <span>
                  Gross EBITDA opportunity
                </span>

                <strong>
                  {money.format(
                    results.grossEbitdaOpportunity
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Annual Arvenix expense
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
                  Net recurring EBITDA
                  impact
                </span>

                <strong>
                  {money.format(
                    results.recurringNetEbitdaImpact
                  )}
                </strong>
              </div>
            </div>

            <div className="roiBox">
              <div>
                <span>
                  Year 1 cost
                </span>

                <strong>
                  {money.format(
                    results.yearOneCost
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Year 1 net EBITDA benefit
                </span>

                <strong>
                  {money.format(
                    results.yearOneNetBenefit
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Year 1 ROI
                </span>

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
                  EBITDA payback
                </span>

                <strong>
                  {results.paybackMonths.toFixed(
                    1
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

            <p className="disclaimer">
              Working capital release is
              shown separately and is not
              included in EBITDA or ROI.
              Recovered revenue is converted
              to EBITDA contribution using
              the fully loaded contribution
              margin. Capacity recovery is
              calculated only against
              estimated operational leakage,
              not total installation volume.
              Backlog and cancellation
              savings default to zero to
              reduce double counting.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
