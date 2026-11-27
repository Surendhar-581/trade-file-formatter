import React, { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { WorkflowBanner } from './components/WorkflowBanner';
import { FileUploadStep } from './components/FileUploadStep';
import { ConfigurationStep } from './components/ConfigurationStep';
import { OutputPreviewStep } from './components/OutputPreviewStep';
import { ApiTriggerStep } from './components/ApiTriggerStep';
import { TradeOrderRecord, HeaderConfig, ApiTriggerConfig } from './types/trade';
import { parseOutboundFile } from './utils/tradeParser';
import { generateInboundFile } from './utils/tradeFormatter';

export const App: React.FC = () => {
  const [fileName, setFileName] = useState('');
  const [rawHeaderLine, setRawHeaderLine] = useState('');
  const [tradeDate, setTradeDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
  });
  const [records, setRecords] = useState<TradeOrderRecord[]>([]);

  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>({
    usePartnerHeader: true,
    clientName: 'CONGRUENT TEST PLATF',
    clientId: '7040',
    batchNumber: '001',
    submissionDate: tradeDate,
    creationTime: '170850'
  });

  const [apiConfig, setApiConfig] = useState<ApiTriggerConfig>({
    endpointUrl: 'http://localhost:5000/api/v1/TradeOutboundFileGeneration/TriggerInboundFileProcess',
    tenantIdentifier: 'demo',
    custodianIdentifier: 'Matrix',
    transmissionMode: 1,
    transmissionType: 1,
    tradeFileType: 2
  });

  // Load a file's content
  const loadFileContent = useCallback((content: string, name: string) => {
    const result = parseOutboundFile(content);
    setFileName(name);
    setRawHeaderLine(result.headerLine);
    setTradeDate(result.tradeDate);
    setRecords(result.records);

    setHeaderConfig((prev) => ({
      ...prev,
      submissionDate: result.tradeDate,
      batchNumber: result.batchId || '001'
    }));
  }, []);

  // Compute generated inbound file in real-time
  const formattedFile = useMemo(() => {
    if (records.length === 0) return null;
    return generateInboundFile(records, headerConfig, rawHeaderLine, tradeDate);
  }, [records, headerConfig, rawHeaderLine, tradeDate]);

  // Record updater
  const handleUpdateRecord = (id: number, updates: Partial<TradeOrderRecord>) => {
    setRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, ...updates } : rec))
    );
  };

  // Bulk Apply handlers
  const handleApplyAllSettlementDate = (date: string) => {
    setRecords((prev) => prev.map((r) => ({ ...r, settlementDate: date })));
  };

  const handleApplyAllNav = (nav: number) => {
    setRecords((prev) =>
      prev.map((r) => ({ ...r, nav, units: r.dollars / nav }))
    );
  };

  const handleUpdateHeaderConfig = (updates: Partial<HeaderConfig>) => {
    setHeaderConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleUpdateApiConfig = (updates: Partial<ApiTriggerConfig>) => {
    setApiConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleReset = () => {
    setRecords([]);
    setFileName('');
    setRawHeaderLine('');
  };

  const totalDollars = useMemo(() => {
    return records.reduce((sum, r) => sum + r.dollars, 0);
  }, [records]);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen antialiased flex flex-col font-sans">
      <Header onReset={handleReset} hasData={records.length > 0} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        <WorkflowBanner />

        <FileUploadStep
          fileName={fileName}
          recordCount={records.length}
          totalDollars={totalDollars}
          tradeDate={tradeDate}
          onFileUpload={loadFileContent}
        />

        <ConfigurationStep
          records={records}
          headerConfig={headerConfig}
          onUpdateRecord={handleUpdateRecord}
          onApplyAllSettlementDate={handleApplyAllSettlementDate}
          onApplyAllNav={handleApplyAllNav}
          onUpdateHeaderConfig={handleUpdateHeaderConfig}
          onGenerate={() => {}}
        />

        <OutputPreviewStep formattedFile={formattedFile} />

        <ApiTriggerStep config={apiConfig} onUpdateConfig={handleUpdateApiConfig} />
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-4 text-center text-xs text-slate-500">
        <p>Matrix Trade Settlement Automation Tool • React TypeScript • Exact 200-byte LRECL alignment verified against C# Trade Service</p>
      </footer>
    </div>
  );
};

export default App;
