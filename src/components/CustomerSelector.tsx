import { useState, useMemo } from 'react';
import { User, MapPin, Phone, Calendar, Home, CheckCircle2, ChevronDown } from 'lucide-react';
import type { Customer } from '../types/hvac';
import { getPropertyType, getSquareFootage, getPhone, getLastServiceDate } from '../utils/normalize';
// @ts-ignore
import rawCustomers from '../../data/customers.json';

const customers: Customer[] = rawCustomers as Customer[];

interface CustomerSelectorProps {
  selectedCustomer: Customer | undefined;
  onSelectCustomer: (customer: Customer | undefined) => void;
}

export function CustomerSelector({ selectedCustomer, onSelectCustomer }: CustomerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    const lower = searchTerm.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(lower) || 
      c.address.toLowerCase().includes(lower) ||
      c.id.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6 no-print">
      <div 
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {selectedCustomer ? 'Customer Details' : 'Select Customer'}
            </h2>
            <p className="text-sm text-slate-500">
              {selectedCustomer ? selectedCustomer.name : 'Optional step'}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="p-5 border-t border-slate-100 bg-slate-50">
          {!selectedCustomer ? (
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Search by name, address, or ID..." 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {filteredCustomers.map(c => (
                  <div 
                    key={c.id}
                    onClick={() => { onSelectCustomer(c); setIsOpen(false); }}
                    className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer transition-all flex justify-between items-center group"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">{c.name}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5" /> {c.address}
                      </p>
                    </div>
                    <div className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
                      {c.id}
                    </div>
                  </div>
                ))}
                {filteredCustomers.length === 0 && (
                  <div className="text-center py-6 text-slate-500">
                    No customers found.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative">
              <button 
                onClick={() => onSelectCustomer(undefined)}
                className="absolute top-4 right-4 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
              >
                Clear Selection
              </button>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedCustomer.name}</h3>
                  <div className="text-slate-600 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{selectedCustomer.address}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Phone</p>
                    <p className="font-medium text-slate-800">{getPhone(selectedCustomer)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Home className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Property</p>
                    <p className="font-medium text-slate-800">
                      {getPropertyType(selectedCustomer)} • {getSquareFootage(selectedCustomer).toLocaleString()} sq ft
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">System</p>
                    <p className="font-medium text-slate-800">
                      {selectedCustomer.systemType || 'Unknown'} {selectedCustomer.systemAge ? `(${selectedCustomer.systemAge} yrs)` : ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Last Service</p>
                    <p className="font-medium text-slate-800">{getLastServiceDate(selectedCustomer)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
