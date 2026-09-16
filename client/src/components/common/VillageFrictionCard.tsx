import React from 'react';
import { VillageData } from '../../services/villageFrictionEngine';
import { MapPin, Bus, MessageSquare, Building2, Clock, ShieldAlert, ArrowRight } from 'lucide-react';

interface VillageFrictionCardProps {
  village: VillageData;
  isSelected?: boolean;
  onSelect?: (village: VillageData) => void;
}

export const VillageFrictionCard: React.FC<VillageFrictionCardProps> = ({
  village,
  isSelected = false,
  onSelect,
}) => {
  const getBadgeStyle = (cat: string) => {
    switch (cat) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800';
      case 'HIGH':
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800';
      case 'MODERATE':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/70 dark:text-yellow-300 dark:border-yellow-800';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800';
    }
  };

  return (
    <div
      onClick={() => onSelect?.(village)}
      className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-4 select-none ${
        isSelected
          ? 'bg-slate-900 text-white border-teal-400 ring-2 ring-teal-500/30 shadow-xl scale-[1.01]'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Top Title & Category Badge */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
            {village.state} • {village.district} District ({village.block} Block)
          </span>
          <h4 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
            {village.villageName}
          </h4>
          <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
            Population: <strong>{village.totalPopulation.toLocaleString()}</strong> (BPL {village.bplPopulationPercent}%)
          </span>
        </div>

        <div className="text-right shrink-0">
          <span className={`px-2.5 py-1 rounded-xl border text-[11px] font-black uppercase ${getBadgeStyle(village.frictionCategory)}`}>
            {village.frictionCategory} (PFI {village.pfiScore})
          </span>
        </div>
      </div>

      {/* 4 Barrier Icons Bar */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
            <Bus className="w-3.5 h-3.5 text-amber-500" /> Transit:
          </span>
          <strong className="text-slate-900 dark:text-white">{village.barriers.travelKm} km</strong>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
            <MessageSquare className="w-3.5 h-3.5 text-purple-500" /> Dialect:
          </span>
          <strong className="text-slate-900 dark:text-white">{village.barriers.primaryLanguage}</strong>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
            <Building2 className="w-3.5 h-3.5 text-rose-500" /> Hospital:
          </span>
          <strong className="text-slate-900 dark:text-white">{village.barriers.bedOccupancyPercent}% Beds</strong>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-teal-500" /> OPD Queue:
          </span>
          <strong className="text-slate-900 dark:text-white">{village.barriers.avgOpdWaitTimeMins} mins</strong>
        </div>
      </div>

      {/* Dominant Barrier Summary */}
      <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
        <span className="line-clamp-1">{village.dominantBarrierSummary}</span>
      </div>
    </div>
  );
};
