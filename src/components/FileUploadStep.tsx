import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { formatCurrency } from '../utils/tradeFormatter';

interface FileUploadStepProps {
  fileName: string;
  recordCount: number;
  totalDollars: number;
  tradeDate: string;
  onFileUpload: (content: string, fileName: string) => void;
}

export const FileUploadStep: React.FC<FileUploadStepProps> = ({
  fileName,
  recordCount,
  totalDollars,
  tradeDate,
  onFileUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onFileUpload(content, file.name);
    };
    reader.readAsText(file);
  };

  return (
    <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/30">
              1
            </span>
            Load Outbound File from WinSCP <span className="text-xs font-mono text-cyan-400">/MATRIX/outbound/</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload or drag & drop the raw outbound trade file (e.g.{' '}
            <code className="text-slate-300 font-mono">TRADE.YYYYMMDD.C*</code>)
          </p>
        </div>
        {recordCount > 0 && (
          <div className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{recordCount} Orders Parsed Successfully</span>
          </div>
        )}
      </div>

      {/* Drag & Drop Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 group ${
          isDragging
            ? 'border-cyan-400 bg-slate-900/80 scale-[1.01]'
            : 'border-slate-700 hover:border-cyan-500 bg-slate-950/40 hover:bg-slate-900/60'
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:scale-110 transition">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-200">
            Click to browse or drag and drop your raw Outbound Trade file here
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Supports any fixed-width Matrix trade files with HDR / 001 / 999 / TLR
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".txt,.dat,.*"
        />
      </div>

      {/* File Metadata Header Stats */}
      {recordCount > 0 && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">File Name</span>
            <p className="text-sm font-semibold text-white font-mono-code truncate mt-0.5">{fileName}</p>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Trades / Detail Lines</span>
            <p className="text-sm font-semibold text-cyan-400 font-mono-code mt-0.5">{recordCount}</p>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Dollar Amount</span>
            <p className="text-sm font-semibold text-emerald-400 font-mono-code mt-0.5">{formatCurrency(totalDollars)}</p>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Trade Date</span>
            <p className="text-sm font-semibold text-amber-400 font-mono-code mt-0.5">{tradeDate}</p>
          </div>
        </div>
      )}
    </section>
  );
};
