import type { Customer, EquipmentItem } from '../types/hvac';

export function getBaseCost(item: EquipmentItem): number {
  return item.baseCost ?? item.base_cost ?? 0;
}

export function getPropertyType(customer: Customer): string {
  const type = customer.propertyType ?? customer.property_type ?? 'Unknown';
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function getSquareFootage(customer: Customer): number {
  return customer.squareFootage ?? customer.sqft ?? 0;
}

export function getPhone(customer: Customer): string {
  return customer.phone || 'Not on file';
}

export function getLastServiceDate(customer: Customer): string {
  if (!customer.lastServiceDate) return 'Not on file';
  
  try {
    const date = new Date(customer.lastServiceDate);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch {
    return customer.lastServiceDate;
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
