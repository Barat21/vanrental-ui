export interface DeliveryRecord extends Omit<DeliveryFormData, 'image'> {
  id: string;
  totalRent: number;
}

export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: keyof DeliveryRecord;
  order: SortOrder;
}