import { useState } from 'react';
import { Tag, Plus } from 'lucide-react';
import type { EstimateLineItem } from '../types/hvac';

interface CustomItemBuilderProps {
  onAddCustom: (item: EstimateLineItem) => void;
}

export function CustomItemBuilder({ onAddCustom }: CustomItemBuilderProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    const parsedAmount = parseFloat(amount) || 0;
    
    onAddCustom({
      id: crypto.randomUUID(),
      type: 'custom',
      name: name.trim(),
      quantity: 1,
      unitCost: parsedAmount,
      isCustom: true
    });
    
    setName('');
    setAmount('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden no-print">
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Custom Item / Discount</h2>
            <p className="text-sm text-slate-500">Add a custom charge or negative amount</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleAdd} className="p-5 flex flex-col sm:flex-row items-end gap-4">
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
          <input 
            type="text" 
            placeholder="e.g. First-Time Customer Discount" 
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="w-full sm:w-40">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Amount ($)</label>
          <input 
            type="number" 
            step="0.01"
            placeholder="0.00" 
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 font-mono"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button 
          type="submit"
          disabled={!name.trim() || amount === ''}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-800 text-white hover:bg-slate-900 disabled:bg-slate-300 rounded-xl font-semibold transition-colors whitespace-nowrap h-[46px]"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </form>
    </div>
  );
}
