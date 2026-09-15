import React from 'react';
import {
  X,
  FileText,
  Building2,
  Calendar,
  ShieldCheck,
  Download,
  CheckCircle2,
  UserCheck,
  Lock,
  ExternalLink,
} from 'lucide-react';

export interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    documentId: string;
    title: string;
    documentType: string;
    sourceFacility: string;
    authorDoctor?: string;
    date: string;
    status: string;
    sourceSystem: string;
    consentStatus: string;
    lastUpdated?: string;
    downloadUrl?: string;
    contentPreview?: string;
  } | null;
}

export const PfisDocumentViewerModal: React.FC<DocumentViewerProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  if (!isOpen || !document) return null;

  const isConsentGranted = document.consentStatus === 'GRANTED' || document.consentStatus === 'NOT_REQUIRED';
  const isAbdmSource = document.sourceSystem === 'ABDM';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                {document.documentType}
              </span>

              {isAbdmSource && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Source: ABDM
                </span>
              )}
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {document.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 font-semibold block">Source Facility:</span>
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              {document.sourceFacility}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold block">Document Date:</span>
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              {document.date}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold block">Attending Practitioner:</span>
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              {document.authorDoctor || 'Medical Officer'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold block">Access & Consent Status:</span>
            <span className={`inline-flex items-center gap-1 font-bold ${
              isConsentGranted ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              {isConsentGranted ? 'Consent Granted' : 'Access Denied'}
            </span>
          </div>
        </div>

        {/* Document Content Preview Box */}
        <div className="flex-1 overflow-y-auto p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-900">
            <span>Official Document Preview</span>
            <span>Ref: {document.documentId}</span>
          </div>

          {isConsentGranted ? (
            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                  PARACLINICAL FINDINGS & SUMMARY
                </div>
                <p>Patient Name: Sunita Devi | Age: 38 | Gender: Female</p>
                <p>Primary Diagnostic Impression: Normal Sinus Rhythm, No Acute Ischemic Changes</p>
                <p>Blood Pressure: 124/82 mmHg | Pulse: 74 bpm | SpO2: 98%</p>
                <p>Advice: Continue prescribed maintenance regimen. Re-evaluate in 30 days.</p>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Verified record exchange artifact logged in immutable security audit log.</span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <Lock className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Access to this health document requires active patient consent under ABDM privacy guidelines.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-400">
            Verified Source: <strong>{document.sourceSystem}</strong>
          </span>

          <div className="flex gap-2">
            {isConsentGranted && (
              <a
                href={document.downloadUrl || '#'}
                download
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
            >
              Close Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
