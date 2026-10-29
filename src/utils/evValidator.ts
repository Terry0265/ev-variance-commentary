import { WbsRow, ValidationReport } from '../types/evTypes';

export function validateEvData(
  rows: WbsRow[],
  approvedBudget: number,
  managementReserve: number
): ValidationReport {
  const missingAcRows: { wbs: string; name: string }[] = [];
  const missingFields: string[] = [];
  const warnings: string[] = [];

  if (rows.length === 0) {
    missingFields.push('No WBS rows detected in the input data.');
  }

  if (isNaN(approvedBudget) || approvedBudget <= 0) {
    missingFields.push('Approved Budget is missing or zero.');
  }

  // Check each WBS row
  for (const row of rows) {
    if (row.ac === null || isNaN(row.ac)) {
      missingAcRows.push({
        wbs: row.wbs || 'Unnumbered',
        name: row.name || 'Unnamed WBS Package',
      });
    }

    if (isNaN(row.bac) || row.bac < 0) {
      missingFields.push(`Missing or invalid BAC for ${row.wbs} (${row.name})`);
    }
    if (isNaN(row.pv) || row.pv < 0) {
      missingFields.push(`Missing or invalid PV for ${row.wbs} (${row.name})`);
    }
    if (isNaN(row.ev) || row.ev < 0) {
      missingFields.push(`Missing or invalid EV for ${row.wbs} (${row.name})`);
    }
  }

  // Calculate sum of WBS BAC
  const wbsTotalBac = rows.reduce((acc, r) => acc + (isNaN(r.bac) ? 0 : r.bac), 0);
  const diff = approvedBudget - wbsTotalBac;
  const hasGap = Math.abs(diff) > 1000;

  let gapDescription = '';
  if (hasGap) {
    const formattedWbs = (wbsTotalBac / 1_000_000).toFixed(1) + 'M';
    const formattedBudget = (approvedBudget / 1_000_000).toFixed(1) + 'M';
    gapDescription = `Budget gap detected: Sum of WBS BAC is $${formattedWbs} CAD vs Approved Budget of $${formattedBudget} CAD ($${Math.abs(diff).toLocaleString('en-CA')} CAD discrepancy).`;
    warnings.push(gapDescription);
  }

  const isValid = missingAcRows.length === 0 && missingFields.length === 0;
  // Rule: "Never: Guess a missing number... or write a commentary when data is missing."
  const canGenerateCommentary = isValid;

  return {
    isValid,
    canGenerateCommentary,
    missingAcRows,
    missingFields,
    budgetGap: {
      wbsTotalBac,
      approvedBudget,
      difference: diff,
      hasGap,
      description: gapDescription,
    },
    warnings,
  };
}
