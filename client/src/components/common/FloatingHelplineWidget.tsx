import React, { useState } from 'react';
import { PhoneCall, Sparkles, Volume2, X } from 'lucide-react';
import { VoiceSimulatorModal } from '../voice/VoiceSimulatorModal';

export const FloatingHelplineWidget: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 group animate-fade-in">
        <div className="bg-slate-900/95 dark:bg-slate-950/95 text-white p-3.5 sm:p-4 rounded-2xl border border-emerald-500/40 shadow-2xl backdrop-blur-md flex items-center gap-3 transition-all transform group-hover:-translate-y-0.5 max-w-[340px] sm:max-w-[380px]">
          {/* Phone Icon Pulse Badge */}
          <a
            href="tel:+917256052183"
            className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 hover:bg-emerald-500/30 transition-all cursor-pointer relative"
            title="Call +91 7256052183"
          >
            <PhoneCall className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900" />
          </a>

          {/* Details & Action */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1">
                <span>PFIS Voice Helpline</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              </span>
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="text-slate-400 hover:text-slate-200 text-xs p-0.5 cursor-pointer"
                title="Dismiss widget"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <a
              href="tel:+917256052183"
              className="text-sm font-black text-white hover:text-emerald-300 transition-colors block tracking-tight truncate cursor-pointer"
            >
              +91 7256052183
            </a>

            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-[11px] font-bold text-teal-300 hover:text-teal-200 bg-teal-950/80 hover:bg-teal-900 px-2.5 py-1 rounded-lg border border-teal-700/80 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-teal-400" />
                <span>Test Voice AI</span>
              </button>

              <a
                href="tel:+917256052183"
                className="text-[11px] font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Call PSTN →
              </a>
            </div>
          </div>
        </div>
      </div>

      <VoiceSimulatorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
