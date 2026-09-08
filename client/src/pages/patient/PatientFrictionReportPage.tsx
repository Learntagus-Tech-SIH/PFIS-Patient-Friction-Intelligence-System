import React, { useState, useEffect } from 'react';
import { frictionReportService, FrictionReportItem } from '../../services/frictionReportService';
import { useToast } from '../../context/ToastContext';
import {
  AlertTriangle,
  Send,
  RefreshCw,
  Clock,
  CheckCircle2,
  Building2,
  HelpCircle,
  ShieldAlert,
  MessageSquare,
} from 'lucide-react';

const CATEGORIES = [
  { key: 'WAITING_TIME', label: 'Excessive OPD Waiting Time (> 90 mins)' },
  { key: 'DOCTOR_UNAVAILABLE', label: 'Doctor / Specialist Unavailable' },
  { key: 'MEDICINE_STOCKOUT', label: 'Pharmacy Medicine Stockout (e-Aushadhi)' },
  { key: 'STAFF_BEHAVIOR', label: 'Staff Conduct & Grievance' },
  { key: 'REGISTRATION_ISSUE', label: 'Queue / Registration Bottleneck' },
  { key: 'FACILITY_ACCESSIBILITY', label: 'Wheelchair / Ramp / Accessibility Barrier' },
  { key: 'UNEXPECTED_COST', label: 'Diagnostic or Unexpected Out-of-Pocket Cost' },
  { key: 'NAVIGATION_ISSUE', label: 'Wayfinding / Signage Confusion in Facility' },
];

export const PatientFrictionReportPage: React.FC = () => {
  const { showToast } = useToast();
  const [reports, setReports] = useState<FrictionReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [hospitalName, setHospitalName] = useState('District Civil Hospital, Jalandhar');
  const [category, setCategory] = useState('WAITING_TIME');
  const [severity, setSeverity] = useState('MEDIUM');
  const [description, setDescription] = useState('');

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await frictionReportService.getReports();
      if (res.success && res.reports) {
        setReports(res.reports);
      }
    } catch {
      showToast('Could not load past reports.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please describe the friction experience.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await frictionReportService.createReport({
        hospitalName,
        category,
        severity,
        description,
      });
      if (res.success) {
        showToast('Friction incident logged. Grievance cell notified.', 'success');
        setDescription('');
        fetchReports();
      }
    } catch {
      showToast('Failed to submit report. Please retry.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          Patient Healthcare Friction & Grievance Reporting
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Report non-clinical barriers, delay bottlenecks, or facility hardships. Your reports directly adjust hospital friction scores and alert district health officers.
        </p>
      </div>

      {/* Incident Filing Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-600" />
          Log a Friction Incident
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Healthcare Facility
            </label>
            <input
              type="text"
              required
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Severity Level
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
            >
              <option value="LOW">Low (Minor inconvenience)</option>
              <option value="MEDIUM">Medium (Significant delay)</option>
              <option value="HIGH">High (Care disruption / Missed token)</option>
              <option value="CRITICAL">Critical (Immediate medical risk)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Friction Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <label
                key={cat.key}
                className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center gap-2.5 ${
                  category === cat.key
                    ? 'bg-brand-50 text-brand-900 border-brand-500 shadow-xs dark:bg-brand-950/40 dark:text-brand-200'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.key}
                  checked={category === cat.key}
                  onChange={(e) => setCategory(e.target.value)}
                  className="text-brand-600"
                />
                <span>{cat.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Incident Description & Context
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe what occurred, time of event, counter number, and how your care was affected..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            Submit Friction Incident
          </button>
        </div>
      </form>

      {/* Reported Incidents History */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-sm text-slate-900 dark:text-white">Your Incident History & Resolution Status</h2>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-500" />
            Loading reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No friction incidents reported yet.
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((r, idx) => (
              <div key={r.id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 dark:text-white">{r.hospitalName}</strong>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      {r.category}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      r.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{r.description}</p>
                {r.resolutionNotes && (
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-[11px] text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                    <strong>Resolution Note:</strong> {r.resolutionNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
