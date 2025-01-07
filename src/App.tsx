import React, { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
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
import { MaintenanceRecord } from './components/Maintenance/types';
import { DeliveryFormData } from './components/DeliveryForm/types';
import { DeliveryRecord } from './components/DataDisplay/types';
import { fetchTrips, deleteTrip } from './services/tripService';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('delivery');
  const [showForm, setShowForm] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceRecord | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryRecord | null>(null);
  const [sortConfig, setSortConfig] = useState({ field: 'date', order: 'desc' as const });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deliveryData, setDeliveryData] = useState<DeliveryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'delivery' && !showForm) {
      loadDeliveryData();
    }
  }, [activeTab, showForm]);

  const loadDeliveryData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const trips = await fetchTrips();
      
      // Transform trip data to delivery records
      const deliveryRecords: DeliveryRecord[] = trips.map(trip => ({
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
        totalRent: trip.numberOfBags * trip.rentPerBag,
        advance: trip.advance || 0
      }));

      setDeliveryData(deliveryRecords);
    } catch (err) {
      setError('Failed to load delivery data');
      console.error('Error loading delivery data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleMaintenanceSubmit = () => {
    setShowForm(false);
    setSelectedMaintenance(null);
  };

  const handleEditMaintenance = (record: MaintenanceRecord) => {
    setSelectedMaintenance(record);
    setShowForm(true);
  };

  const handleDeliverySubmit = async (formData: DeliveryFormData) => {
    await loadDeliveryData(); // Refresh data after submit
    setShowForm(false);
    setSelectedDelivery(null);
  };

  const handleEditDelivery = (record: DeliveryRecord) => {
    setSelectedDelivery(record);
    setShowForm(true);
  };

  const handleDeleteDelivery = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this delivery?')) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteTrip(Number(id));
      await loadDeliveryData(); // Refresh data after delete
    } catch (err) {
      setError('Failed to delete delivery');
      console.error('Error deleting delivery:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Layout onLogout={handleLogout}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'delivery'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Delivery
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'maintenance'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Maintenance
          </button>
          <button
            onClick={() => setActiveTab('fuel')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'fuel'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Fuel
          </button>
          <button
            onClick={() => setActiveTab('advance')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'advance'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Advance
          </button>
          <button
            onClick={() => setActiveTab('driverPayment')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'driverPayment'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Driver Payment
          </button>
          <button
            onClick={() => setActiveTab('vendorPayment')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'vendorPayment'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Vendor Payment
          </button>
        </div>

        {/* Add/Back Button */}
        {activeTab !== 'driverPayment' && activeTab !== 'vendorPayment' && (
          <button
            onClick={() => {
              setShowForm(!showForm);
              setSelectedDelivery(null);
            }}
            className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Back to List' : `Add ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          </button>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 text-red-800 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Content Area */}
        <div className="mt-6">
          {activeTab === 'delivery' && (
            showForm ? (
              <DeliveryForm 
                onSubmit={handleDeliverySubmit}
                initialData={selectedDelivery || undefined}
                isEdit={!!selectedDelivery}
              />
            ) : (
              <DataDisplay
                data={deliveryData}
                sortConfig={sortConfig}
                onSort={(field) => setSortConfig(prev => ({
                  field,
                  order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
                }))}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onEdit={handleEditDelivery}
                onDelete={handleDeleteDelivery}
              />
            )
          )}

          {/* Rest of the components remain the same */}
          {activeTab === 'maintenance' && (
            showForm ? (
              <MaintenanceForm
                onSubmit={handleMaintenanceSubmit}
                initialData={selectedMaintenance || undefined}
                isEdit={!!selectedMaintenance}
              />
            ) : (
              <MaintenanceTable
                onEdit={handleEditMaintenance}
                onRefresh={() => setSelectedMaintenance(null)}
              />
            )
          )}

          {activeTab === 'fuel' && (
            showForm ? (
              <FuelForm onSubmit={() => setShowForm(false)} />
            ) : (
              <FuelTable
                data={[]}
                sortConfig={sortConfig}
                onSort={(field) => setSortConfig(prev => ({
                  field,
                  order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
                }))}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
            )
          )}

          {activeTab === 'advance' && (
            showForm ? (
              <AdvanceForm onSubmit={() => setShowForm(false)} />
            ) : (
              <AdvanceTable
                data={[]}
                sortConfig={sortConfig}
                onSort={(field) => setSortConfig(prev => ({
                  field,
                  order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
                }))}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
            )
          )}

          {activeTab === 'driverPayment' && (
            <DriverPaymentTable
              data={[]}
              advanceData={[]}
              sortConfig={sortConfig}
              onSort={(field) => setSortConfig(prev => ({
                field,
                order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
              }))}
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          )}

          {activeTab === 'vendorPayment' && (
            <VendorPaymentTable
              sortConfig={sortConfig}
              onSort={(field) => setSortConfig(prev => ({
                field,
                order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
              }))}
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}