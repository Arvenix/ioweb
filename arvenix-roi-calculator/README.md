# Arvenix ROI Calculator

A TypeScript + Next.js calculator for modeling operational ROI from cleaner inventory, reduced warehouse footprint, fewer transfers and shrink events, lower rework, improved install capacity, and reduced backlog/cancellation bleed.

## Predetermined baseline assumptions

- Inventory on hand: **$8,000,000**
- Labor: **15% of job revenue**
- Materials: **27% of job revenue**
- Marketing: **20% of job revenue**
- Incremental contribution margin: **38%** before other overhead

All values are editable in the UI. The baseline annual revenue and average job revenue are illustrative starter values.

## Financial treatment

The calculator intentionally separates:

1. **Direct operating savings**: carrying cost, warehouse, transfers, shrink, administrative labor, rework.
2. **Recovered revenue contribution**: recovered install capacity and backlog/cancellation revenue are multiplied by the calculated contribution margin rather than treated as dollar-for-dollar EBITDA.
3. **Working capital release**: reduced inventory is shown separately and is not added to EBITDA.
4. **Arvenix cost**: annual platform cost reduces recurring EBITDA benefit. Implementation cost is included in Year 1 ROI.

## Core formulas

```text
Contribution Margin % = 100% - Labor % - Materials % - Marketing %
Inventory Released = Inventory × Inventory Reduction %
Inventory Carrying Savings = Inventory Released × Carrying Cost %
Recovered Install Revenue = Recovered Jobs/Month × 12 × Average Job Revenue
Recovered Install Contribution = Recovered Install Revenue × Contribution Margin %
Backlog Recovered Contribution = Backlog Revenue Recovered × Contribution Margin %
Gross EBITDA Opportunity = Direct Operating Savings + Recovered Install Contribution + Backlog Recovered Contribution
Net Recurring EBITDA = Gross EBITDA Opportunity - Annual Arvenix Cost
Year 1 ROI = (Gross EBITDA Opportunity - Annual Arvenix Cost - Implementation Cost) / (Annual Arvenix Cost + Implementation Cost)
Payback Months = Year 1 Cost / (Gross EBITDA Opportunity / 12)
```

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## GitHub / Vercel

Push this directory to the Arvenix GitHub repository. Vercel can import the repository directly and will detect Next.js automatically.

## Next iterations

Recommended additions:

- Conservative / Expected / Aggressive scenarios
- Customer name and saved assessments
- PDF executive summary export
- Before vs. after KPI view
- Inventory turns and days-on-hand model
- Backlog aging / cancellation probability model
- Cycle-time-to-capacity model
- Multi-warehouse savings model
- Database persistence and authenticated customer accounts
