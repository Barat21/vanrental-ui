import { DeliveryRecord } from '../components/DataDisplay/types';
import { MaintenanceRecord } from '../components/Maintenance/types';
import { FuelRecord } from '../components/Fuel/types';
import { AdvanceRecord } from '../components/Advance/types';
import { DriverPaymentRecord } from '../components/DriverPayment/types';
import { VendorPaymentRecord } from '../components/VendorPayment/types';

export const sampleDeliveries: DeliveryRecord[] = [
  {
    id: '1',
    from: 'Mumbai',
    to: 'Pune',
    deliveryDate: '2024-03-01',
    wayment: 780,
    numberOfBags: 10,
    rentPerBag: 500,
    driverName: 'Rajesh Kumar',
    driverRent: 3000,
    miscSpends: 500,
    totalRent: 5000
  },
  {
    id: '2',
    from: 'Pune',
    to: 'Nashik',
    deliveryDate: '2024-03-03',
    wayment: 1560,
    numberOfBags: 20,
    rentPerBag: 450,
    driverName: 'Suresh Patel',
    driverRent: 2800,
    miscSpends: 700,
    totalRent: 9000
  },
  {
    id: '3',
    from: 'Nashik',
    to: 'Mumbai',
    deliveryDate: '2024-03-05',
    wayment: 2340,
    numberOfBags: 30,
    rentPerBag: 480,
    driverName: 'Amit Singh',
    driverRent: 3200,
    miscSpends: 600,
    totalRent: 14400
  },
  {
    id: '4',
    from: 'Mumbai',
    to: 'Nagpur',
    deliveryDate: '2024-03-07',
    wayment: 3120,
    numberOfBags: 40,
    rentPerBag: 520,
    driverName: 'Rajesh Kumar',
    driverRent: 4000,
    miscSpends: 800,
    totalRent: 20800
  },
  {
    id: '5',
    from: 'Nagpur',
    to: 'Pune',
    deliveryDate: '2024-03-09',
    wayment: 3900,
    numberOfBags: 50,
    rentPerBag: 490,
    driverName: 'Suresh Patel',
    driverRent: 3500,
    miscSpends: 900,
    totalRent: 24500
  }
];

export const sampleMaintenance: MaintenanceRecord[] = [
  {
    id: '1',
    date: '2024-03-02',
    description: 'Oil Change and Filter Replacement',
    cost: 3500
  },
  {
    id: '2',
    date: '2024-03-10',
    description: 'Brake Pad Replacement',
    cost: 4800
  },
  {
    id: '3',
    date: '2024-03-15',
    description: 'Tire Rotation and Alignment',
    cost: 2500
  },
  {
    id: '4',
    date: '2024-03-20',
    description: 'Battery Replacement',
    cost: 8000
  },
  {
    id: '5',
    date: '2024-03-25',
    description: 'General Service and Inspection',
    cost: 5500
  }
];

export const sampleFuel: FuelRecord[] = [
  {
    id: '1',
    date: '2024-03-01',
    description: 'Full Tank Refill',
    cost: 5000
  },
  {
    id: '2',
    date: '2024-03-05',
    description: 'Half Tank Refill',
    cost: 2500
  },
  {
    id: '3',
    date: '2024-03-10',
    description: 'Full Tank Refill',
    cost: 5200
  },
  {
    id: '4',
    date: '2024-03-15',
    description: 'Three-Quarter Tank Refill',
    cost: 3800
  },
  {
    id: '5',
    date: '2024-03-20',
    description: 'Full Tank Refill',
    cost: 5100
  }
];

export const sampleAdvancePayments: AdvanceRecord[] = [
  {
    id: '1',
    date: '2024-03-01',
    driverName: 'Rajesh Kumar',
    amount: 1000
  },
  {
    id: '2',
    date: '2024-03-05',
    driverName: 'Suresh Patel',
    amount: 1500
  },
  {
    id: '3',
    date: '2024-03-10',
    driverName: 'Amit Singh',
    amount: 1200
  },
  {
    id: '4',
    date: '2024-03-15',
    driverName: 'Rajesh Kumar',
    amount: 2000
  },
  {
    id: '5',
    date: '2024-03-20',
    driverName: 'Suresh Patel',
    amount: 1800
  }
];

export const sampleDriverPayments: DriverPaymentRecord[] = [
  {
    id: '1',
    date: '2024-03-01',
    from: 'Mumbai',
    to: 'Pune',
    numberOfBags: 10,
    driverName: 'Rajesh Kumar',
    driverRent: 3000
  },
  {
    id: '2',
    date: '2024-03-05',
    from: 'Pune',
    to: 'Nashik',
    numberOfBags: 15,
    driverName: 'Suresh Patel',
    driverRent: 3500
  },
  {
    id: '3',
    date: '2024-03-10',
    from: 'Nashik',
    to: 'Mumbai',
    numberOfBags: 12,
    driverName: 'Amit Singh',
    driverRent: 3200
  },
  {
    id: '4',
    date: '2024-03-15',
    from: 'Mumbai',
    to: 'Nagpur',
    numberOfBags: 18,
    driverName: 'Rajesh Kumar',
    driverRent: 4000
  },
  {
    id: '5',
    date: '2024-03-20',
    from: 'Nagpur',
    to: 'Pune',
    numberOfBags: 20,
    driverName: 'Suresh Patel',
    driverRent: 4500
  }
];

export const sampleVendorPayments: VendorPaymentRecord[] = [
  {
    id: '1',
    date: '2024-03-01',
    from: 'Mumbai',
    to: 'Pune',
    numberOfBags: 10,
    wayment: 780,
    rent: 5000,
    miscSpends: 500,
    advance: 2000
  },
  {
    id: '2',
    date: '2024-03-05',
    from: 'Pune',
    to: 'Nashik',
    numberOfBags: 15,
    wayment: 1170,
    rent: 7500,
    miscSpends: 800,
    advance: 3000
  },
  {
    id: '3',
    date: '2024-03-10',
    from: 'Nashik',
    to: 'Mumbai',
    numberOfBags: 12,
    wayment: 936,
    rent: 6000,
    miscSpends: 600,
    advance: 2500
  },
  {
    id: '4',
    date: '2024-03-15',
    from: 'Mumbai',
    to: 'Nagpur',
    numberOfBags: 18,
    wayment: 1404,
    rent: 9000,
    miscSpends: 1000,
    advance: 4000
  },
  {
    id: '5',
    date: '2024-03-20',
    from: 'Nagpur',
    to: 'Pune',
    numberOfBags: 20,
    wayment: 1560,
    rent: 10000,
    miscSpends: 1200,
    advance: 4500
  }
];