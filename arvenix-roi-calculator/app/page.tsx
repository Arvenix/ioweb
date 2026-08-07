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
          onChange={(e) => onChange(Number(e.target.value) || 0)}
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
    <div className={emphasis ? "metric emphasis" : "metric"}>
      <span>{label}</span>
      <strong>{value}</strong>
      {sub && <small>{sub}</small>}
    </div>
  );
}

export default function Home() {
  const [inputs, setInputs] = useState<RoiInputs>(defaultInputs);

  const results = useMemo(() => calculateRoi(inputs), [inputs]);

  const set = (key: keyof RoiInputs, value: number) => {
    setInputs((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const directOperatingSavings =
    results.inventoryCarryingCostSavings +
    inputs.warehouseSavings +
    inputs.freightTransferSavings +
    inputs.inventoryShrinkSavings +
    inputs.adminLaborSavings +
    inputs.reworkSavings +
    inputs.backlogCancellationSavings;

  const benefitRows = [
    [
      "Inventory carrying cost",
      results.inventoryCarryingCostSavings,
    ],
    ["Warehouse footprint", inputs.warehouseSavings],
    ["Freight & transfers", inputs.freightTransferSavings],
    ["Inventory shrink", inputs.inventoryShrinkSavings],
    ["Administrative labor", inputs.adminLaborSavings],
    ["Rework / repeat trips", inputs.reworkSavings],
    [
      "Sustainable capacity recovery",
      results.capacityEbitdaContribution,
    ],
    [
      "Backlog / cancellation recovery",
      inputs.backlogCancellationSavings,
    ],
  ] as const;

  const maxBenefit = Math.max(
    ...benefitRows.map(([, value]) => value),
    1
  );

  return (
    <main>
      {/* HEADER */}
      <header className="hero">
        <div>
          <p className="eyebrow">ARVENIX</p>

          <h1>Operational ROI Calculator</h1>

          <p className="lede">
            Quantify EBITDA recovery, revenue capacity, and working
            capital released by improving inventory, backlog,
            material readiness, scheduling, and install execution.
          </p>
        </div>

        <button
          className="reset"
          onClick={() => setInputs(defaultInputs)}
        >
          Reset assumptions
        </button>
      </header>

      {/* TOP SUMMARY */}
      <section className="summaryGrid">
        <Metric
          label="Gross annual EBITDA opportunity"
          value={money.format(results.grossEbitdaOpportunity)}
          emphasis
        />

        <Metric
          label="Net recurring EBITDA impact"
          value={money.format(results.recurringNetEbitdaImpact)}
          sub="After annual Arvenix platform cost"
          emphasis
        />

        <Metric
          label="Working capital released"
          value={money.format(results.workingCapitalReleased)}
          sub="Cash released from inventory. Not counted as EBITDA."
        />

        <Metric
          label="Year 1 ROI"
          value={`${number.format(results.yearOneRoi * 100)}%`}
          sub={`${results.paybackMonths.toFixed(1)} month EBITDA payback`}
        />
      </section>

      <div className="layout">
        {/* LEFT SIDE */}
        <div className="inputsColumn">
          {/* COMPANY BASELINE */}
          <section className="panel">
            <div className="panelTitle">
              <h2>Company baseline</h2>
              <span>Core economics</span>
            </div>

            <div className="fieldGrid">
              <NumberInput
                label="Annual install volume"
                value={inputs.annualInstalls}
                onChange={(v) => set("annualInstalls", v)}
                step={100}
                help="Current annual completed installation volume."
              />

              <NumberInput
                label="Average job revenue"
                prefix="$"
                value={inputs.averageJobRevenue}
                onChange={(v) => set("averageJobRevenue", v)}
                step={500}
              />

              <NumberInput
                label="Inventory on hand"
                prefix="$"
                value={inputs.inventoryValue}
                onChange={(v) => set("inventoryValue", v)}
                step={100000}
                help="Predetermined Arvenix baseline: $8 million."
              />

              <NumberInput
                label="Labor"
                suffix="%"
                value={inputs.laborPercent * 100}
                onChange={(v) =>
                  set("laborPercent", v / 100)
                }
                step={0.5}
                max={100}
              />

              <NumberInput
                label="Materials"
                suffix="%"
                value={inputs.materialPercent * 100}
                onChange={(v) =>
                  set("materialPercent", v / 100)
                }
                step={0.5}
                max={100}
              />

              <NumberInput
                label="Marketing"
                suffix="%"
                value={inputs.marketingPercent * 100}
                onChange={(v) =>
                  set("marketingPercent", v / 100)
                }
                step={0.5}
                max={100}
              />
            </div>

            <div className="formulaCallout">
              <span>Fully loaded contribution margin</span>

              <strong>
                {number.format(
                  results.contributionMargin * 100
                )}
                %
              </strong>

              <small>
                100% less labor, materials, and marketing. Used
                to convert recovered revenue into EBITDA
                contribution.
              </small>
            </div>
          </section>

          {/* CAPACITY RECOVERY */}
          <section className="panel">
            <div className="panelTitle">
              <h2>Sustainable capacity recovery</h2>
              <span>Revenue opportunity</span>
            </div>

            <div className="fieldGrid">
              <NumberInput
                label="Sustainable capacity recovery"
                suffix="%"
                value={
                  inputs.sustainableCapacityRecoveryPercent *
                  100
                }
                onChange={(v) =>
                  set(
                    "sustainableCapacityRecoveryPercent",
                    v / 100
                  )
                }
                step={0.5}
                max={20}
                help="Default: 7% of existing annual installation volume."
              />

              <NumberInput
                label="Annual install volume"
                value={inputs.annualInstalls}
                onChange={(v) => set("annualInstalls", v)}
                step={100}
                help="Used as the base for sustainable recovery."
              />
            </div>

            <div className="resultList">
              <div>
                <span>Current annual installs</span>
                <strong>
                  {Math.round(
                    inputs.annualInstalls
                  ).toLocaleString()}
                </strong>
              </div>

              <div>
                <span>Sustainable recovery rate</span>
                <strong>
                  {number.format(
                    inputs.sustainableCapacityRecoveryPercent *
                      100
                  )}
                  %
                </strong>
              </div>

              <div>
                <span>Recovered installs</span>
                <strong>
                  {number.format(results.recoveredInstalls)}
                </strong>
              </div>

              <div>
                <span>Recovered revenue</span>
                <strong>
                  {money.format(results.recoveredRevenue)}
                </strong>
              </div>

              <div className="total">
                <span>Capacity EBITDA opportunity</span>
                <strong>
                  {money.format(
                    results.capacityEbitdaContribution
                  )}
                </strong>
              </div>
            </div>

            <p className="disclaimer">
              Capacity recovery is based on a percentage of
              existing installation volume. It does not assume
              theoretical maximum technician capacity. The
              default 7% represents sustainable recovery through
              better material readiness, scheduling, backlog
              management, geographic utilization, and reduced
              operational disruption.
            </p>
          </section>

          {/* INVENTORY */}
          <section className="panel">
            <div className="panelTitle">
              <h2>Inventory optimization</h2>
              <span>Working capital + EBITDA</span>
            </div>

            <div className="fieldGrid">
              <NumberInput
                label="Inventory reduction"
                suffix="%"
                value={
                  inputs.inventoryReductionPercent * 100
                }
                onChange={(v) =>
                  set(
                    "inventoryReductionPercent",
                    v / 100
                  )
                }
                step={1}
                max={100}
                help="Reduction in inventory required to support the same operating volume."
              />

              <NumberInput
                label="Inventory carrying cost"
                suffix="%"
                value={
                  inputs.inventoryCarryingCostPercent * 100
                }
                onChange={(v) =>
                  set(
                    "inventoryCarryingCostPercent",
                    v / 100
                  )
                }
                step={1}
                max={100}
                help="Estimated annual cost of carrying excess inventory."
              />
            </div>

            <div className="resultList">
              <div>
                <span>Inventory baseline</span>
                <strong>
                  {money.format(inputs.inventoryValue)}
                </strong>
              </div>

              <div>
                <span>Inventory released</span>
                <strong>
                  {money.format(results.inventoryReduction)}
                </strong>
              </div>

              <div className="total">
                <span>Annual carrying cost savings</span>
                <strong>
                  {money.format(
                    results.inventoryCarryingCostSavings
                  )}
                </strong>
              </div>
            </div>

            <p className="disclaimer">
              Inventory reduction is treated as working capital
              release. Only the avoided annual carrying cost is
              included in EBITDA improvement.
            </p>
          </section>

          {/* OTHER OPERATIONAL IMPROVEMENTS */}
          <section className="panel">
            <div className="panelTitle">
              <h2>Operational improvement</h2>
              <span>Editable annual assumptions</span>
            </div>

            <div className="fieldGrid">
              <NumberInput
                label="Warehouse savings"
                prefix="$"
                value={inputs.warehouseSavings}
                onChange={(v) =>
                  set("warehouseSavings", v)
                }
                step={10000}
                help="Reduced storage footprint, overflow, or third-party warehouse expense."
              />

              <NumberInput
                label="Freight / transfer savings"
                prefix="$"
                value={inputs.freightTransferSavings}
                onChange={(v) =>
                  set("freightTransferSavings", v)
                }
                step={10000}
                help="Reduced unnecessary transfers, repositioning, and expedited freight."
              />

              <NumberInput
                label="Inventory shrink savings"
                prefix="$"
                value={inputs.inventoryShrinkSavings}
                onChange={(v) =>
                  set("inventoryShrinkSavings", v)
                }
                step={10000}
                help="Reduction in lost, damaged, stranded, or unaccounted inventory."
              />

              <NumberInput
                label="Admin labor savings"
                prefix="$"
                value={inputs.adminLaborSavings}
                onChange={(v) =>
                  set("adminLaborSavings", v)
                }
                step={10000}
                help="Reduced manual reconciliation, reporting, follow-up, and exception handling."
              />

              <NumberInput
                label="Rework / repeat trip savings"
                prefix="$"
                value={inputs.reworkSavings}
                onChange={(v) => set("reworkSavings", v)}
                step={10000}
                help="Avoided repeat trips, material errors, and preventable operational rework."
              />

              <NumberInput
                label="Backlog / cancellation savings"
                prefix="$"
                value={
                  inputs.backlogCancellationSavings
                }
                onChange={(v) =>
                  set("backlogCancellationSavings", v)
                }
                step={10000}
                help="Default is $0 to avoid double counting recovered capacity."
              />
            </div>
          </section>

          {/* ARVENIX COST */}
          <section className="panel">
            <div className="panelTitle">
              <h2>Arvenix investment</h2>
              <span>Customer cost</span>
            </div>

            <div className="fieldGrid two">
              <NumberInput
                label="Implementation"
                prefix="$"
                value={inputs.implementationCost}
                onChange={(v) =>
                  set("implementationCost", v)
                }
                step={5000}
              />

              <NumberInput
                label="Annual platform cost"
                prefix="$"
                value={inputs.annualArvenixCost}
                onChange={(v) =>
                  set("annualArvenixCost", v)
                }
                step={5000}
              />
            </div>
          </section>
        </div>

        {/* RIGHT SIDE */}
        <div className="resultsColumn">
          <section className="panel sticky">
            <div className="panelTitle">
              <h2>Annual value creation</h2>
              <span>EBITDA impact</span>
            </div>

            <div className="bars">
              {benefitRows.map(([label, value]) => (
                <div className="barRow" key={label}>
                  <div className="barLabel">
                    <span>{label}</span>
                    <strong>{money.format(value)}</strong>
                  </div>

                  <div className="track">
                    <div
                      className="fill"
                      style={{
                        width: `${
                          (value / maxBenefit) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="divider" />

            <div className="resultList">
              <div>
                <span>Direct operating savings</span>
                <strong>
                  {money.format(directOperatingSavings)}
                </strong>
              </div>

              <div>
                <span>Recovered installs</span>
                <strong>
                  {number.format(
                    results.recoveredInstalls
                  )}
                </strong>
              </div>

              <div>
                <span>Recovered revenue</span>
                <strong>
                  {money.format(results.recoveredRevenue)}
                </strong>
              </div>

              <div>
                <span>Revenue contribution margin</span>
                <strong>
                  {number.format(
                    results.contributionMargin * 100
                  )}
                  %
                </strong>
              </div>

              <div>
                <span>Capacity EBITDA contribution</span>
                <strong>
                  {money.format(
                    results.capacityEbitdaContribution
                  )}
                </strong>
              </div>

              <div className="total">
                <span>Gross EBITDA opportunity</span>
                <strong>
                  {money.format(
                    results.grossEbitdaOpportunity
                  )}
                </strong>
              </div>

              <div>
                <span>Annual Arvenix expense</span>
                <strong>
                  ({money.format(inputs.annualArvenixCost)})
                </strong>
              </div>

              <div className="net">
                <span>Net recurring EBITDA impact</span>
                <strong>
                  {money.format(
                    results.recurringNetEbitdaImpact
                  )}
                </strong>
              </div>
            </div>

            <div className="roiBox">
              <div>
                <span>Year 1 cost</span>
                <strong>
                  {money.format(results.yearOneCost)}
                </strong>
              </div>

              <div>
                <span>Year 1 net benefit</span>
                <strong>
                  {money.format(results.yearOneNetBenefit)}
                </strong>
              </div>

              <div>
                <span>Year 1 ROI</span>
                <strong>
                  {number.format(
                    results.yearOneRoi * 100
                  )}
                  %
                </strong>
              </div>

              <div>
                <span>Recurring ROI</span>
                <strong>
                  {number.format(
                    results.recurringRoi * 100
                  )}
                  %
                </strong>
              </div>

              <div>
                <span>EBITDA payback</span>
                <strong>
                  {results.paybackMonths.toFixed(1)} months
                </strong>
              </div>

              <div>
                <span>Working capital released</span>
                <strong>
                  {money.format(
                    results.workingCapitalReleased
                  )}
                </strong>
              </div>
            </div>

            <p className="disclaimer">
              Working capital release is shown separately and is
              not included in EBITDA or ROI. Recovered revenue is
              converted to EBITDA contribution using the fully
              loaded contribution margin rather than counted
              dollar for dollar. Backlog and cancellation savings
              default to zero to reduce the risk of double
              counting recovered installation capacity.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
