export interface TripData {
  id?: number;
  fromLocation: string;
  toLocation: string;
  dateOfDelivery: string;
  wayment: number;
  numberOfBags: number;
  rentPerBag: number;
  driverName: string;
  driverRent: number;
  miscSpends: number;
  vanNo: string;
  advance: number;
  imageUrl?: string;
}