export interface TradeOrderRecord {
  id: number;
  originalLine: string;
  cusip: string;          // Cols 4-12 (9 chars)
  tradeDate: string;      // Cols 13-20 (8 chars: yyyyMMdd)
  account: string;        // Cols 21-36 (16 chars)
  tradeType: string;      // Cols 37-38 (2 chars)
  nsccType: string;       // Col 39 (1 char, '3')
  udInd: string;          // Col 40 (1 char, 'D' or 'U')
  dollars: number;        // From Cols 55-70
  commInd: string;        // Col 71 ('N')
  orderNumber: string;    // Cols 72-87 (16 chars)
  settlementDate: string; // Cols 94-101 (8 chars: yyyyMMdd)
  nav: number;            // Cols 102-113 (6 int + 6 dec)
  units: number;          // Calculated: dollars / nav
  status: string;         // Cols 88-90 ('037' Confirmed/Settled)
  rejectCode: string;     // Cols 91-93 ('000')
}

export interface HeaderConfig {
  usePartnerHeader: boolean;
  clientName: string;      // Cols 24-43 (20 chars, e.g. "CONGRUENT TEST PLATF")
  clientId: string;        // Cols 44-47 (4 chars, e.g. "7040")
  batchNumber: string;     // Cols 48-50 (3 digits, e.g. "001" or "821")
  submissionDate: string;  // Cols 10-17 (yyyyMMdd)
  creationTime: string;    // Cols 18-23 (HHmmss)
}

export interface ApiTriggerConfig {
  endpointUrl: string;
  tenantIdentifier: string;
  custodianIdentifier: string;
  transmissionMode: number;
  transmissionType: number;
  tradeFileType: number;
}

export interface DetailLineBreakdown {
  lineNum: number;
  fullLine: string;
  cusip: string;
  units: string;
  dollars: string;
  orderNumber: string;
  status: string;
  reject: string;
  settlementDate: string;
  nav: string;
  batchId: string;
}

export interface FormattedTradeFile {
  fileName: string;
  lines: string[];
  content: string;
  totalLines: number;
  totalDollars: number;
  totalUnits: number;
  breakdown: DetailLineBreakdown[];
}
