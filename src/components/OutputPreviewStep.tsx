import React, { useState } from 'react';
import { FormattedTradeFile } from '../types/trade';
import { formatCurrency } from '../utils/tradeFormatter';
import { Copy, Download, Check } from 'lucide-react';

interface OutputPreviewStepProps {
  formattedFile: FormattedTradeFile | null;
}

export const OutputPreviewStep: React.FC<OutputPreviewStepProps> = ({ formattedFile }) => {
  const [activeTab, setActiveTab] = useState<'raw' | 'visual'>('raw');
  const [copied, setCopied] = useState(false);

  if (!formattedFile) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedFile.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([formattedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = formattedFile.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/30">
              3
            </span>
            Generated Inbound Matrix File (for <span className="font-mono text-cyan-400">/MATRIX/inbound/</span>)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict 200-column fixed-width format. Ready to save directly into WinSCP inbound folder.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Inbound Content'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {formattedFile.fileName}</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">Target File Name:</span>
          <span className="text-xs font-semibold text-cyan-400 font-mono-code">{formattedFile.fileName}</span>
        </div>
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">Total Lines:</span>
          <span className="text-xs font-semibold text-white font-mono-code">{formattedFile.totalLines}</span>
        </div>
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">999 Total Dollars:</span>
          <span className="text-xs font-semibold text-emerald-400 font-mono-code">{formatCurrency(formattedFile.totalDollars)}</span>
        </div>
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">999 Total Units:</span>
          <span className="text-xs font-semibold text-cyan-400 font-mono-code">{formattedFile.totalUnits.toFixed(4)}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('raw')}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition cursor-pointer ${
            activeTab === 'raw'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Raw Fixed-Width Text (Exact 200-Col LRECL)
        </button>
        <button
          onClick={() => setActiveTab('visual')}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition cursor-pointer ${
            activeTab === 'visual'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Field-by-Field Breakdown
        </button>
      </div>

      {/* Tab 1: Raw Fixed Width Text with Ruler */}
      {activeTab === 'raw' && (
        <div className="space-y-2">
          {/* 200 Column Ruler */}
          <div className="overflow-x-auto bg-slate-950 rounded-t-xl border border-slate-800 p-2.5 font-mono-code text-[11px] text-slate-400 select-none whitespace-pre border-b-2 border-cyan-500/40">
Line  |----+----10---+----20---+----30---+----40<span className="text-cyan-400 font-bold">----+----50---4</span><span className="text-emerald-400 font-bold">5---+----60---+----70</span><span className="text-slate-300">1</span><span className="text-blue-400">----+----80-----7</span><span className="text-amber-400 font-bold">88-90</span><span className="text-slate-400">91-3</span><span className="text-amber-300 font-bold">94--+--101</span><span className="text-purple-400 font-bold">102----+--113</span>114---------186<span className="text-pink-400">187-9</span>190-------200
Col # | 1-3 Rec | 4-12 CUSIP | 13-20 Dt | 21-36 Acct | 37-8 | 39 | 40 | <span className="text-cyan-400 font-bold">41-54 Units   </span> | <span className="text-emerald-400 font-bold">55-70 Dollars  </span> | <span className="text-slate-300">C</span> | <span className="text-blue-400">72-87 Order#   </span> | <span className="text-amber-400 font-bold">037</span> | <span className="text-slate-400">000</span> | <span className="text-amber-300 font-bold">Settlement</span> | <span className="text-purple-400 font-bold">NAV (12)    </span> | Spaces (73) | <span className="text-pink-400">388</span> | Spaces (11)
          </div>
          {/* Monospace Output Box */}
          <div className="overflow-x-auto bg-slate-950 rounded-b-xl border border-slate-800 p-4 font-mono-code text-xs text-slate-200 leading-relaxed max-h-[500px]">
            <pre className="whitespace-pre">{formattedFile.content}</pre>
          </div>
        </div>
      )}

      {/* Tab 2: Visual Breakdown Table */}
      {activeTab === 'visual' && (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs font-mono-code">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Line</th>
                <th className="py-2.5 px-3">Rec Type</th>
                <th className="py-2.5 px-3 text-cyan-400">CUSIP (4-12)</th>
                <th className="py-2.5 px-3 text-cyan-400">Units (41-54, 14d)</th>
                <th className="py-2.5 px-3 text-emerald-400">Dollars (55-70, 16d)</th>
                <th className="py-2.5 px-3 text-blue-400">Order# (72-87)</th>
                <th className="py-2.5 px-3 text-amber-400 font-bold">Status (88-90)</th>
                <th className="py-2.5 px-3 text-slate-400">Reject (91-93)</th>
                <th className="py-2.5 px-3 text-amber-300">Settlement Dt (94-101)</th>
                <th className="py-2.5 px-3 text-purple-400">NAV (102-113, 12d)</th>
                <th className="py-2.5 px-3 text-pink-400">Batch (187-189)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 text-[11px]">
              {formattedFile.breakdown.map((row) => (
                <tr key={row.lineNum} className="hover:bg-slate-800/40 transition">
                  <td className="py-2 px-3 text-slate-500">{row.lineNum}</td>
                  <td className="py-2 px-3 text-slate-300">001</td>
                  <td className="py-2 px-3 text-cyan-400 font-semibold">{row.cusip}</td>
                  <td className="py-2 px-3 text-cyan-300">{row.units}</td>
                  <td className="py-2 px-3 text-emerald-400">{row.dollars}</td>
                  <td className="py-2 px-3 text-blue-300">{row.orderNumber}</td>
                  <td className="py-2 px-3 text-amber-400 font-bold">{row.status}</td>
                  <td className="py-2 px-3 text-slate-400">{row.reject}</td>
                  <td className="py-2 px-3 text-amber-300">{row.settlementDate}</td>
                  <td className="py-2 px-3 text-purple-300">{row.nav}</td>
                  <td className="py-2 px-3 text-pink-400">{row.batchId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
