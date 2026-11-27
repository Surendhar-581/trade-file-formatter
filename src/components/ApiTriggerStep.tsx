import React, { useState } from 'react';
import { ApiTriggerConfig } from '../types/trade';
import { Send, Copy, Check } from 'lucide-react';

interface ApiTriggerStepProps {
  config: ApiTriggerConfig;
  onUpdateConfig: (updates: Partial<ApiTriggerConfig>) => void;
}

export const ApiTriggerStep: React.FC<ApiTriggerStepProps> = ({ config, onUpdateConfig }) => {
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<{
    status: 'idle' | 'success' | 'error' | 'network';
    message: string;
    details?: string;
  }>({ status: 'idle', message: '' });

  const payload = {
    tenantIdentifier: config.tenantIdentifier,
    custodianIndentifier: config.custodianIdentifier,
    transmissionMode: config.transmissionMode,
    transmissionType: config.transmissionType,
    tradeFileType: config.tradeFileType
  };

  const curlCommand = `curl -X POST "${config.endpointUrl}" -H "Content-Type: application/json" -d '${JSON.stringify(payload)}'`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand).then(() => {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    });
  };

  const handleSendApi = async () => {
    setLoading(true);
    setApiResponse({ status: 'idle', message: 'Connecting to API...' });

    try {
      const response = await fetch(config.endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      if (response.ok) {
        setApiResponse({
          status: 'success',
          message: `HTTP ${response.status} OK`,
          details: text || 'Inbound File Process initiated successfully'
        });
      } else {
        setApiResponse({
          status: 'error',
          message: `HTTP ${response.status} Error`,
          details: text
        });
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setApiResponse({
        status: 'network',
        message: `Network / CORS Notice: ${errMsg}`,
        details: `Could not connect directly from browser. You can run the cURL command directly in your terminal or Postman.`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5">
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-bold border border-purple-500/30">
            4
          </span>
          Automate API Call (Trigger Inbound File Process)
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Once the file is placed in WinSCP{' '}
          <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded font-mono">/MATRIX/inbound/</code>, invoke the
          backend controller to poll and process the settlement file.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
        <div>
          <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
            API Endpoint URL
          </label>
          <input
            type="text"
            value={config.endpointUrl}
            onChange={(e) => onUpdateConfig({ endpointUrl: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono-code focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
            Tenant Identifier
          </label>
          <input
            type="text"
            value={config.tenantIdentifier}
            onChange={(e) => onUpdateConfig({ tenantIdentifier: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono-code focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
            Custodian Identifier
          </label>
          <input
            type="text"
            value={config.custodianIdentifier}
            onChange={(e) => onUpdateConfig({ custodianIdentifier: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono-code focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
            Transmission Mode / Type
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={config.transmissionMode}
              onChange={(e) => onUpdateConfig({ transmissionMode: parseInt(e.target.value, 10) || 1 })}
              title="TransmissionMode"
              className="w-1/2 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white font-mono-code focus:border-cyan-500 focus:outline-none text-center"
            />
            <input
              type="number"
              value={config.transmissionType}
              onChange={(e) => onUpdateConfig({ transmissionType: parseInt(e.target.value, 10) || 1 })}
              title="TransmissionType"
              className="w-1/2 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white font-mono-code focus:border-cyan-500 focus:outline-none text-center"
            />
          </div>
        </div>
      </div>

      {/* Action & cURL Preview */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
        <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
          <span>Payload preview:</span>
          <code className="text-cyan-300 font-mono-code bg-slate-950 px-2 py-1 rounded border border-slate-800 text-[11px]">
            {JSON.stringify(payload)}
          </code>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCurl}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedCurl ? 'cURL Copied!' : 'Copy cURL Command'}</span>
          </button>
          <button
            onClick={handleSendApi}
            disabled={loading}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/20 transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{loading ? 'Sending Request...' : 'Send API Request'}</span>
          </button>
        </div>
      </div>

      {/* Response Box */}
      {apiResponse.status !== 'idle' && (
        <div
          className={`p-4 rounded-xl border text-xs font-mono-code ${
            apiResponse.status === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : apiResponse.status === 'error'
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
          }`}
        >
          <div className="font-bold mb-1">{apiResponse.message}</div>
          {apiResponse.details && <div>{apiResponse.details}</div>}
          {apiResponse.status === 'network' && (
            <div className="mt-2 text-slate-300 bg-slate-950/80 p-2 rounded border border-slate-800 select-all">
              {curlCommand}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
