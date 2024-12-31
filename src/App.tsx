import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { DeliveryForm } from './components/DeliveryForm/DeliveryForm';
import { DataDisplay } from './components/DataDisplay/DataDisplay';
import { MaintenanceForm } from './components/Maintenance/MaintenanceForm';
import { MaintenanceTable } from './components/Maintenance/MaintenanceTable';
import { FuelForm } from './components/Fuel/FuelForm';
import { FuelTable } from './components/Fuel/FuelTable';
import { AdvanceForm } from './components/Advance/AdvanceForm';
import { AdvanceTable } from './components/Advance/AdvanceTable';
import { DriverPaymentTable } from './components/DriverPayment/DriverPaymentTable';
import { VendorPaymentTable } from './components/VendorPayment/VendorPaymentTable';
import { DeliveryRecord } from './components/DataDisplay/types';
import { MaintenanceRecord } from './components/Maintenance/types';
import { FuelRecord } from './components/Fuel/types';
import { AdvanceRecord } from './components/Advance/types';
import { DriverPaymentRecord } from './components/DriverPayment/types';
import { VendorPaymentRecord } from './components/VendorPayment/types';
import { DeliveryFormData } from './components/DeliveryForm/types';
import { handleSort } from './utils/sorting';
import { fetchTrips } from './services/tripService';
import { LoadingSpinner } from './components/LoadingSpinner';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'delivery' | 'maintenance' | 'fuel' | 'advance' | 'driverPayment' | 'vendorPayment'>('delivery');
  const [showForm, setShowForm] = useState(true);
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [fuel, setFuel] = useState<FuelRecord[]>([]);
  const [advance, setAdvance] = useState<AdvanceRecord[]>([]);
  const [driverPayments] = useState<DriverPaymentRecord[]>([]);
  const [vendorPayments] = useState<VendorPaymentRecord[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortConfig, setSortConfig] = useState({ field: 'deliveryDate', order: 'desc' as const });

  useEffect(() => {
    if (isLoggedIn && !showForm) {
      loadTrips();
    }
  }, [isLoggedIn, showForm]);

  const loadTrips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const trips = await fetchTrips();
      const formattedTrips = trips.map(trip => ({
        id: String(trip.id),
        from: trip.fromLocation,
        to: trip.toLocation,
        deliveryDate: trip.dateOfDelivery,
        wayment: trip.wayment,
        numberOfBags: trip.numberOfBags,
        rentPerBag: trip.rentPerBag,
        driverName: trip.driverName,
        driverRent: trip.driverRent,
        miscSpends: trip.miscSpends,
        totalRent: trip.numberOfBags * trip.rentPerBag
      }));
      setDeliveries(formattedTrips);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trips');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortWrapper = (field: string) => {
    handleSort(field, sortConfig, setSortConfig);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['delivery', 'maintenance', 'fuel', 'advance', 'driverPayment', 'vendorPayment'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as any);
                  setShowForm(true);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'driverPayment' ? 'Driver Payment' : 
                 tab === 'vendorPayment' ? 'Vendor Payment' :
                 tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeTab === 'driverPayment' ? 'Driver Payment Records' :
             activeTab === 'vendorPayment' ? 'Vendor Payment Records' :
             showForm ? `New ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` : 
             `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Records`}
          </h1>
          {activeTab !== 'driverPayment' && activeTab !== 'vendorPayment' && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showForm ? 'View Records' : 'New Record'}
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        )}

        {!isLoading && (
          <>
            {activeTab === 'delivery' && showForm && (
              <DeliveryForm onSubmit={(data: DeliveryFormData) => {
                loadTrips(); // Reload the trips after submission
              }} />
            )}

            {activeTab === 'delivery' && !showForm && (
              <DataDisplay
                data={deliveries}
                sortConfig={sortConfig}
                onSort={handleSortWrapper}
                startDate={dateRange.start}
                endDate={dateRange.end}
                onStartDateChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                onEndDateChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
              />
            )}

            {/* Other components remain the same */}
          </>
        )}
      </div>
    </div>
  );
}

export default App;