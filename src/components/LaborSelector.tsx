import { useState, useMemo } from 'react';
import { Wrench, Clock, DollarSign, Plus } from 'lucide-react';
import type { LaborRate, EstimateLineItem } from '../types/hvac';
import { formatCurrency } from '../utils/normalize';
// @ts-ignore
import rawLaborRates from '../../data/labor_rates.json';

const laborRates: LaborRate[] = rawLaborRates as LaborRate[];

const JOB_TYPES = Array.from(new Set(laborRates.map(r => r.jobType)));

interface LaborSelectorProps {
  onAddLabor: (item: EstimateLineItem) => void;
}

export function LaborSelector({ onAddLabor }: LaborSelectorProps) {
  const [selectedJobType, setSelectedJobType] = useState<string>(JOB_TYPES[0]);
  
  const availableLevels = useMemo(() => {
    return laborRates.filter(r => r.jobType === selectedJobType);
  }, [selectedJobType]);
  
  const [selectedLevel, setSelectedLevel] = useState<string>(availableLevels[0]?.level || '');
  
  // Update level when job type changes
  useMemo(() => {
    if (availableLevels.length > 0 && !availableLevels.find(l => l.level === selectedLevel)) {
      setSelectedLevel(availableLevels[0].level);
    }
  }, [availableLevels, selectedLevel]);

  const selectedRate = useMemo(() => {
    return availableLevels.find(l => l.level === selectedLevel);
  }, [availableLevels, selectedLevel]);

  const handleAdd = () => {
    if (!selectedRate) return;
    
    onAddLabor({
      id: crypto.randomUUID(),
      type: 'labor',
      name: `${selectedRate.jobType.charAt(0).toUpperCase() + selectedRate.jobType.slice(1)} - ${selectedRate.level.charAt(0).toUpperCase() + selectedRate.level.slice(1)} Labor`,
      quantity: 1, // Number of technicians/instances
      hourlyRate: selectedRate.hourlyRate,
      estimatedMinHours: selectedRate.estimatedHours.min,
      estimatedMaxHours: selectedRate.estimatedHours.max,
      jobType: selectedRate.jobType,
      level: selectedRate.level
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden no-print">
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Labor Options</h2>
            <p className="text-sm text-slate-500">Configure time and rates</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Job Type</label>
            <div className="relative">
              <select 
                className="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 font-medium text-slate-800 capitalize transition-shadow"
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
              >
                {JOB_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Complexity Level</label>
            <div className="relative">
              <select 
                className="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 font-medium text-slate-800 capitalize transition-shadow"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {availableLevels.map(level => (
                  <option key={level.level} value={level.level}>{level.level}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {selectedRate && (
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <DollarSign className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Rate</p>
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(selectedRate.hourlyRate)}<span className="text-sm font-medium text-slate-600">/hr</span></p>
                </div>
              </div>
              
              <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Clock className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Est. Time</p>
                  <p className="text-lg font-bold text-slate-900">
                    {selectedRate.estimatedHours.min} - {selectedRate.estimatedHours.max} <span className="text-sm font-medium text-slate-600">hrs</span>
                  </p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleAdd}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white hover:bg-slate-900 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add Labor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
