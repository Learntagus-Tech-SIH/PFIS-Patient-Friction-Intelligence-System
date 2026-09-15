import React, { useState, useEffect } from 'react';
import { abdmService, AbdmStatusResponse, AbdmLogEntry } from '../../services/abdmService';
import { useToast } from '../../context/ToastContext';
import {
  ShieldCheck,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Activity,
  FileText,
  Building2,
  UserCheck,
  CreditCard,
  History,
  X,
  Database,
} from 'lucide-react';

export const AbdmConfigPanel: React.FC = () => {
  const { showToast } = useToast();
  const [status, setStatus] = useState<AbdmStatusResponse | null>(null);
  const [logs, setLogs] = useState<AbdmLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState<boolean>(false);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const data = await abdmService.getStatus();
      setStatus(data);
    } catch {
      showToast('Failed to fetch ABDM status from server.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const res = await abdmService.testConnection();
      if (res.success) {
        showToast(res.message || 'ABDM connection verified successfully!', 'success');
      } else {
        showToast(res.message || 'ABDM credentials not configured.', 'warning');
      }
      fetchStatus();
    } catch {
      showToast('ABDM connection test failed.', 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleViewLogs = async () => {
    try {
      const res = await abdmService.getLogs();
      if (res.success) {
        setLogs(res.logs || []);
        setIsLogsModalOpen(true);
      }
    } catch {
      showToast('Failed to load integration logs.', 'error');
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Badge */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                OFFICIAL ABDM ADAPTER
              </span>
              <span className="text-xs text-slate-400 font-medium">• Server-Side Security Protected</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Ayushman Bharat Digital Mission (ABDM) Integration Configuration
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Governance panel for national health registries (HFR, HPR), ABHA identity, and consent-based Health Information Exchange.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Activity className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testing Gateway...' : 'Test Connection'}</span>
            </button>
            <button
              onClick={fetchStatus}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleViewLogs}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>View Integration Logs</span>
            </button>
          </div>
        </div>

        {/* Status Indicator Bar */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {status?.configured ? (
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <strong className="text-sm text-slate-900 dark:text-white">
                  Current Display Label:
                </strong>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                  status?.uiLabel === 'Connected to ABDM'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : status?.uiLabel === 'Connected to ABDM Sandbox'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {status?.uiLabel || 'ABDM integration pending configuration'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {status?.statusMessage || 'Checking status...'}
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-mono sm:text-right">
            <span>Environment: <strong>{(status?.environment || 'SANDBOX').toUpperCase()}</strong></span>
            <span className="block text-[11px] text-slate-400">Gateway Timeout: {status?.timeoutMs || 15000}ms</span>
          </div>
        </div>
      </div>

      {/* Capability Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* HFR */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indigo-600" /> Health Facility Registry (HFR)
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              status?.hfrEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {status?.hfrEnabled ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Discovery of official government & registered private health facilities across states and districts.
          </p>
        </div>

        {/* HPR */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-indigo-600" /> Professionals Registry (HPR)
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              status?.hprEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {status?.hprEnabled ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Doctor NUID & State Medical Council accreditation verification layer.
          </p>
        </div>

        {/* ABHA */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-indigo-600" /> ABHA Identity Module
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              status?.abhaEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {status?.abhaEnabled ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            14-digit ABHA Number and @sbx address binding for patient identity continuity.
          </p>
        </div>

        {/* Consent */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Consent Management
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              status?.consentEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {status?.consentEnabled ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Patient-controlled granular access permissions (REQUESTED, GRANTED, REVOKED, EXPIRED).
          </p>
        </div>

        {/* Health Records (HIU) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" /> Health Records Exchange
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              status?.healthRecordsEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {status?.healthRecordsEnabled ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Consent-gated longitudinal record retrieval (prescriptions, diagnostic reports, discharge summaries).
          </p>
        </div>

        {/* Security Isolation Guarantee */}
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center gap-3">
          <Lock className="w-5 h-5 text-indigo-600 shrink-0" />
          <div className="text-xs">
            <strong className="text-indigo-900 dark:text-indigo-200 block">Strict Credential Isolation</strong>
            <span className="text-indigo-700/80 dark:text-indigo-400/80">
              `ABDM_CLIENT_SECRET` is kept exclusively on backend process environment.
            </span>
          </div>
        </div>
      </div>

      {/* Integration Logs Modal */}
      {isLogsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" />
                <span>ABDM Gateway Integration Logs ({logs.length})</span>
              </h3>
              <button
                onClick={() => setIsLogsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 text-xs">
              {logs.length === 0 ? (
                <p className="text-slate-500 py-6 text-center">No integration logs recorded yet.</p>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {log.request_id}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono text-[10px]">
                          {log.operation}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 font-mono text-[10px]">
                          {log.environment}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Timestamp: {new Date(log.timestamp).toLocaleString()} • Latency: {log.latency_ms || 0}ms
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      log.success ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      HTTP {log.http_status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
