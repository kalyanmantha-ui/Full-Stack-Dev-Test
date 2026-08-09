export interface Customer {
  id: string;
  name: string;
  address: string;
  phone?: string;
  propertyType?: string;
  property_type?: string;
  squareFootage?: number;
  sqft?: number;
  systemType?: string;
  systemAge?: number;
  lastServiceDate?: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  brand: string;
  modelNumber: string;
  baseCost?: number;
  base_cost?: number;
}

export interface LaborRate {
  jobType: string;
  level: string;
  hourlyRate: number;
  estimatedHours: {
    min: number;
    max: number;
  };
}

export interface EstimateLineItem {
  id: string; // Unique ID for the line item in the builder
  type: 'equipment' | 'labor' | 'custom';
  itemId?: string; // Reference to EquipmentItem ID
  name: string;
  quantity: number;
  
  // For Equipment / Custom Flat Amounts (can be negative for discounts)
  unitCost?: number;
  
  // For Labor
  hourlyRate?: number;
  estimatedMinHours?: number;
  estimatedMaxHours?: number;
  jobType?: string;
  level?: string;
  
  isCustom?: boolean;
}

export interface EstimateData {
  id: string;
  date: string;
  customer?: Customer;
  lineItems: EstimateLineItem[];
  notes: string;
}
