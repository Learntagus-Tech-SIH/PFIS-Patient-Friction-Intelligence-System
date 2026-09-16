import React, { useState } from 'react';
import {
  indiaFrictionService,
  INDIA_STATES,
  INDIA_LOCATIONS_DATABASE,
  LocationFrictionData,
} from '../../services/indiaFrictionService';
import {
  villageFrictionEngine,
  INTERVENTION_CATALOG,
} from '../../services/villageFrictionEngine';
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
  Award,
  HeartHandshake,
} from 'lucide-react';

interface IndiaFrictionExplorerWidgetProps {
  portalRole?: 'admin' | 'government' | 'asha_worker';
}

export const IndiaFrictionExplorerWidget: React.FC<IndiaFrictionExplorerWidgetProps> = ({
  portalRole = 'admin',
}) => {
  const [selectedState, setSelectedState] = useState<string>('Bihar');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Patna');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('br-patna-diara');
  const [searchQuery, setSearchQuery] = useState('');
  const [allocatedBudgetINR, setAllocatedBudgetINR] = useState<number>(500000); // Default ₹5 Lakhs

  // Cascading options
  const availableDistricts = indiaFrictionService.getDistrictsByState(selectedState);
  const availableVillages = indiaFrictionService.getVillagesByDistrict(
    selectedDistrict,
    selectedState
  );

  // Current selected location data
  const selectedLocation =
    INDIA_LOCATIONS_DATABASE.find((loc) => loc.id === selectedLocationId) ||
    availableVillages[0] ||
    INDIA_LOCATIONS_DATABASE[0];

  // Dynamic Multi-Tier Budget Optimization Calculation
  const optimization = villageFrictionEngine.optimizeGovernmentBudgetForVillage(
    selectedLocation.id,
    allocatedBudgetINR
  );

  const handleStateChange = (st: string) => {
    setSelectedState(st);
    const dists = indiaFrictionService.getDistrictsByState(st);
    const newDist = dists[0] || '';
    setSelectedDistrict(newDist);
    const vlgs = indiaFrictionService.getVillagesByDistrict(newDist, st);
    if (vlgs.length > 0) {
      setSelectedLocationId(vlgs[0].id);
    }
  };

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    const vlgs = indiaFrictionService.getVillagesByDistrict(dist, selectedState);
    if (vlgs.length > 0) {
      setSelectedLocationId(vlgs[0].id);
    }
  };

  const getPfiBadgeStyle = (category: string) => {
    switch (category) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs';
      case 'HIGH':
        return 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs';
      case 'MODERATE':
        return 'bg-yellow-50 text-yellow-800 border-yellow-300 shadow-xs';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs';
    }
  };

  const BUDGET_PRESETS = [
    { label: '₹1 Lakh (Health Camp)', val: 100000 },
    { label: '₹5 Lakhs (Shuttle/Van)', val: 500000 },
    { label: '₹15 Lakhs (Wellness Center)', val: 1500000 },
    { label: '₹50 Lakhs (Construct Hospital)', val: 5000000 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
      {/* Top Header Banner (Clean Light Aesthetics) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-[11px] font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>All-India Population Health Friction Intelligence Explorer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            Real-Time Village Friction & Government Budget Suite
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl">
            Select State, District, and Village to inspect real-based Friction Scores (Travel, Dialect, Beds, OPD Wait). Simulate Government Funds to get dynamic action plan suggestions (Health Camps vs Hospital Construction).
          </p>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Baseline Village PFI</span>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {selectedLocation.pfiScore} <span className="text-xs text-slate-400">/ 100</span>
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase block mt-0.5 border ${getPfiBadgeStyle(selectedLocation.frictionCategory)}`}>
            {selectedLocation.frictionCategory} FRICTION
          </span>
        </div>
      </div>

      {/* Cascading State -> District -> Village Dropdown Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        {/* Step 1: Select State */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block uppercase tracking-wider">
            1. Select State:
          </label>
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer appearance-none"
            >
              {INDIA_STATES.map((st) => (
                <option key={st} value={st}>
                  {st} State
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Step 2: Select District */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block uppercase tracking-wider">
            2. Select District:
          </label>
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer appearance-none"
            >
              {availableDistricts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist} District
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Step 3: Select Village */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block uppercase tracking-wider">
            3. Select Target Village:
          </label>
          <div className="relative">
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer appearance-none"
            >
              {availableVillages.map((vlg) => (
                <option key={vlg.id} value={vlg.id}>
                  {vlg.villageOrLocality} (PFI {vlg.pfiScore})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Selected Village Real Telemetry Display */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
              {selectedLocation.state} State • {selectedLocation.district} District ({selectedLocation.block} Block)
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {selectedLocation.villageOrLocality}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Nearest Healthcare Center: <strong>{selectedLocation.metrics.nearestHospitalType}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Key Barrier:</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
              {selectedLocation.keyBarriers?.[0] || 'Transit & OPD Wait'}
            </span>
          </div>
        </div>

        {/* 4 Barrier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Travel Barrier */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span className="flex items-center gap-1">
                <Bus className="w-4 h-4 text-amber-500" /> Travel Barrier
              </span>
              <span className="text-amber-600 font-black">{selectedLocation.metrics.travelFrictionScore}/100</span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {selectedLocation.metrics.travelDistanceKm} km <span className="text-xs text-slate-400">({selectedLocation.metrics.travelTimeMins} mins)</span>
            </div>
            <span className="text-[11px] text-slate-500 block">
              Transit: <strong>{selectedLocation.metrics.transitAvailability}</strong>
            </span>
          </div>

          {/* 2. Language & Dialect */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4 text-purple-500" /> Dialect Problem
              </span>
              <span className="text-purple-600 font-black">{selectedLocation.metrics.languageFrictionScore}/100</span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {selectedLocation.metrics.languageMatchPercent}% <span className="text-xs text-slate-400">Lang Match</span>
            </div>
            <span className="text-[11px] text-slate-500 block">
              Dialect: <strong>{selectedLocation.metrics.primaryLanguage}</strong>
            </span>
          </div>

          {/* 3. Resource Scarcity */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4 text-rose-500" /> Bed & Resource
              </span>
              <span className="text-rose-600 font-black">{selectedLocation.metrics.resourceFrictionScore}/100</span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {selectedLocation.metrics.bedOccupancyPercent}% <span className="text-xs text-slate-400">Occupancy</span>
            </div>
            <span className="text-[11px] text-slate-500 block">
              Specialists: <strong>{selectedLocation.metrics.specialistAvailability}</strong>
            </span>
          </div>

          {/* 4. OPD Waiting */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-teal-500" /> OPD Queue Wait
              </span>
              <span className="text-teal-600 font-black">{selectedLocation.metrics.queueDocsFrictionScore}/100</span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {selectedLocation.metrics.avgOpdWaitTimeMins} mins <span className="text-xs text-slate-400">Wait Time</span>
            </div>
            <span className="text-[11px] text-slate-500 block">
              ABHA Linked: <strong>{selectedLocation.metrics.abhaLinkedPercent}%</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Government Budget Allocation & Multi-Tier Recommendation Simulator */}
      <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-teal-600" />
              Government Budget Action Plan Simulator for {selectedLocation.villageOrLocality}
            </h4>
            <span className="text-xs text-slate-500">
              Simulate government funding to dynamically calculate action plan (Screening Camps vs PHC Hospital Construction).
            </span>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Selected Government Budget</span>
            <span className="text-2xl font-black text-teal-700 dark:text-teal-400">
              ₹{(allocatedBudgetINR / 100000).toFixed(1)} Lakhs
            </span>
          </div>
        </div>

        {/* Budget Slider & Presets */}
        <div className="space-y-3">
          <input
            type="range"
            min={50000}
            max={7500000}
            step={50000}
            value={allocatedBudgetINR}
            onChange={(e) => setAllocatedBudgetINR(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg accent-teal-600 cursor-pointer"
          />

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1">Budget Scale Presets:</span>
            {BUDGET_PRESETS.map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => setAllocatedBudgetINR(p.val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  allocatedBudgetINR === p.val
                    ? 'bg-teal-600 text-white border-teal-700 shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Multi-Tier AI Action Plan Outcome */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Action Plan Scale ({optimization.budgetTierLabel})
                </span>
                <strong className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Recommended Action Plan for {selectedLocation.villageOrLocality}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Projected PFI Score</span>
                <span className="text-xl font-black text-teal-600 dark:text-teal-400">
                  {optimization.projectedPfiScore} / 100 <span className="text-xs text-emerald-600 font-bold">(-{optimization.frictionReductionPercent}%)</span>
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {optimization.governmentRationale}
          </p>

          {/* Purchased Items List */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase text-slate-400">Deployed Health Interventions:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {optimization.selectedInterventions.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex justify-between items-center">
                  <div>
                    <strong className="text-slate-900 dark:text-white block">{item.quantity}x {item.intervention.name}</strong>
                    <span className="text-[10px] text-teal-600 font-semibold">-{item.totalReductionPoints} PFI Points</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">₹{item.totalCostINR.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
