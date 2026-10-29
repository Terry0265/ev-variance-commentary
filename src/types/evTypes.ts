/**
 * Types for Earned Value Analysis and Variance Commentary
 */

export interface WbsRow {
  id: string;
  wbs: string;
  name: string;
  bac: number;
  pv: number;
  ev: number;
  ac: number | null; // null if missing
  notes: string;
}

export interface ComputedWbsRow extends WbsRow {
  cv: number | null; // EV - AC
  sv: number;        // EV - PV
  cpi: number | null; // EV / AC
  spi: number;       // EV / PV
  cpiFlagged: boolean; // CPI < 0.95
  spiFlagged: boolean; // SPI < 0.95
  isFlagged: boolean;  // either index < 0.95
}

export interface ProjectEvTotals {
  totalBac: number;
  totalPv: number;
  totalEv: number;
  totalAc: number | null;
  totalCv: number | null;
  totalSv: number;
  totalCpi: number | null;
  totalSpi: number;
  cpiFlagged: boolean;
  spiFlagged: boolean;
  eac: number | null; // BAC / CPI
  approvedBudget: number;
  managementReserve: number;
  totalAuthorizedBudget: number; // approvedBudget + managementReserve
  varianceToApprovedBudget: number | null; // EAC - approvedBudget
  varianceToTotalAuthorized: number | null; // EAC - (approvedBudget + reserve)
  isOverReserve: boolean; // EAC > approvedBudget + reserve
  overReserveAmount: number; // in CAD
  requiresReserveDraw: boolean; // EAC > approvedBudget && EAC <= approvedBudget + reserve
  budgetGap: {
    wbsTotalBac: number;
    approvedBudget: number;
    difference: number; // approvedBudget - wbsTotalBac
    hasGap: boolean;
  };
}

export interface EvIssue {
  wbs: string;
  packageName: string;
  cpi: number | null;
  spi: number;
  cv: number | null;
  sv: number;
  cause: string; // "cause not stated" if missing
  impact: string; // Impact on In-Service Date
  action: string; // One constructive owner-side action
}

export interface EvCommentaryResult {
  projectName: string;
  dataDate?: string;
  inServiceDate?: string;
  threeSentenceSummary: {
    sentence1: string; // High-level health/performance (Overall CPI and SPI, cost/schedule health)
    sentence2: string; // Key variance driver and In-Service Date impact
    sentence3: string; // Financial forecast (EAC) vs approved budget & reserve position
    fullParagraph: string;
  };
  topIssues: EvIssue[];
  managementReserveNote: string;
  rawResponse?: string;
}

export interface ValidationReport {
  isValid: boolean;
  canGenerateCommentary: boolean;
  missingAcRows: { wbs: string; name: string }[];
  missingFields: string[];
  budgetGap: {
    wbsTotalBac: number;
    approvedBudget: number;
    difference: number;
    hasGap: boolean;
    description: string;
  };
  warnings: string[];
}

export interface ParseResult {
  projectName: string;
  approvedBudget: number;
  managementReserve: number;
  inServiceDate?: string;
  dataDate?: string;
  rows: WbsRow[];
  rawText: string;
  validation: ValidationReport;
}
