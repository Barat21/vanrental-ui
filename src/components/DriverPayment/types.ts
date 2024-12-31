export interface DriverPaymentRecord {
  id: string;
  date: string;
  from: string;
  to: string;
  numberOfBags: number;
  driverName: string;
  driverRent: number;
}