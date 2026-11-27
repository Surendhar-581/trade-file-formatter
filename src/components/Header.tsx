import React from 'react';
import { ArrowLeftRight, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  hasData: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, hasData }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold text-xl">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              Matrix Trade Automation Tool
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                React + TypeScript
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Fixed-Width 200 LRECL • WinSCP MATRIX/inbound Settlement & API Trigger
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasData && (
            <button
              onClick={onReset}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Clear Data</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
