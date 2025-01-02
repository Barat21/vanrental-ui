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
import { handleSort } from './utils/sorting';
import { fetchTrips } from './services/tripService';
import { LoadingSpinner } from './components/LoadingSpinner';
import { 
  sampleMaintenance, 
  sampleFuel, 
  sampleAdvancePayments,
  sampleDriverPayments,
  sampleVendorPayments 
} from './data/sampleData';

type TabType = 'delivery' | 'maintenance' | 'fuel' | 'advance' | 'driverPayment' | 'vendorPayment';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('delivery');
  const [showForm, setShowForm] = useState(true);
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>(sampleMaintenance);
  const [fuel, setFuel] = useState<FuelRecord[]>(sampleFuel);
  const [advance, setAdvance] = useState<AdvanceRecord[]>(sampleAdvancePayments);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      console.log("Raw trips data:", trips); // Debug log
      
      const formattedTrips = trips.map(trip => ({
        id: String(trip.id || Date.now()),
        from: trip.fromLocation || (trip.vanNo === 'ADVANCE' ? 'Advance Payment' : '-'),
        to: trip.toLocation || (trip.vanNo === 'ADVANCE' ? '' : '-'),
        deliveryDate: trip.dateOfDelivery || '',
        wayment: trip.wayment || 0,
        numberOfBags: trip.numberOfBags || 0,
        rentPerBag: trip.rentPerBag || 0,
        driverName: trip.driverName || '',
        driverRent: trip.driverRent || 0,
        miscSpends: trip.miscSpends || 0,
        advance: trip.advance || 0,
        totalRent: (trip.numberOfBags || 0) * (trip.rentPerBag || 0)
      }));
      
      console.log("Formatted trips data:", formattedTrips); // Debug log
      setDeliveries(formattedTrips);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trips');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaintenanceSubmit = (record: MaintenanceRecord) => {
    setMaintenance(prev => [...prev, record]);
    setShowForm(false);
  };

  const handleFuelSubmit = (record: FuelRecord) => {
    setFuel(prev => [...prev, record]);
    setShowForm(false);
  };

  const handleAdvanceSubmit = (record: AdvanceRecord) => {
    setAdvance(prev => [...prev, record]);
    setShowForm(false);
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
                  setActiveTab(tab as TabType);
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

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {activeTab === 'delivery' && showForm && (
              <DeliveryForm onSubmit={() => {
                loadTrips();
                setShowForm(false);
              }} />
            )}

            {activeTab === 'delivery' && !showForm && (
              <DataDisplay
                data={deliveries}
                sortConfig={sortConfig}
                onSort={handleSort}
                startDate={dateRange.start}
                endDate={dateRange.end}
                onStartDateChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                onEndDateChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
              />
            )}

            {activeTab === 'maintenance' && showForm && (
              <MaintenanceForm onSubmit={handleMaintenanceSubmit} />
            )}

            {activeTab === 'maintenance' && !showForm && (
              <MaintenanceTable
                data={maintenance}
                sortConfig={sortConfig}
                onSort={handleSort}
                startDate={dateRange.start}
                endDate={dateRange.end}
                onStartDateChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                onEndDateChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
              />
            )}

            {activeTab === 'fuel' && showForm && (
              <FuelForm onSubmit={handleFuelSubmit} />
            )}

            {activeTab === 'fuel' && !showForm && (
              <FuelTable
                data={fuel}
                sortConfig={sortConfig}
                onSort={handleSort}
                startDate={dateRange.start}
                endDate={dateRange.end}
                onStartDateChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                onEndDateChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
              />
            )}

            {activeTab === 'advance' && showForm && (
              <AdvanceForm onSubmit={handleAdvanceSubmit} />
            )}

            {activeTab === 'advance' && !showForm && (
              <AdvanceTable
                data={advance}
                sortConfig={sortConfig}
                onSort={handleSort}
                startDate={dateRange.start}
                endDate={dateRange.end}
                onStartDateChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                onEndDateChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
              />
            )}

            {activeTab === 'driverPayment' && (
              <DriverPaymentTable
                data={sampleDriverPayments}
                advanceData={advance}
                sortConfig={sortConfig}
                onSort={handleSort}
                startDate={dateRange.start}
                endDate={dateRange.end}
                onStartDateChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                onEndDateChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
              />
            )}

            {activeTab === 'vendorPayment' && (
              <VendorPaymentTable
                data={sampleVendorPayments}
                sortConfig={sortConfig}
                onSort={handleSort}
                startDate={dateRange.start}
                endDate={dateRange.end}
                onStartDateChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                onEndDateChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;