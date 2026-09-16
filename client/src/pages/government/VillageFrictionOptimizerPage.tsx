import React, { useState } from 'react';
import {
  villageFrictionEngine,
  REAL_INDIAN_VILLAGES_DATABASE,
  VillageData,
  INDIA_STATES,
  getDistrictsByState,
  getVillagesByDistrict,
} from '../../services/villageFrictionEngine';
import { VillageFrictionCard } from '../../components/common/VillageFrictionCard';
import {
  MapPin,
  Search,
  Sliders,
  Sparkles,
  Building2,
  Bus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Award,
  Globe,
  ChevronDown,
} from 'lucide-react';

export const VillageFrictionOptimizerPage: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('Bihar');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Patna');
  const [selectedVillageId, setSelectedVillageId] = useState<string>('v-diara-br');
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetINR, setBudgetINR] = useState<number>(500000); // Default ₹5 Lakhs

  // Cascading options
  const availableDistricts = getDistrictsByState(selectedState);
  const availableVillages = getVillagesByDistrict(
    selectedDistrict,
    selectedState
  );

  const selectedVillage =
    REAL_INDIAN_VILLAGES_DATABASE.find((v) => v.id === selectedVillageId) ||
    availableVillages[0] ||
    REAL_INDIAN_VILLAGES_DATABASE[0];

  const optimization = villageFrictionEngine.optimizeGovernmentBudgetForVillage(
    selectedVillage.id,
    budgetINR
  );

  const handleStateChange = (st: string) => {
    setSelectedState(st);
    const dists = getDistrictsByState(st);
    const newDist = dists[0] || '';
    setSelectedDistrict(newDist);
    const vlgs = getVillagesByDistrict(newDist, st);
    if (vlgs.length > 0) {
      setSelectedVillageId(vlgs[0].id);
    }
  };

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    const vlgs = getVillagesByDistrict(dist, selectedState);
    if (vlgs.length > 0) {
      setSelectedVillageId(vlgs[0].id);
    }
  };

  const BUDGET_PRESETS = [
    { label: '₹1 Lakh (Health Camp)', val: 100000 },
    { label: '₹5 Lakhs (Shuttle/Van)', val: 500000 },
    { label: '₹15 Lakhs (Wellness Center)', val: 1500000 },
    { label: '₹50 Lakhs (Construct Hospital)', val: 5000000 },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Top Banner (Light Theme Design) */}
      <div className="bg-gradient-to-r from-teal-800 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-teal-500/30">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span>All-India Village Population Health Friction Command</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Village Friction & Government Budget Action Suite
            </h1>
            <p className="text-sm text-indigo-100 max-w-3xl">
              Inspect real PFI Friction Scores across Indian villages (Patna, Gaya, Muzaffarpur, Bhagalpur, Kapurthala, Ranchi, Jawhar, etc.). Simulate government fund allocation to suggest real-based action plans (Health Camps vs Hospital Construction).
            </p>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center shrink-0">
            <span className="text-[11px] uppercase tracking-wider text-teal-200 font-bold block">
              Tracked Villages
            </span>
            <p className="text-3xl font-black text-teal-300 mt-0.5">{REAL_INDIAN_VILLAGES_DATABASE.length} Clusters</p>
            <span className="text-[10px] text-indigo-200 block mt-0.5">Coverage: All Indian States</span>
          </div>
        </div>
      </div>

      {/* Cascading State -> District -> Village Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Step 1: Select State */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block uppercase tracking-wider">
            1. Select State:
          </label>
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer appearance-none"
            >
              {INDIA_STATES.map((st: string) => (
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
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer appearance-none"
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
              value={selectedVillageId}
              onChange={(e) => setSelectedVillageId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer appearance-none"
            >
              {availableVillages.map((vlg) => (
                <option key={vlg.id} value={vlg.id}>
                  {vlg.villageName} (PFI {vlg.pfiScore})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main 2-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Village Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-600" />
                Villages in {selectedDistrict}, {selectedState}
              </h3>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {availableVillages.map((v) => (
                <VillageFrictionCard
                  key={v.id}
                  village={v}
                  isSelected={selectedVillage.id === v.id}
                  onSelect={(vg) => setSelectedVillageId(vg.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Government Budget Optimizer */}
        <div className="lg:col-span-7 space-y-6">
          {/* Selected Village Real Telemetry Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                  {selectedVillage.state} State • {selectedVillage.district} District ({selectedVillage.block} Block)
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {selectedVillage.villageName}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Nearest Hospital: <strong>{selectedVillage.barriers.nearestHospital}</strong>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Baseline Village PFI</span>
                <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
                  {selectedVillage.pfiScore} <span className="text-xs text-slate-400">/ 100</span>
                </span>
              </div>
            </div>

            {/* 4 Dimension Friction Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Travel Distance</span>
                <span className="text-base font-black text-slate-900 dark:text-white">
                  {selectedVillage.barriers.travelKm} km ({selectedVillage.barriers.travelTimeMins}m)
                </span>
                <span className="text-[10px] text-amber-600 font-semibold block">{selectedVillage.barriers.transitAvailability}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Primary Dialect</span>
                <span className="text-base font-black text-slate-900 dark:text-white">
                  {selectedVillage.barriers.primaryLanguage}
                </span>
                <span className="text-[10px] text-purple-600 font-semibold block">{selectedVillage.barriers.dialectMatchPercent}% Staff Match</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Hospital Beds</span>
                <span className="text-base font-black text-slate-900 dark:text-white">
                  {selectedVillage.barriers.bedOccupancyPercent}% Occupancy
                </span>
                <span className="text-[10px] text-rose-600 font-semibold block">{selectedVillage.barriers.specialistAvailability} Specialists</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">OPD Wait Time</span>
                <span className="text-base font-black text-slate-900 dark:text-white">
                  {selectedVillage.barriers.avgOpdWaitTimeMins} mins
                </span>
                <span className="text-[10px] text-teal-600 font-semibold block">ABHA {selectedVillage.barriers.abhaLinkagePercent}% Linked</span>
              </div>
            </div>
          </div>

          {/* Interactive Government Budget Optimizer Suite */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-teal-600" />
                  Government Budget Action Plan Simulator for {selectedVillage.villageName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Set available government funds for <strong>{selectedVillage.villageName}</strong> to calculate optimal action plan.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Allocated Fund</span>
                <span className="text-2xl font-black text-teal-600 dark:text-teal-400">
                  ₹{(budgetINR / 100000).toFixed(1)} Lakhs
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
                value={budgetINR}
                onChange={(e) => setBudgetINR(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg accent-teal-600 cursor-pointer"
              />

              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-400 self-center mr-1">Quick Presets:</span>
                {BUDGET_PRESETS.map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => setBudgetINR(p.val)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      budgetINR === p.val
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Optimization Outcome Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-1">
                <span className="text-[10px] text-teal-800 dark:text-teal-300 font-bold uppercase block">
                  Projected Village PFI
                </span>
                <span className="text-2xl font-black text-teal-950 dark:text-teal-100">
                  {optimization.projectedPfiScore} <span className="text-xs text-teal-700 font-bold">(-{optimization.frictionReductionPercent}%)</span>
                </span>
                <span className="text-[10px] text-teal-700 dark:text-teal-300 block">
                  Reduced from {optimization.baselinePfiScore} baseline
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Villagers Benefited</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  ~{optimization.estimatedVillagersHelped.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block">across village cohort</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Cost / Villager</span>
                <span className="text-2xl font-black text-teal-700 dark:text-teal-300">
                  ₹{optimization.costPerVillagerHelpedINR.toLocaleString()}
                </span>
                <span className="text-[10px] text-teal-600 block font-semibold">High Public Efficiency</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Action Scale</span>
                <span className="text-xs font-black text-slate-900 dark:text-white block mt-1">
                  {optimization.budgetTierLabel}
                </span>
              </div>
            </div>

            {/* Official AI Policy Rationale */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                Government AI Policy Rationale for {selectedVillage.villageName}
              </span>
              <p className="text-slate-200 leading-relaxed">{optimization.governmentRationale}</p>
            </div>

            {/* Selected Intervention Portfolio Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Recommended Action Plan Deployment for {selectedVillage.villageName}:
              </h4>

              {optimization.selectedInterventions.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.quantity}x {item.intervention.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200">
                        -{item.totalReductionPoints} PFI Points
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.intervention.description}</p>
                    <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold block">
                      Suited for: {item.intervention.bestSuitedFor}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      ₹{item.totalCostINR.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      (~{item.quantity * item.intervention.reachVillagersPerUnit} villagers reached)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
