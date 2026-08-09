import { useState, useEffect } from 'react';
import { CustomerSelector } from './components/CustomerSelector';
import { EquipmentSelector } from './components/EquipmentSelector';
import { LaborSelector } from './components/LaborSelector';
import { CustomItemBuilder } from './components/CustomItemBuilder';
import { LiveTotalBanner } from './components/LiveTotalBanner';
import { PrintableEstimate } from './components/PrintableEstimate';
import type { Customer, EstimateData, EstimateLineItem } from './types/hvac';
import { Settings, Zap, ListPlus, Flame } from 'lucide-react';

function App() {
  const [mode, setMode] = useState<'quick' | 'detailed'>('detailed');
  
  const [estimate, setEstimate] = useState<EstimateData>(() => {
    const saved = localStorage.getItem('hvac_estimate_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved estimate', e);
      }
    }
    return {
      id: `EST-${Math.floor(Math.random() * 100000)}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      customer: undefined,
      lineItems: [],
      notes: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('hvac_estimate_draft', JSON.stringify(estimate));
  }, [estimate]);

  const handleSelectCustomer = (customer: Customer | undefined) => {
    setEstimate(prev => ({ ...prev, customer }));
  };

  const handleAddItem = (item: EstimateLineItem) => {
    setEstimate(prev => {
      // In quick mode, we only allow 1 equipment and 1 labor. We replace if it exists.
      if (mode === 'quick') {
        const filtered = prev.lineItems.filter(i => i.type !== item.type);
        return { ...prev, lineItems: [...filtered, item] };
      }
      return { ...prev, lineItems: [...prev.lineItems, item] };
    });
  };

  const handleRemoveItem = (id: string) => {
    setEstimate(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setEstimate(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
    }));
  };

  const clearEstimate = () => {
    if (confirm('Are you sure you want to clear the entire estimate?')) {
      setEstimate(prev => ({
        ...prev,
        lineItems: [],
        notes: ''
      }));
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Top Header - No Print */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print shadow-sm glass-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800">
            <Flame className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tight text-slate-900">HVAC Pro<span className="text-slate-500">.</span></span>
          </div>
          
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setMode('quick')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'quick' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Mode</span>
            </button>
            <button
              onClick={() => setMode('detailed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'detailed' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ListPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Detailed Mode</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none">
        {mode === 'quick' && (
          <div className="mb-6 bg-slate-100 border border-slate-200 text-slate-800 px-5 py-4 rounded-xl flex items-start gap-3 no-print">
            <Zap className="w-5 h-5 mt-0.5 shrink-0 text-slate-600" />
            <div>
              <p className="font-bold">Quick Estimate Mode Active</p>
              <p className="text-sm mt-1 text-slate-600">Perfect for fast on-site repairs. Adding equipment or labor will replace the existing line item of that type, allowing for an instant 10-15 min quote.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
          
          {/* Left Column - Builders (No Print) */}
          <div className="lg:col-span-7 space-y-6 no-print">
            <CustomerSelector 
              selectedCustomer={estimate.customer} 
              onSelectCustomer={handleSelectCustomer} 
            />
            
            <EquipmentSelector onAddEquipment={handleAddItem} />
            
            <LaborSelector onAddLabor={handleAddItem} />
            
            <CustomItemBuilder onAddCustom={handleAddItem} />
          </div>

          {/* Right Column - Summary & PDF Preview */}
          <div className="lg:col-span-5 space-y-6 print:block">
            <div className="sticky top-24 space-y-6 print:static">
              
              <LiveTotalBanner estimate={estimate} />

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden no-print">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-slate-400" />
                    Estimate Settings
                  </h3>
                  {estimate.lineItems.length > 0 && (
                    <button 
                      onClick={clearEstimate}
                      className="text-sm text-red-500 hover:text-red-700 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="p-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Technician Notes (Internal / Scope)</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 bg-slate-50 min-h-[100px] resize-y text-sm"
                    placeholder="E.g. Condenser coil needs custom fitting..."
                    value={estimate.notes}
                    onChange={(e) => setEstimate({ ...estimate, notes: e.target.value })}
                  />
                </div>
              </div>

              {/* The printable document itself */}
              <div className="print-area">
                <PrintableEstimate 
                  estimate={estimate} 
                  onRemoveItem={handleRemoveItem}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
