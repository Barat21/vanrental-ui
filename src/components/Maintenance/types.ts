export interface MaintenanceFormData {
  date: string;
  description: string;
  cost: number;
  vanNo: string;
  driverName: string;
  paidByDriver: boolean;
}

export interface MaintenanceRecord extends MaintenanceFormData {
  id: string;
}

export interface SortConfig {
  field: keyof MaintenanceRecord;
  order: 'asc' | 'desc';
}