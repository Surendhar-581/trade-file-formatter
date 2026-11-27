import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const WorkflowBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-slate-900/60 border border-cyan-500/30 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 border border-cyan-500/30">
          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            Verified Service Specifications (MatrixTradeResponseFixedWidthFileProcessor)
            <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              LRECL 200 Exactly
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Automates the manual workflow: takes the outbound trade file from WinSCP{' '}
            <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded font-mono">/MATRIX/outbound/</code>,
            calculates Units from NAV (<code className="text-slate-300 font-mono">Units = Dollars / NAV</code>),
            populates Settlement Date (Cols 94–101), Status{' '}
            <code className="text-emerald-400 font-mono font-bold">037</code> (Confirmed / Settled),
            NAV (Cols 102–113), updates 999 & TLR, formats the Inbound file for{' '}
            <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded font-mono">/MATRIX/inbound/</code>,
            and triggers the inbound processing API.
          </p>
        </div>
      </div>
      <div className="font-mono-code text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-slate-300 shrink-0 space-y-1">
        <div className="text-[11px] text-cyan-400 font-semibold">Service Field Layout:</div>
        <div className="text-[11px] text-slate-400">• Units (41-54): <span className="text-white">14 digits (10 int + 4 dec)</span></div>
        <div className="text-[11px] text-slate-400">• Dollars (55-70): <span className="text-white">16 digits (14 int + 2 dec)</span></div>
        <div className="text-[11px] text-slate-400">• Status (88-90): <span className="text-emerald-400 font-bold">037</span> | Reject (91-93): <span className="text-slate-300">000</span></div>
        <div className="text-[11px] text-slate-400">• NAV (102-113): <span className="text-purple-400">12 digits (6 int + 6 dec)</span></div>
      </div>
    </div>
  );
};
