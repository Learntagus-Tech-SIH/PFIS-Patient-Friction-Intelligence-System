import React, { useState } from 'react';
import {
  indiaFrictionService,
  INDIA_STATES,
  INDIA_LOCATIONS_DATABASE,
  LocationFrictionData,
} from '../../services/indiaFrictionService';
import {
  Search,
  MapPin,
  Bus,
  MessageSquare,
  Building2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Sparkles,
  ChevronDown,
  Globe,
  TrendingUp,
} from 'lucide-react';

interface IndiaFrictionExplorerWidgetProps {
  portalRole?: 'admin' | 'government' | 'asha_worker';
  compact?: boolean;
}

export const IndiaFrictionExplorerWidget: React.FC<IndiaFrictionExplorerWidgetProps> = ({
  portalRole = 'admin',
  compact = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<LocationFrictionData>(
    INDIA_LOCATIONS_DATABASE[0]
  );
  const [showCalculator, setShowCalculator] = useState(false);

  // Custom Calculator Local State
  const [calcKm, setCalcKm] = useState<number>(18);
  const [calcPublicTransit, setCalcPublicTransit] = useState<boolean>(false);
  const [calcLangMatch, setCalcLangMatch] = useState<boolean>(false);
  const [calcLitLevel, setCalcLitLevel] = useState<'Low' | 'Basic' | 'Moderate' | 'High'>('Low');
  const [calcBpl, setCalcBpl] = useState<boolean>(true);
  const [calcBedOccupancy, setCalcBedOccupancy] = useState<number>(110);
  const [calcWaitMins, setCalcWaitMins] = useState<number>(90);

  const filteredLocations = indiaFrictionService.searchLocations(searchQuery, selectedState);

  const customCalcResult = indiaFrictionService.computeCustomFrictionScore({
    travelKm: calcKm,
    hasPublicTransit: calcPublicTransit,
    languageMatched: calcLangMatch,
    digitalLiteracy: calcLitLevel,
    hasBplCard: calcBpl,
    hospitalBedOccupancyPct: calcBedOccupancy,
    opdWaitMins: calcWaitMins,
  });

  const getPfiBadgeColor = (category: string) => {
    switch (category) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800';
      case 'HIGH':
        return 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800';
      case 'MODERATE':
        return 'bg-yellow-50 text-yellow-800 border-yellow-300 dark:bg-yellow-950/70 dark:text-yellow-300 dark:border-yellow-800';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800';
    }
  };

  const getRoleHeaderSubtitle = () => {
    switch (portalRole) {
      case 'government':
        return 'Health Authority State & District Population Friction Command';
      case 'asha_worker':
        return 'ASHA Village Household Field Friction & Outreach Telemetry';
      case 'admin':
      default:
        return 'Health Ministry Nationwide All-India Patient Friction Index Explorer';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-2xl border border-indigo-500/30 space-y-6 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-500/20 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-[11px] font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span>{getRoleHeaderSubtitle()}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2 mt-1">
            <MapPin className="w-6 h-6 text-teal-400" />
            All-India Real-Time Friction Score Explorer
          </h2>
          <p className="text-xs text-indigo-200/90 max-w-2xl">
            Inspect real-based Friction Scores (0–100 PFI) across any Indian State, District, Block, or Village. Evaluating Travel, Language, Resource Constraints, and OPD Queue barriers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCalculator(!showCalculator)}
          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
        >
          <Sliders className="w-4 h-4 text-teal-400" />
          <span>{showCalculator ? 'Hide Custom Calculator' : 'Custom Location Calculator'}</span>
        </button>
      </div>

      {/* Interactive Search & Filter Bar */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-indigo-300 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search any Village, Block, District or Hospital across India (e.g. Phagwara, Kanke, Danapur, Jawhar)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-indigo-500/40 rounded-xl text-xs text-white placeholder-indigo-300/60 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
          />
        </div>

        <div className="relative">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-800/90 border border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-400/50 appearance-none cursor-pointer"
          >
            <option value="">All States of India</option>
            {INDIA_STATES.map((st) => (
              <option key={st} value={st} className="bg-slate-900 text-white">
                {st} State
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-indigo-300 absolute right-3.5 top-3.5 pointer-events-none" />
        </div>
      </div>

      {/* Filtered Location Quick Pills */}
      <div className="relative z-10 flex flex-wrap items-center gap-2 max-h-24 overflow-y-auto pr-1">
        <span className="text-[11px] font-bold text-indigo-300 mr-1">Locations ({filteredLocations.length}):</span>
        {filteredLocations.map((loc) => {
          const isSelected = selectedLocation.id === loc.id;
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => setSelectedLocation(loc)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-teal-500 text-slate-950 border-teal-300 shadow-md scale-105'
                  : 'bg-slate-800/80 hover:bg-slate-750 text-indigo-200 border-indigo-500/30'
              }`}
            >
              <span>{loc.villageOrLocality}</span>
              <span className="text-[10px] opacity-75">({loc.district}, {loc.state})</span>
              <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-black/30">
                PFI {loc.pfiScore}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Location Telemetry Detail */}
      <div className="relative z-10 bg-slate-800/90 rounded-2xl p-5 border border-indigo-500/30 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
              <span>{selectedLocation.state} State</span>
              <span>•</span>
              <span>{selectedLocation.district} District</span>
              <span>•</span>
              <span>{selectedLocation.block} Block</span>
            </div>
            <h3 className="text-xl font-black text-white mt-0.5">
              {selectedLocation.villageOrLocality}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Nearest Health Center: <strong>{selectedLocation.metrics.nearestHospitalType}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Friction Index</span>
              <span className="text-2xl font-black text-white">{selectedLocation.pfiScore} <span className="text-xs text-slate-400">/ 100</span></span>
            </div>

            <div
              className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold uppercase tracking-wider ${getPfiBadgeColor(
                selectedLocation.frictionCategory
              )}`}
            >
              {selectedLocation.frictionCategory} FRICTION
            </div>
          </div>
        </div>

        {/* 4 Dimension Friction Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 1. Travel & Distance Barrier */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-indigo-300">
              <span className="font-bold flex items-center gap-1.5">
                <Bus className="w-4 h-4 text-amber-400" />
                Travel & Transit Barrier
              </span>
              <span className="font-black text-amber-400">{selectedLocation.metrics.travelFrictionScore}/100</span>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-black text-white">
                {selectedLocation.metrics.travelDistanceKm} km <span className="text-xs text-slate-400">({selectedLocation.metrics.travelTimeMins} mins)</span>
              </div>
              <span className="text-[11px] text-slate-300 block">
                Public Transit: <strong className="text-white">{selectedLocation.metrics.transitAvailability}</strong>
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${selectedLocation.metrics.travelFrictionScore}%` }}
              />
            </div>
          </div>

          {/* 2. Language & Dialect Problem */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-indigo-300">
              <span className="font-bold flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                Language & Literacy
              </span>
              <span className="font-black text-purple-400">{selectedLocation.metrics.languageFrictionScore}/100</span>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-black text-white">
                {selectedLocation.metrics.languageMatchPercent}% <span className="text-xs text-slate-400">Lang Match</span>
              </div>
              <span className="text-[11px] text-slate-300 block">
                Dialect: <strong className="text-white">{selectedLocation.metrics.primaryLanguage}</strong>
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${selectedLocation.metrics.languageFrictionScore}%` }}
              />
            </div>
          </div>

          {/* 3. Limited Resource Constraints */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-indigo-300">
              <span className="font-bold flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-rose-400" />
                Resource Scarcity
              </span>
              <span className="font-black text-rose-400">{selectedLocation.metrics.resourceFrictionScore}/100</span>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-black text-white">
                {selectedLocation.metrics.bedOccupancyPercent}% <span className="text-xs text-slate-400">Bed Occupancy</span>
              </div>
              <span className="text-[11px] text-slate-300 block">
                Specialists: <strong className="text-white">{selectedLocation.metrics.specialistAvailability}</strong> (BPL {selectedLocation.metrics.bplPercentage}%)
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full"
                style={{ width: `${selectedLocation.metrics.resourceFrictionScore}%` }}
              />
            </div>
          </div>

          {/* 4. OPD Waiting & Documentation */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-indigo-300">
              <span className="font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-400" />
                Queue & Documentation
              </span>
              <span className="font-black text-teal-400">{selectedLocation.metrics.queueDocsFrictionScore}/100</span>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-black text-white">
                {selectedLocation.metrics.avgOpdWaitTimeMins} mins <span className="text-xs text-slate-400">OPD Wait</span>
              </div>
              <span className="text-[11px] text-slate-300 block">
                ABHA Linked: <strong className="text-white">{selectedLocation.metrics.abhaLinkedPercent}%</strong>
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full"
                style={{ width: `${selectedLocation.metrics.queueDocsFrictionScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Recommended Intervention Strategy */}
        <div className="p-3.5 bg-teal-950/60 border border-teal-500/30 rounded-xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-teal-200">
            <Sparkles className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <span>
              Recommended AI Strategy: <strong>{selectedLocation.recommendedIntervention}</strong>
            </span>
          </div>
          <span className="px-2.5 py-1 rounded bg-teal-500 text-slate-950 font-bold text-[10px] uppercase shrink-0">
            Action Ready
          </span>
        </div>
      </div>

      {/* Interactive Custom Location Friction Calculator (Collapsible) */}
      {showCalculator && (
        <div className="relative z-10 bg-slate-800/95 border border-teal-500/40 rounded-2xl p-5 space-y-5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-400" />
              Dynamic PFI Friction Calculator for Any Village/Cohort
            </h3>
            <span className="text-xs text-teal-300 font-bold">
              Calculated PFI: <span className="text-lg font-black text-white">{customCalcResult.pfiScore}/100</span> ({customCalcResult.category})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
            {/* Travel Distance */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Travel Distance to Hospital (km): {calcKm}km</label>
              <input
                type="range"
                min={1}
                max={60}
                value={calcKm}
                onChange={(e) => setCalcKm(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
            </div>

            {/* Public Transit Available */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Public Bus/Transit Available?</label>
              <select
                value={calcPublicTransit ? 'yes' : 'no'}
                onChange={(e) => setCalcPublicTransit(e.target.value === 'yes')}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              >
                <option value="yes">Yes (Regular Frequency)</option>
                <option value="no">No (Transit Desert / Private Shuttle)</option>
              </select>
            </div>

            {/* Language Match */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Hospital Doctors Match Dialect?</label>
              <select
                value={calcLangMatch ? 'yes' : 'no'}
                onChange={(e) => setCalcLangMatch(e.target.value === 'yes')}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              >
                <option value="yes">Yes (Direct Communication)</option>
                <option value="no">No (Dialect Mismatch / Translator Needed)</option>
              </select>
            </div>

            {/* OPD Wait Time */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">OPD Wait Time (mins): {calcWaitMins}m</label>
              <input
                type="range"
                min={10}
                max={180}
                value={calcWaitMins}
                onChange={(e) => setCalcWaitMins(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
