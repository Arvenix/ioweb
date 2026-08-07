"use client";

import { useMemo, useState } from "react";
import { calculateRoi, DEFAULT_INPUTS, type RoiInputs } from "@/lib/calculator";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const percent = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

function NumberInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
  help,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
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
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
        />
        {suffix && <span>{suffix}</span>}
      </div>
      {help && <small>{help}</small>}
    </label>
  );
}

function Metric({ label, value, sub, emphasis = false }: { label: string; value: string; sub?: string; emphasis?: boolean }) {
  return (
    <div className={emphasis ? "metric emphasis" : "metric"}>
      <span>{label}</span>
      <strong>{value}</strong>
      {sub && <small>{sub}</small>}
    </div>
  );
}

export default function Home() {
  const [inputs, setInputs] = useState<RoiInputs>(DEFAULT_INPUTS);
  const results = useMemo(() => calculateRoi(inputs), [inputs]);

  const set = (key: keyof RoiInputs, value: number) =>
    setInputs((current) => ({ ...current, [key]: value }));

  const benefitRows = [
    ["Inventory carrying cost", results.inventoryCarryingSavings],
    ["Warehouse footprint", inputs.warehouseSavings],
    ["Freight & transfers", inputs.freightTransferSavings],
    ["Inventory shrink", inputs.shrinkReduction],
    ["Administrative labor", inputs.adminLaborSavings],
    ["Rework / repeat trips", inputs.reworkSavings],
    ["Recovered install capacity", results.recoveredInstallContribution],
    ["Backlog / cancellation recovery", results.backlogRecoveredContribution],
  ] as const;

  const maxBenefit = Math.max(...benefitRows.map(([, value]) => value), 1);

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">ARVENIX</p>
          <h1>Operational ROI Calculator</h1>
          <p className="lede">
            Quantify EBITDA recovery, revenue capacity, and working capital released by improving inventory, backlog, and install execution.
          </p>
        </div>
        <button className="reset" onClick={() => setInputs(DEFAULT_INPUTS)}>Reset assumptions</button>
      </header>

      <section className="summaryGrid">
        <Metric label="Gross annual EBITDA opportunity" value={money.format(results.grossAnnualEbitdaImpact)} emphasis />
        <Metric label="Net recurring EBITDA impact" value={money.format(results.recurringNetEbitdaImpact)} sub="After annual Arvenix cost" emphasis />
        <Metric label="Working capital released" value={money.format(results.inventoryReleased)} sub="Not counted as EBITDA" />
        <Metric label="Year 1 ROI" value={`${percent.format(results.yearOneRoiPct)}%`} sub={`${results.paybackMonths?.toFixed(1) ?? "—"} month payback`} />
      </section>

      <div className="layout">
        <div className="inputsColumn">
          <section className="panel">
            <div className="panelTitle"><h2>Company baseline</h2><span>Core economics</span></div>
            <div className="fieldGrid">
              <NumberInput label="Annual revenue" prefix="$" value={inputs.annualRevenue} onChange={(v) => set("annualRevenue", v)} step={100000} />
              <NumberInput label="Inventory on hand" prefix="$" value={inputs.annualInventory} onChange={(v) => set("annualInventory", v)} step={100000} help="Predetermined baseline: $8M" />
              <NumberInput label="Average job revenue" prefix="$" value={inputs.averageJobRevenue} onChange={(v) => set("averageJobRevenue", v)} step={500} />
              <NumberInput label="Labor" suffix="%" value={inputs.laborPct} onChange={(v) => set("laborPct", v)} step={0.5} />
              <NumberInput label="Materials" suffix="%" value={inputs.materialPct} onChange={(v) => set("materialPct", v)} step={0.5} />
              <NumberInput label="Marketing" suffix="%" value={inputs.marketingPct} onChange={(v) => set("marketingPct", v)} step={0.5} />
            </div>
            <div className="formulaCallout">
              <span>Incremental contribution margin</span>
              <strong>{percent.format(results.contributionMarginPct)}%</strong>
              <small>100% less labor, materials, and marketing. Used only for recovered revenue.</small>
            </div>
          </section>

          <section className="panel">
            <div className="panelTitle"><h2>Operational improvement</h2><span>Editable assumptions</span></div>
            <div className="fieldGrid">
              <NumberInput label="Inventory reduction" suffix="%" value={inputs.inventoryReductionPct} onChange={(v) => set("inventoryReductionPct", v)} step={1} />
              <NumberInput label="Inventory carrying cost" suffix="%" value={inputs.inventoryCarryingCostPct} onChange={(v) => set("inventoryCarryingCostPct", v)} step={1} />
              <NumberInput label="Warehouse savings" prefix="$" value={inputs.warehouseSavings} onChange={(v) => set("warehouseSavings", v)} step={10000} />
              <NumberInput label="Freight / transfer savings" prefix="$" value={inputs.freightTransferSavings} onChange={(v) => set("freightTransferSavings", v)} step={10000} />
              <NumberInput label="Shrink reduction" prefix="$" value={inputs.shrinkReduction} onChange={(v) => set("shrinkReduction", v)} step={10000} />
              <NumberInput label="Admin labor savings" prefix="$" value={inputs.adminLaborSavings} onChange={(v) => set("adminLaborSavings", v)} step={10000} />
              <NumberInput label="Rework / repeat trip savings" prefix="$" value={inputs.reworkSavings} onChange={(v) => set("reworkSavings", v)} step={10000} />
              <NumberInput label="Recovered installs / month" value={inputs.recoveredJobsPerMonth} onChange={(v) => set("recoveredJobsPerMonth", v)} step={1} />
              <NumberInput label="Backlog revenue recovered" prefix="$" value={inputs.backlogCancellationRevenueRecovered} onChange={(v) => set("backlogCancellationRevenueRecovered", v)} step={50000} />
            </div>
          </section>

          <section className="panel">
            <div className="panelTitle"><h2>Arvenix investment</h2><span>Customer cost</span></div>
            <div className="fieldGrid two">
              <NumberInput label="Implementation" prefix="$" value={inputs.implementationCost} onChange={(v) => set("implementationCost", v)} step={5000} />
              <NumberInput label="Annual platform cost" prefix="$" value={inputs.annualArvenixCost} onChange={(v) => set("annualArvenixCost", v)} step={5000} />
            </div>
          </section>
        </div>

        <div className="resultsColumn">
          <section className="panel sticky">
            <div className="panelTitle"><h2>Annual value creation</h2><span>EBITDA impact</span></div>
            <div className="bars">
              {benefitRows.map(([label, value]) => (
                <div className="barRow" key={label}>
                  <div className="barLabel"><span>{label}</span><strong>{money.format(value)}</strong></div>
                  <div className="track"><div className="fill" style={{ width: `${(value / maxBenefit) * 100}%` }} /></div>
                </div>
              ))}
            </div>

            <div className="divider" />
            <div className="resultList">
              <div><span>Direct operating savings</span><strong>{money.format(results.directOperatingSavings)}</strong></div>
              <div><span>Recovered install revenue</span><strong>{money.format(results.recoveredInstallRevenue)}</strong></div>
              <div><span>Recovered install contribution</span><strong>{money.format(results.recoveredInstallContribution)}</strong></div>
              <div><span>Backlog recovered contribution</span><strong>{money.format(results.backlogRecoveredContribution)}</strong></div>
              <div className="total"><span>Gross EBITDA opportunity</span><strong>{money.format(results.grossAnnualEbitdaImpact)}</strong></div>
              <div><span>Annual Arvenix expense</span><strong>({money.format(inputs.annualArvenixCost)})</strong></div>
              <div className="net"><span>Net recurring EBITDA impact</span><strong>{money.format(results.recurringNetEbitdaImpact)}</strong></div>
            </div>

            <div className="roiBox">
              <div><span>Year 1 cost</span><strong>{money.format(results.yearOneCost)}</strong></div>
              <div><span>Year 1 net benefit</span><strong>{money.format(results.yearOneNetBenefit)}</strong></div>
              <div><span>Year 1 ROI</span><strong>{percent.format(results.yearOneRoiPct)}%</strong></div>
              <div><span>Recurring ROI</span><strong>{percent.format(results.recurringRoiPct)}%</strong></div>
            </div>

            <p className="disclaimer">
              Working capital release is shown separately and is not added to EBITDA. Revenue recovery is converted to operating contribution using the calculated contribution margin rather than counted dollar for dollar.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
