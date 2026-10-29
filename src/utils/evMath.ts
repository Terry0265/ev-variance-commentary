import { WbsRow, ComputedWbsRow, ProjectEvTotals } from '../types/evTypes';

/**
 * Deterministic EV Math Engine
 * All calculations are strictly done in code.
 */

export function computeWbsRows(rows: WbsRow[]): ComputedWbsRow[] {
  return rows.map((row) => {
    const hasAc = row.ac !== null && !isNaN(row.ac);
    const cv = hasAc ? row.ev - (row.ac as number) : null;
    const sv = row.ev - row.pv;
    
    // CPI = EV / AC
    let cpi: number | null = null;
    if (hasAc && (row.ac as number) > 0) {
      cpi = row.ev / (row.ac as number);
    } else if (hasAc && (row.ac as number) === 0 && row.ev === 0) {
      cpi = 1.0;
    }

    // SPI = EV / PV
    let spi = 1.0;
    if (row.pv > 0) {
      spi = row.ev / row.pv;
    } else if (row.pv === 0 && row.ev === 0) {
      spi = 1.0;
    }

    const cpiFlagged = cpi !== null && cpi < 0.95;
    const spiFlagged = spi < 0.95;

    return {
      ...row,
      cv,
      sv,
      cpi,
      spi,
      cpiFlagged,
      spiFlagged,
      isFlagged: cpiFlagged || spiFlagged,
    };
  });
}

export function computeTotals(
  rows: WbsRow[],
  approvedBudget: number,
  managementReserve: number
): ProjectEvTotals {
  let totalBac = 0;
  let totalPv = 0;
  let totalEv = 0;
  let totalAcSum = 0;
  let hasMissingAc = false;

  for (const row of rows) {
    totalBac += row.bac;
    totalPv += row.pv;
    totalEv += row.ev;
    if (row.ac === null || isNaN(row.ac)) {
      hasMissingAc = true;
    } else {
      totalAcSum += row.ac;
    }
  }

  const totalAc = hasMissingAc ? null : totalAcSum;
  const totalCv = totalAc !== null ? totalEv - totalAc : null;
  const totalSv = totalEv - totalPv;

  let totalCpi: number | null = null;
  if (totalAc !== null && totalAc > 0) {
    totalCpi = totalEv / totalAc;
  }

  let totalSpi = 1.0;
  if (totalPv > 0) {
    totalSpi = totalEv / totalPv;
  }

  const cpiFlagged = totalCpi !== null && totalCpi < 0.95;
  const spiFlagged = totalSpi < 0.95;

  // EAC = BAC / CPI
  let eac: number | null = null;
  if (totalCpi !== null && totalCpi > 0) {
    eac = totalBac / totalCpi;
  }

  const totalAuthorizedBudget = approvedBudget + managementReserve;
  const varianceToApprovedBudget = eac !== null ? eac - approvedBudget : null;
  const varianceToTotalAuthorized = eac !== null ? eac - totalAuthorizedBudget : null;
  
  const isOverReserve = varianceToTotalAuthorized !== null && varianceToTotalAuthorized > 0;
  const overReserveAmount = isOverReserve && varianceToTotalAuthorized ? varianceToTotalAuthorized : 0;
  const requiresReserveDraw = eac !== null && eac > approvedBudget && eac <= totalAuthorizedBudget;

  const budgetDifference = Math.abs(approvedBudget - totalBac);
  // Significant gap if difference > $1,000 CAD
  const hasGap = budgetDifference > 1000;

  return {
    totalBac,
    totalPv,
    totalEv,
    totalAc,
    totalCv,
    totalSv,
    totalCpi,
    totalSpi,
    cpiFlagged,
    spiFlagged,
    eac,
    approvedBudget,
    managementReserve,
    totalAuthorizedBudget,
    varianceToApprovedBudget,
    varianceToTotalAuthorized,
    isOverReserve,
    overReserveAmount,
    requiresReserveDraw,
    budgetGap: {
      wbsTotalBac: totalBac,
      approvedBudget,
      difference: approvedBudget - totalBac,
      hasGap,
    },
  };
}

/**
 * Format currency in CAD ($X,XXX CAD or $X.XXM CAD)
 */
export function formatCAD(val: number | null | undefined, compact = false): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  
  if (compact) {
    const absVal = Math.abs(val);
    const sign = val < 0 ? '-' : '';
    if (absVal >= 1_000_000) {
      return `${sign}$${(absVal / 1_000_000).toFixed(2)}M CAD`;
    }
    if (absVal >= 1_000) {
      return `${sign}$${Math.round(absVal / 1_000)}K CAD`;
    }
  }

  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(val) + ' CAD';
}

/**
 * Format index (CPI, SPI) to 2 decimal places
 */
export function formatIndex(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return val.toFixed(2);
}
