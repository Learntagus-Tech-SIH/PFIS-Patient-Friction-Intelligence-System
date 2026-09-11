import React, { useState, useEffect } from 'react';
import { consentService, PatientConsentItem } from '../../services/consentService';
import { useToast } from '../../context/ToastContext';
import {
  ShieldCheck,
  Lock,
  Eye,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Plus,
  Calendar,
  Building2,
  Stethoscope,
  BarChart3,
  HelpCircle,
} from 'lucide-react';

export const PatientConsentCenter: React.FC = () => {
  const { showToast } = useToast();
  const [consents, setConsents] = useState<PatientConsentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGranting, setIsGranting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  // New consent form
  const [showModal, setShowModal] = useState(false);
  const [scope, setScope] = useState('DOCTOR_CONSULT');
  const [recipientName, setRecipientName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [durationMonths, setDurationMonths] = useState(12);

  const fetchConsents = async () => {
    setIsLoading(true);
    try {
      const res = await consentService.getMyConsents();
      if (res.success && res.consents) {
        setConsents(res.consents);
      }
    } catch {
      showToast('Failed to load consent records.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConsents();
  }, []);

  const handleToggleConsent = async (id: string) => {
    setActionId(id);
    try {
      const res = await consentService.revokeConsent(id);
      if (res.success) {
        showToast(res.message, 'success');
        setConsents((prev) =>
          prev.map((c) => (c.id === id || c._id === id ? { ...c, status: c.status === 'ACTIVE' ? 'REVOKED' : 'ACTIVE' } : c))
        );
      }
    } catch {
      showToast('Could not update consent status.', 'error');
    } finally {
      setActionId(null);
    }
  };

  const handleGrantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !purpose.trim()) {
      showToast('Please provide recipient name and purpose.', 'error');
      return;
    }
    setIsGranting(true);
    try {
      const res = await consentService.grantConsent({
        scope,
        recipientName,
        purpose,
        durationMonths,
      });
      if (res.success) {
        showToast('Consent granted successfully.', 'success');
        setShowModal(false);
        setRecipientName('');
        setPurpose('');
        fetchConsents();
      }
    } catch {
      showToast('Failed to grant consent.', 'error');
    } finally {
      setIsGranting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-brand-600" />
            Patient Health Data Consent & Privacy Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ABHA / ABDM Compliant Consent Manager: Control who accesses your medical records, prescriptions, and lab tests.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          Grant New Consent
        </button>
      </div>

      {/* Consent Policy Banner */}
      <div className="p-4 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 rounded-2xl flex items-center gap-3.5 text-xs text-teal-900 dark:text-teal-200">
        <Lock className="w-5 h-5 text-teal-600 shrink-0" />
        <div className="flex-1">
          <strong className="block font-bold">Patient Data Ownership & Consent-Gated Access</strong>
          <span className="text-teal-800 dark:text-teal-300">
            Healthcare providers, doctors, and diagnostic labs can only view documents when an active consent token is verified.
          </span>
        </div>
      </div>

      {/* Consents List */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">Active & Historical Consents</h2>
          <span className="text-xs text-slate-500">{consents.length} Policies Registered</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-500" />
            Loading privacy records...
          </div>
        ) : consents.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No consent tokens found. Use "Grant New Consent" to authorize clinical access.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {consents.map((item) => {
              const id = item.id || item._id || '';
              const isActive = item.status === 'ACTIVE';

              return (
                <div key={id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-750 transition-colors">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-bold text-slate-900 dark:text-white">{item.recipientName}</strong>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300'
                        }`}
                      >
                        {isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {item.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {item.scope}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      <strong>Purpose:</strong> {item.purpose}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Valid until: {new Date(item.validUntil).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => handleToggleConsent(id)}
                      disabled={actionId === id}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                        isActive
                          ? 'text-rose-600 border-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:border-rose-900'
                          : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-900'
                      }`}
                    >
                      {actionId === id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : isActive ? (
                        <>Revoke Access</>
                      ) : (
                        <>Re-authorize</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grant Consent Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-in">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-600" />
              Authorize Healthcare Entity Access
            </h3>

            <form onSubmit={handleGrantSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Recipient Name / Clinical Institution
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apollo Hospital Cardiology Team"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Consent Data Scope
                </label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="DOCTOR_CONSULT">Doctor Consult (Prescriptions & Notes)</option>
                  <option value="HOSPITAL_TRIAGE">Hospital Triage (Vitals & Emergency Intake)</option>
                  <option value="EHR_FULL">Full EHR & ABHA Records</option>
                  <option value="RESEARCH_ANALYTICS">Anonymized Public Health Research</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Authorized Purpose
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardiac consultation and diagnostic evaluation"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Validity Duration
                </label>
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value={1}>1 Month (Single Episode of Care)</option>
                  <option value={6}>6 Months (Treatment Course)</option>
                  <option value={12}>12 Months (Annual Care Continuity)</option>
                  <option value={24}>24 Months</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGranting}
                  className="px-5 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-sm disabled:opacity-50"
                >
                  Authorize Grant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
