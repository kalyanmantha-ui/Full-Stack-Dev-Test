import { Calculator } from 'lucide-react';
import type { EstimateData } from '../types/hvac';
import { formatCurrency } from '../utils/normalize';

interface LiveTotalBannerProps {
  estimate: EstimateData;
}

export function LiveTotalBanner({ estimate }: LiveTotalBannerProps) {
  const calculateTotal = () => {
    let low = 0;
    let high = 0;

    estimate.lineItems.forEach(item => {
      if (item.type === 'equipment' && item.unitCost !== undefined) {
        const cost = item.unitCost * item.quantity;
        low += cost;
        high += cost;
      } else if (item.type === 'labor' && item.hourlyRate !== undefined) {
        low += item.hourlyRate * (item.estimatedMinHours || 0) * item.quantity;
        high += item.hourlyRate * (item.estimatedMaxHours || 0) * item.quantity;
      } else if (item.type === 'custom' && item.unitCost !== undefined) {
        const cost = item.unitCost * item.quantity;
        low += cost;
        high += cost;
      }
    });

    return { low, high };
  };

  const { low, high } = calculateTotal();

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 lg:p-6 shadow-xl relative overflow-visible no-print">
      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 shrink-0 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 hidden sm:flex">
            <Calculator className="w-6 h-6 text-slate-300" />
          </div>
          <div>
            <h2 className="text-slate-400 font-medium text-sm uppercase tracking-wider mb-1">Estimated Total Range</h2>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-3xl font-bold tracking-tight text-white">{formatCurrency(low)}</span>
              <span className="text-lg text-slate-500 font-medium">to</span>
              <span className="text-3xl font-bold tracking-tight text-white">{formatCurrency(high)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row xl:flex-col items-center sm:justify-between xl:items-end gap-3 shrink-0">
          <div className="text-sm text-slate-400">
            <span className="text-white font-medium">{estimate.lineItems.length}</span> items in estimate
          </div>
          <button 
            onClick={() => window.print()}
            disabled={estimate.lineItems.length === 0}
            className="w-full sm:w-auto px-6 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200"
          >
            Export to PDF
          </button>
        </div>
      </div>
    </div>
  );
}
