import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  X,
  Send,
  Info,
} from 'lucide-react';
import { Button } from '../common/Button';

interface VoiceSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  speaker: 'agent' | 'user';
  text: string;
  isEmergency?: boolean;
}

export const VoiceSimulatorModal: React.FC<VoiceSimulatorModalProps> = ({ isOpen, onClose }) => {
  const [callActive, setCallActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [isEmergencyAlert, setIsEmergencyAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) return null;

  const startCall = async () => {
    setCallActive(true);
    setLoading(true);
    setMessages([]);
    setIsEmergencyAlert(false);

    try {
      const res = await fetch('/api/voice/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: selectedLanguage, userInput: '' }),
      });
      const data = await res.json();
      if (data.success && data.agentResponse) {
        setMessages([{ speaker: 'agent', text: data.agentResponse.speechText }]);
      }
    } catch {
      setMessages([
        {
          speaker: 'agent',
          text: 'Namaste! PFIS AI Healthcare Toll-Free Helpline mein aapka swagat hai. Hindi ke liye 1 dabayein ya boliye: "Doctor dhoondho", "Dawai check karo", ya "Referral status".',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTurn = async (textToSend?: string) => {
    const text = textToSend || userInput;
    if (!text.trim()) return;

    const newMsgs = [...messages, { speaker: 'user' as const, text }];
    setMessages(newMsgs);
    setUserInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/voice/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: selectedLanguage, userInput: text }),
      });
      const data = await res.json();
      if (data.success && data.agentResponse) {
        setMessages((prev) => [
          ...prev,
          {
            speaker: 'agent',
            text: data.agentResponse.speechText,
            isEmergency: data.agentResponse.isEmergency,
          },
        ]);
        if (data.agentResponse.isEmergency) {
          setIsEmergencyAlert(true);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          speaker: 'agent',
          text: 'Aapke paas 2 suitable hospitals mil gaye hain: Ramgarh Sub-Divisional Hospital (PHC) aur RIMS District Hospital. Dono mein OPD aur General Doctor available hain.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const endCall = () => {
    setCallActive(false);
    setMessages([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-teal-300 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight flex items-center gap-2 flex-wrap">
                PFIS Helpline (+91 7256052183)
                <span className="px-2 py-0.5 rounded-full bg-teal-500/30 text-teal-200 text-xs font-medium border border-teal-400/30">
                  Interactive AI Voice Assistant
                </span>
              </h3>
              <p className="text-xs text-teal-100/80">Voice-first healthcare access without smartphone or internet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto" ref={scrollRef}>
          {/* Status Alert */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>Technical Transparency:</strong> Toll-free PSTN numbers require telecom provisioning. This interactive browser voice simulator demonstrates the exact AI voice conversation flow designed for rural callers.
            </span>
          </div>

          {!callActive ? (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center mx-auto text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                <Mic className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                  Simulate Rural Toll-Free Call
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Experience how a rural citizen speaks with the PFIS AI Voice Agent in vernacular Hindi to discover hospitals, check medicine stock, or track referrals.
                </p>
              </div>

              {/* Language Selector */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Preferred Language:</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                >
                  <option value="Hindi">Hindi (हिन्दी)</option>
                  <option value="English">English</option>
                  <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                  <option value="Bengali">Bengali (বাংলা)</option>
                  <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                </select>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={startCall}
                icon={<PhoneCall className="w-5 h-5 shrink-0" />}
                className="bg-emerald-600 hover:bg-emerald-700 font-bold px-8 py-3 text-base shadow-lg cursor-pointer"
              >
                Start AI Voice Call Simulation →
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Emergency Alert Banner */}
              {isEmergencyAlert && (
                <div className="p-3.5 bg-rose-600 text-white rounded-xl shadow-md flex items-center gap-3 animate-pulse">
                  <AlertTriangle className="w-6 h-6 shrink-0 text-amber-300" />
                  <div>
                    <div className="font-bold text-sm">EMERGENCY SHORT-CIRCUIT TRIGGERED</div>
                    <div className="text-xs text-rose-100">
                      AI safely routed caller to 108 Emergency Ambulance Helpline & nearest trauma facility.
                    </div>
                  </div>
                </div>
              )}

              {/* Conversation Feed */}
              <div className="space-y-3 min-h-[220px]">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-xs ${
                        m.speaker === 'user'
                          ? 'bg-teal-600 text-white rounded-br-none'
                          : m.isEmergency
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800 rounded-bl-none font-medium'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-bold opacity-75 mb-1">
                        {m.speaker === 'user' ? 'Rural Caller (Voice)' : 'PFIS AI Agent'}
                      </div>
                      {m.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl px-4 py-2.5 text-xs flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                      AI Voice Agent thinking...
                    </div>
                  </div>
                )}
              </div>

              {/* Sample Quick Prompt Chips */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Sample Rural Caller Phrases (Click to simulate speaking):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleSendTurn('Mujhe doctor se milna hai gaon ke paas')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-700 dark:hover:text-teal-300 text-xs text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    “Mujhe doctor se milna hai”
                  </button>
                  <button
                    onClick={() => handleSendTurn('Paracetamol dawai kaha milegi?')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-700 dark:hover:text-teal-300 text-xs text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    “Dawai kaha milegi?”
                  </button>
                  <button
                    onClick={() => handleSendTurn('Mera referral ka status kya hai?')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-700 dark:hover:text-teal-300 text-xs text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    “Referral status kya hai?”
                  </button>
                  <button
                    onClick={() => handleSendTurn('Chhati me severe dard hai, breathing nahi ho rahi')}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-xs text-rose-700 dark:text-rose-300 transition-colors border border-rose-200 dark:border-rose-800 cursor-pointer"
                  >
                    ⚠️ “Severe chest pain” (Emergency Test)
                  </button>
                </div>
              </div>

              {/* Input Turn Controls */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendTurn()}
                  placeholder="Type or speak caller request..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <Button
                  variant="primary"
                  onClick={() => handleSendTurn()}
                  icon={<Send className="w-4 h-4 shrink-0" />}
                  className="bg-teal-600 hover:bg-teal-700 shrink-0 cursor-pointer"
                >
                  Speak
                </Button>
                <Button
                  variant="danger"
                  onClick={endCall}
                  icon={<PhoneOff className="w-4 h-4 shrink-0" />}
                  className="bg-rose-600 hover:bg-rose-700 shrink-0 cursor-pointer"
                >
                  End Call
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
