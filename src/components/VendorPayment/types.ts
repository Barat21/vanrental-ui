export interface VendorPaymentRecord {
  id: string;
  date: string;
  from: string;
  to: string;
  numberOfBags: number;
  wayment: number;
  rent: number;
  miscSpends: number;
  advance: number;
}