import { Trash2 } from 'lucide-react';
import type { EstimateData } from '../types/hvac';
import { formatCurrency, getPhone, getPropertyType, getSquareFootage } from '../utils/normalize';

interface PrintableEstimateProps {
  estimate: EstimateData;
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
}

export function PrintableEstimate({ estimate, onRemoveItem, onUpdateQuantity }: PrintableEstimateProps) {
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
  const c = estimate.customer;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header - Print Friendly */}
      <div className="p-8 border-b border-slate-200 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">HVAC Pro Field Services</h1>
          <p className="text-slate-500 mt-1">Professional Estimates & Repairs</p>
          <div className="mt-4 text-sm text-slate-600 space-y-1 print-only">
            <p>123 Service Road, Tech City, ST 12345</p>
            <p>(555) 123-4567 | support@hvacpro.com</p>
          </div>
        </div>
        <div className="text-right">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 font-bold tracking-wider rounded-lg uppercase text-sm mb-3">
            Estimate
          </div>
          <p className="text-slate-600 font-medium">Date: <span className="text-slate-800">{estimate.date}</span></p>
          <p className="text-slate-600 font-medium mt-1">Estimate #: <span className="text-slate-800 uppercase">{estimate.id.split('-')[0]}</span></p>
        </div>
      </div>

      {/* Customer Info */}
      {c && (
        <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Prepared For</h3>
            <p className="font-bold text-slate-800 text-lg">{c.name}</p>
            <p className="text-slate-600 mt-1">{c.address}</p>
            <p className="text-slate-600 mt-1">{getPhone(c)}</p>
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Property Details</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-slate-500">Type:</span>
              <span className="font-medium text-slate-800">{getPropertyType(c)}</span>
              <span className="text-slate-500">Size:</span>
              <span className="font-medium text-slate-800">{getSquareFootage(c).toLocaleString()} sq ft</span>
              <span className="text-slate-500">System:</span>
              <span className="font-medium text-slate-800">{c.systemType || 'Unknown'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Line Items */}
      <div className="p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-100">Itemized Breakdown</h3>
        
        {estimate.lineItems.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium no-print">
            No items added to the estimate yet.
          </div>
        ) : (
          <div className="space-y-4">
            {estimate.lineItems.map((item, index) => (
              <div key={item.id} className="flex gap-4 items-start py-3 border-b border-slate-100 last:border-0 group">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800">{item.name}</h4>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {item.type === 'equipment' ? (
                          <>Unit Cost: {formatCurrency(item.unitCost || 0)}</>
                        ) : item.type === 'custom' ? (
                          <>{item.unitCost && item.unitCost < 0 ? 'Discount Amount: ' : 'Flat Amount: '} {formatCurrency(item.unitCost || 0)}</>
                        ) : (
                          <>Rate: {formatCurrency(item.hourlyRate || 0)}/hr • Est. {item.estimatedMinHours} - {item.estimatedMaxHours} hrs</>
                        )}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div className="font-semibold text-slate-800">
                        {item.type === 'equipment' || item.type === 'custom' ? (
                          <span className={item.unitCost && item.unitCost < 0 ? "text-green-600" : ""}>
                            {formatCurrency((item.unitCost || 0) * item.quantity)}
                          </span>
                        ) : (
                          <div className="flex flex-col items-end">
                            <span>{formatCurrency((item.hourlyRate || 0) * (item.estimatedMinHours || 0) * item.quantity)}</span>
                            <span className="text-xs text-slate-400 font-normal">to {formatCurrency((item.hourlyRate || 0) * (item.estimatedMaxHours || 0) * item.quantity)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200 no-print ml-4">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-slate-700">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded"
                        >
                          +
                        </button>
                      </div>
                      
                      <span className="print-only text-slate-500 text-sm ml-4 font-medium hidden">
                        Qty: {item.quantity}
                      </span>

                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="ml-2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors no-print opacity-0 group-hover:opacity-100"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="text-sm text-slate-500 max-w-md print-only">
          <p className="font-bold text-slate-700 mb-1">Terms & Conditions</p>
          <p>Estimate valid for 30 days from date of issue. Price ranges are estimated based on typical installation/repair times and may vary if unforeseen structural issues are discovered during the job.</p>
        </div>
        
        <div className="w-full md:w-auto">
          <div className="flex justify-between items-center gap-8 mb-2 text-slate-600">
            <span>Subtotal (Low)</span>
            <span className="font-medium">{formatCurrency(low)}</span>
          </div>
          <div className="flex justify-between items-center gap-8 mb-4 text-slate-600 pb-4 border-b border-slate-200">
            <span>Subtotal (High)</span>
            <span className="font-medium">{formatCurrency(high)}</span>
          </div>
          <div className="flex justify-between items-center gap-8 text-xl">
            <span className="font-bold text-slate-800">Total Estimated Range</span>
            <div className="text-right font-black text-blue-600">
              {formatCurrency(low)} - {formatCurrency(high)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Signature Print Line */}
      <div className="px-8 py-12 hidden print-only mt-12 border-t-2 border-slate-100">
        <div className="flex justify-between gap-12">
          <div className="flex-1">
            <div className="border-b border-slate-300 h-8"></div>
            <p className="text-xs text-slate-500 mt-2 text-center uppercase tracking-wider font-semibold">Customer Approval Signature</p>
          </div>
          <div className="w-48">
            <div className="border-b border-slate-300 h-8"></div>
            <p className="text-xs text-slate-500 mt-2 text-center uppercase tracking-wider font-semibold">Date</p>
          </div>
        </div>
      </div>
    </div>
  );
}
