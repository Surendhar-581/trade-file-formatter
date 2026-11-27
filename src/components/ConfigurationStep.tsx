import React, { useState } from 'react';
import { TradeOrderRecord, HeaderConfig } from '../types/trade';
import { formatCurrency, padZero } from '../utils/tradeFormatter';
import { Calendar, DollarSign, Sparkles } from 'lucide-react';

interface ConfigurationStepProps {
  records: TradeOrderRecord[];
  headerConfig: HeaderConfig;
  onUpdateRecord: (id: number, updates: Partial<TradeOrderRecord>) => void;
  onApplyAllSettlementDate: (date: string) => void;
  onApplyAllNav: (nav: number) => void;
  onUpdateHeaderConfig: (updates: Partial<HeaderConfig>) => void;
  onGenerate: () => void;
}

export const ConfigurationStep: React.FC<ConfigurationStepProps> = ({
  records,
  headerConfig,
  onUpdateRecord,
  onApplyAllSettlementDate,
  onApplyAllNav,
  onUpdateHeaderConfig,
  onGenerate
}) => {
  const [globalDate, setGlobalDate] = useState('20261126');
  const [globalNav, setGlobalNav] = useState('10.00');

  const handleGlobalDateApply = () => {
    if (globalDate.trim().length === 8) {
      onApplyAllSettlementDate(globalDate.trim());
    } else {
      alert('Please enter an 8-digit date in YYYYMMDD format.');
    }
  };

  const handleGlobalNavApply = () => {
    const navVal = parseFloat(globalNav);
    if (!isNaN(navVal) && navVal > 0) {
      onApplyAllNav(navVal);
    } else {
      alert('Please enter a valid positive NAV value.');
    }
  };

  return (
    <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/30">
              2
            </span>
            Configure Settlement Date, NAV & Trade Confirmation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Apply globally or edit line-by-line. Units are automatically calculated:{' '}
            <code className="text-slate-300 font-mono">Units = Dollars / NAV</code>
          </p>
        </div>

        {/* Global Bulk Inputs */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 shadow-inner">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <label className="text-xs text-slate-400 whitespace-nowrap">Settlement Date:</label>
            <input
              type="text"
              maxLength={8}
              value={globalDate}
              onChange={(e) => setGlobalDate(e.target.value)}
              placeholder="YYYYMMDD"
              className="bg-transparent text-xs text-white font-mono-code focus:outline-none w-24 text-center border-b border-cyan-500"
            />
            <button
              onClick={handleGlobalDateApply}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium px-2 py-0.5 rounded bg-cyan-950/60 hover:bg-cyan-900/60 transition cursor-pointer"
            >
              Apply All
            </button>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 shadow-inner">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <label className="text-xs text-slate-400 whitespace-nowrap">NAV ($):</label>
            <input
              type="number"
              step="0.01"
              min="0.0001"
              value={globalNav}
              onChange={(e) => setGlobalNav(e.target.value)}
              className="bg-transparent text-xs text-white font-mono-code focus:outline-none w-16 text-center border-b border-cyan-500"
            />
            <button
              onClick={handleGlobalNavApply}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium px-2 py-0.5 rounded bg-cyan-950/60 hover:bg-cyan-900/60 transition cursor-pointer"
            >
              Apply All
            </button>
          </div>
        </div>
      </div>

      {/* QA Partner Header Options */}
      <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="chkUsePartnerHeader"
              checked={headerConfig.usePartnerHeader}
              onChange={(e) => onUpdateHeaderConfig({ usePartnerHeader: e.target.checked })}
              className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 focus:ring-cyan-500 cursor-pointer"
            />
            <label htmlFor="chkUsePartnerHeader" className="text-xs font-semibold text-white cursor-pointer flex items-center gap-2">
              Populate QA Partner Header (<span className="text-cyan-400 font-mono">CONGRUENT TEST PLATF / 7040</span>)
            </label>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
              Tester Preferred
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Header Cols 24–50 mapping</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-medium block mb-1">
              Client Name (Cols 24–43, 20 chars)
            </label>
            <input
              type="text"
              maxLength={20}
              value={headerConfig.clientName}
              onChange={(e) => onUpdateHeaderConfig({ clientName: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-medium block mb-1">
              Client ID (Cols 44–47, 4 chars)
            </label>
            <input
              type="text"
              maxLength={4}
              value={headerConfig.clientId}
              onChange={(e) => onUpdateHeaderConfig({ clientId: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-medium block mb-1">
              Batch Number (Cols 48–50, 3 digits)
            </label>
            <input
              type="text"
              maxLength={3}
              value={headerConfig.batchNumber}
              onChange={(e) => onUpdateHeaderConfig({ batchNumber: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Line</th>
              <th className="py-3 px-4">CUSIP</th>
              <th className="py-3 px-4">Order Number</th>
              <th className="py-3 px-4">Principal Amount</th>
              <th className="py-3 px-4">Settlement Date (YYYYMMDD)</th>
              <th className="py-3 px-4">NAV ($)</th>
              <th className="py-3 px-4">Calculated Units</th>
              <th className="py-3 px-4 text-emerald-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
            {records.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                  No records loaded. Please upload a file or click a sample button above.
                </td>
              </tr>
            ) : (
              records.map((rec, idx) => {
                const units = rec.nav > 0 ? rec.dollars / rec.nav : 0;
                const unitsInt = Math.floor(units);
                const unitsDec = Math.round((units - unitsInt) * 10000);
                const unitsFormatted = `${unitsInt}.${padZero(unitsDec, 4)}`;

                return (
                  <tr key={rec.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 text-center font-mono-code text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono-code font-semibold text-cyan-400">{rec.cusip}</td>
                    <td className="py-3 px-4 font-mono-code text-blue-300">{rec.orderNumber.trim()}</td>
                    <td className="py-3 px-4 font-mono-code text-emerald-400 font-medium">{formatCurrency(rec.dollars)}</td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        maxLength={8}
                        value={rec.settlementDate}
                        onChange={(e) => onUpdateRecord(rec.id, { settlementDate: e.target.value })}
                        className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono-code focus:border-cyan-500 focus:outline-none text-center"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        step="0.01"
                        min="0.0001"
                        value={rec.nav}
                        onChange={(e) => {
                          const navVal = parseFloat(e.target.value) || 0.0001;
                          onUpdateRecord(rec.id, { nav: navVal, units: rec.dollars / navVal });
                        }}
                        className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono-code focus:border-cyan-500 focus:outline-none text-center"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono-code font-bold text-white">{unitsFormatted}</td>
                    <td className="py-3 px-4 font-mono-code">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[11px]">
                        037 (Confirmed)
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Action Button */}
      {records.length > 0 && (
        <div className="flex justify-end pt-2">
          <button
            onClick={onGenerate}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition transform active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Inbound Matrix File & Preview</span>
          </button>
        </div>
      )}
    </section>
  );
};
