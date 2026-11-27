import { TradeOrderRecord, HeaderConfig, FormattedTradeFile, DetailLineBreakdown } from '../types/trade';

export function padZero(num: number | string, len: number): string {
  return String(num).padStart(len, '0');
}

export function formatCurrency(val: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
}

export function formatInboundDetailLine(rec: TradeOrderRecord, batchId: string): { fullLine: string; breakdown: DetailLineBreakdown } {
  const { cusip, tradeDate, account, tradeType, nsccType, udInd, dollars, commInd, orderNumber, settlementDate, nav } = rec;

  // 1. Cols 1-3: Record Type (3)
  const field1_recType = '001';
  // 2. Cols 4-12: CUSIP (9)
  const field2_cusip = cusip.padEnd(9, ' ').substring(0, 9);
  // 3. Cols 13-20: Trade Date (8, YYYYMMDD)
  const field3_tradeDate = tradeDate.padStart(8, '0').substring(0, 8);
  // 4. Cols 21-36: MSCS Account (16)
  const field4_account = account.padEnd(16, ' ').substring(0, 16);
  // 5. Cols 37-38: Trade Type (2)
  const field5_tradeType = tradeType.padEnd(2, '0').substring(0, 2);
  // 6. Col 39: NSCC Transaction Type (1) = "3"
  const field6_nscc = nsccType.substring(0, 1);
  // 7. Col 40: Units/Dollars Indicator (1) = "D"
  const field7_ud = udInd.substring(0, 1);

  // 8. Cols 41-54: Units (14 digits: 10 integer digits ending at Col 50, 4 decimal digits ending at Col 54)
  const units = nav > 0 ? dollars / nav : 0;
  const unitsInt = Math.floor(units);
  const unitsDec = Math.round((units - unitsInt) * 10000);
  const field8_units = padZero(unitsInt, 10) + padZero(unitsDec, 4); // 10 + 4 = 14 digits

  // 9. Cols 55-70: Dollars (16 digits: 14 integer digits, 2 decimal digits)
  const dollarsCents = Math.round(dollars * 100);
  const field9_dollars = padZero(dollarsCents, 16); // 16 digits

  // 10. Col 71: Commissionable Indicator (1) = "N"
  const field10_comm = commInd.substring(0, 1);
  // 11. Cols 72-87: Order Number (16)
  const field11_orderNum = orderNumber.padEnd(16, ' ').substring(0, 16);
  // 12. Cols 88-90: Trade Process Status (3) = "037" (Confirmed/Settled)
  const field12_status = rec.status || '037';
  // 13. Cols 91-93: Trade Reject Code (3) = "000"
  const field13_reject = rec.rejectCode || '000';
  // 14. Cols 94-101: Settlement Date (8, YYYYMMDD)
  const field14_settlementDate = settlementDate.padStart(8, '0').substring(0, 8);

  // 15. Cols 102-113: NAV (12 digits: 6 integer digits, 6 decimal digits)
  const navInt = Math.floor(nav);
  const navDec = Math.round((nav - navInt) * 1000000);
  const field15_nav = padZero(navInt, 6) + padZero(navDec, 6); // 6 + 6 = 12 digits

  // 16-21. Cols 114-186: Confirm Amount, Fee, Concession, Accrual, Accrual Type, Batch Date (73 spaces)
  const field16_21_filler = ' '.repeat(73);
  // 22. Cols 187-189: User Batch ID (3)
  const field22_batchId = (batchId || '001').padStart(3, '0').substring(0, 3);
  // 23. Cols 190-200: ROA Amount / Filler (11 spaces)
  const field23_filler = ' '.repeat(11);

  const fullLine = field1_recType +
                   field2_cusip +
                   field3_tradeDate +
                   field4_account +
                   field5_tradeType +
                   field6_nscc +
                   field7_ud +
                   field8_units +
                   field9_dollars +
                   field10_comm +
                   field11_orderNum +
                   field12_status +
                   field13_reject +
                   field14_settlementDate +
                   field15_nav +
                   field16_21_filler +
                   field22_batchId +
                   field23_filler;

  return {
    fullLine,
    breakdown: {
      lineNum: rec.id + 1,
      fullLine,
      cusip: field2_cusip.trim(),
      units: field8_units,
      dollars: field9_dollars,
      orderNumber: field11_orderNum.trim(),
      status: field12_status,
      reject: field13_reject,
      settlementDate: field14_settlementDate,
      nav: field15_nav,
      batchId: field22_batchId
    }
  };
}

