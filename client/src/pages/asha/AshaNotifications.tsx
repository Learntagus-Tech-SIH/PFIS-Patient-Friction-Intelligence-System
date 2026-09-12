import React, { useState, useEffect } from 'react';
import { ashaService } from '../../services/ashaService';
import { useToast } from '../../context/ToastContext';
import {
  Bell,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Info,
  Calendar,
  Ticket,
  GitFork,
} from 'lucide-react';

export const AshaNotifications: React.FC = () => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await ashaService.getNotifications();
      if (res.success) {
        setNotifications(res.notifications || []);
      }
    } catch {
      showToast('Failed to load notifications.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Field Notification Stream</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            Operational Alerts & Care Updates
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Assigned visit dispatches, doctor follow-up tasks, referral transit acknowledgements, and sync alerts
          </p>
        </div>

        <button
          onClick={fetchNotifications}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-600 shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            No unread field notifications.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-2 hover:border-teal-300 transition-all flex items-start gap-4"
            >
              <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div className="space-y-1 flex-grow">
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-slate-900 dark:text-white">{n.title}</strong>
                  <span className="text-[11px] text-slate-400">
                    {new Date(n.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
