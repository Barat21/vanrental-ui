export interface DeliveryFormData {
  from: string;
  to: string;
  deliveryDate: string;
  wayment: number;
  numberOfBags: number;
  rentPerBag: number;
  driverName: string;
  driverRent: number;
  miscSpends: number;
  image: File | null;
}

export interface FormErrors {
  [key: string]: string;
}