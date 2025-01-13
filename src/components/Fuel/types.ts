export interface FuelRecord {
  id: string;
  date: string;
  description: string;
  cost: number;
  driverName?: string;
  paidByDriver: boolean;
}

export interface SortConfig {
  field: keyof FuelRecord;
  order: 'asc' | 'desc';
}