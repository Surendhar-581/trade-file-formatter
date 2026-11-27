import { TradeOrderRecord } from '../types/trade';

export interface ParsedOutboundResult {
  headerLine: string;
  records: TradeOrderRecord[];
  batchId: string;
  tradeDate: string;
}

export function parseOutboundFile(text: string): ParsedOutboundResult {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  let headerLine = '';
  let extractedTradeDate = '';
  let extractedBatchId = '001';
  const records: TradeOrderRecord[] = [];

  lines.forEach((line) => {
    if (line.startsWith('HDR')) {
      headerLine = line.padEnd(200, ' ').substring(0, 200);
      const hdrDate = line.substring(9, 17).trim();
      if (hdrDate) extractedTradeDate = hdrDate;
      const hdrBatch = line.substring(47, 50).trim();
      if (hdrBatch) extractedBatchId = hdrBatch;
    } else if (line.startsWith('001')) {
      // Exact field extractions according to MatrixTradeResponseFixedWidthFileProcessor:
      // Field 1: Record Type (1-3) = 001
      // Field 2: CUSIP (4-12, len 9)
      const cusip = line.substring(3, 12).trim();
      // Field 3: Trade Date (13-20, len 8)
      const tradeDate = line.substring(12, 20).trim();
      if (!extractedTradeDate && tradeDate) extractedTradeDate = tradeDate;
      // Field 4: MSCS Account (21-36, len 16)
      const account = line.substring(20, 36);
      // Field 5: Trade Type (37-38, len 2)
      const tradeType = line.substring(36, 38);
      // Field 6: NSCC Type (39, len 1)
      const nsccType = line.substring(38, 39);
      // Field 7: U/D Indicator (40, len 1)
      const udInd = line.substring(39, 40);
      // Field 9: Dollars in outbound (55-70, len 16, 14 int + 2 dec)
      const rawDollarsStr = line.substring(54, 70);
      const rawDollarsCents = parseInt(rawDollarsStr, 10) || 0;
      const dollars = rawDollarsCents / 100;
      // Field 10: Commissionable Indicator (71, len 1)
      const commInd = line.substring(70, 71) || 'N';
      // Field 11: Order Number (72-87, len 16)
      const orderNumber = line.substring(71, 87);

      records.push({
        id: records.length + 1,
        originalLine: line,
        cusip,
        tradeDate: tradeDate || extractedTradeDate || '20261126',
        account: account.padEnd(16, ' ').substring(0, 16),
        tradeType: tradeType.padEnd(2, '0').substring(0, 2),
        nsccType: nsccType || '3',
        udInd: udInd || 'D',
        dollars,
        commInd: commInd || 'N',
        orderNumber: orderNumber.padEnd(16, ' ').substring(0, 16),
        settlementDate: tradeDate || extractedTradeDate || '20261126',
        nav: 10.00,
        units: dollars / 10.00,
        status: '037',
        rejectCode: '000'
      });
    }
  });

  return {
    headerLine,
    records,
    batchId: extractedBatchId,
    tradeDate: extractedTradeDate || '20261126'
  };
}