export function generateInboundFile(
  records: TradeOrderRecord[],
  headerConfig: HeaderConfig,
  rawHeaderLine: string,
  tradeDate: string
): FormattedTradeFile {
  const lines: string[] = [];
  const breakdown: DetailLineBreakdown[] = [];

  // 1. Line 1: Header Record (Exact 200 chars)
  let header = '';
  const clientName = (headerConfig.clientName || 'CONGRUENT TEST PLATF').padEnd(20, ' ').substring(0, 20);
  const clientId = (headerConfig.clientId || '7040').padEnd(4, ' ').substring(0, 4);
  const batchNum = (headerConfig.batchNumber || '001').padStart(3, '0').substring(0, 3);
  const creationTime = headerConfig.creationTime || '170850';
  const submissionDate = tradeDate || headerConfig.submissionDate || '20261126';

  if (headerConfig.usePartnerHeader) {
    // Exact format expected by QA / Tester:
    // HDR (3) + 005 (3) + 002 (3) + Date (8) + Time (6) + ClientName (20) + ClientId (4) + Batch (3) + 150 spaces
    header = ('HDR005002' + submissionDate + creationTime + clientName + clientId + batchNum).padEnd(200, ' ');
  } else if (rawHeaderLine && rawHeaderLine.length >= 50) {
    header = rawHeaderLine.padEnd(200, ' ').substring(0, 200);
  } else {
    header = ('HDR005002' + submissionDate + creationTime + clientName + clientId + batchNum).padEnd(200, ' ');
  }
  lines.push(header);

  // 2. Lines 2..N-2: Detail Records
  let totalDollarsCents = 0;
  let totalUnitsScaled = 0; // Scaled by 10000

  records.forEach((rec, idx) => {
    const { fullLine, breakdown: rowBreakdown } = formatInboundDetailLine(rec, headerConfig.batchNumber);
    rowBreakdown.lineNum = idx + 2;
    lines.push(fullLine);
    breakdown.push(rowBreakdown);

    totalDollarsCents += Math.round(rec.dollars * 100);
    totalUnitsScaled += Math.round((rec.nav > 0 ? rec.dollars / rec.nav : 0) * 10000);
  });

  // 3. Line N-1: 999 Summary Record (Exact 200 chars)
  // Cols 1-3: 999
  // Cols 4-19: Total Dollars (16 digits: 14 int + 2 dec)
  // Cols 20-33: Total Units (14 digits: 10 int + 4 dec)
  // Cols 34-200: Filler (167 spaces)
  const sumDollars16 = padZero(totalDollarsCents, 16);
  const sumUnits14 = padZero(totalUnitsScaled, 14);
  const line999 = '999' + sumDollars16 + sumUnits14 + ' '.repeat(167);
  lines.push(line999);

  // 4. Line N: TLR Trailer Record (Exact 200 chars)
  // Cols 1-3: TLR
  // Cols 4-10: Total Line Count (7 digits)
  // Cols 11-200: Filler (190 spaces)
  const totalLines = lines.length + 1;
  const lineTlr = 'TLR' + padZero(totalLines, 7) + ' '.repeat(190);
  lines.push(lineTlr);

  const content = lines.join('\r\n');
  const fileName = `TRADE.${submissionDate}`;

  return {
    fileName,
    lines,
    content,
    totalLines: lines.length,
    totalDollars: totalDollarsCents / 100,
    totalUnits: totalUnitsScaled / 10000,
    breakdown
  };
}
