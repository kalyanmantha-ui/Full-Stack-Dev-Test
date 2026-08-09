import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Package, Search, Plus, Filter } from 'lucide-react';
import type { EquipmentItem, EstimateLineItem } from '../types/hvac';
import { getBaseCost, formatCurrency } from '../utils/normalize';
// @ts-ignore
import rawEquipment from '../../data/equipment.json';

const equipment: EquipmentItem[] = rawEquipment as EquipmentItem[];

const CATEGORIES = Array.from(new Set(equipment.map(e => e.category))).sort();

interface EquipmentSelectorProps {
  onAddEquipment: (item: EstimateLineItem) => void;
}

export function EquipmentSelector({ onAddEquipment }: EquipmentSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fuse = useMemo(() => new Fuse(equipment, {
    keys: ['name', 'brand', 'modelNumber', 'category'],
    threshold: 0.3,
    ignoreLocation: true
  }), []);

  const filteredEquipment = useMemo(() => {
    let results = equipment;
    
    if (searchTerm.trim()) {
      results = fuse.search(searchTerm).map(result => result.item);
    }
    
    if (selectedCategory) {
      results = results.filter(item => item.category === selectedCategory);
    }
    
    return results;
  }, [searchTerm, selectedCategory, fuse]);

  const handleAdd = (item: EquipmentItem) => {
    const cost = getBaseCost(item);
    onAddEquipment({
      id: crypto.randomUUID(),
      type: 'equipment',
      itemId: item.id,
      name: `${item.brand} ${item.name} (${item.modelNumber})`,
      quantity: 1,
      unitCost: cost
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden no-print">
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Equipment</h2>
            <p className="text-sm text-slate-500">Add parts & systems to estimate</p>
          </div>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search equipment..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 bg-white text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 border-b border-slate-100 bg-slate-50 overflow-x-auto hide-scrollbar">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === null 
                ? 'bg-slate-800 text-white' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Items
          </button>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="p-2 max-h-[500px] overflow-y-auto bg-slate-50 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2">
          {filteredEquipment.map(item => {
            const cost = getBaseCost(item);
            return (
              <div 
                key={item.id} 
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-700 rounded-md">
                      {item.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                      {item.id}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 group-hover:text-slate-900 transition-colors leading-tight mb-1">
                    {item.name}
                  </h3>
                  <div className="text-sm text-slate-500 mb-3 flex items-center gap-2">
                    <span className="font-medium text-slate-600">{item.brand}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-mono text-xs">{item.modelNumber}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <span className="text-lg font-bold text-slate-800">
                    {formatCurrency(cost)}
                  </span>
                  <button 
                    onClick={() => handleAdd(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white hover:bg-slate-700 rounded-lg font-medium transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            );
          })}
          {filteredEquipment.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 flex flex-col items-center">
              <Filter className="w-8 h-8 text-slate-300 mb-3" />
              <p>No equipment matches your search or category filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
