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
import { DeliveryRecord } from './components/DataDisplay/types';
import { MaintenanceRecord } from './components/Maintenance/types';
import { FuelRecord } from './components/Fuel/types';
import { AdvanceRecord } from './components/Advance/types';
import { fetchTrips, deleteTrip } from './services/tripService';
import { DeleteConfirmation } from './components/common/DeleteConfirmation';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('delivery');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [sortConfig, setSortConfig] = useState({ field: 'deliveryDate' as keyof DeliveryRecord, order: 'desc' as 'asc' | 'desc' });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceRecord | undefined>();
  const [selectedFuel, setSelectedFuel] = useState<FuelRecord | undefined>();
  const [selectedAdvance, setSelectedAdvance] = useState<AdvanceRecord | undefined>();
  const [deliveryData, setDeliveryData] = useState<DeliveryRecord[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryRecord | undefined>();
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({ isOpen: false, id: null });

  useEffect(() => {
    if (activeTab === 'delivery' && !isAddingNew) {
      loadDeliveryData();
    }
  }, [activeTab, isAddingNew]);

  const loadDeliveryData = async () => {
    try {
      const trips = await fetchTrips();
      const records: DeliveryRecord[] = trips.map(trip => ({
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
      setDeliveryData(records);
    } catch (error) {
      console.error('Error loading delivery data:', error);
    }
  };

  const handleDeleteDelivery = async (id: string) => {
    setDeleteConfirmation({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (deleteConfirmation.id) {
      try {
        await deleteTrip(Number(deleteConfirmation.id));
        await loadDeliveryData();
      } catch (error) {
        console.error('Error deleting delivery:', error);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleEditRecord = (type: 'maintenance' | 'fuel' | 'advance', record: MaintenanceRecord | FuelRecord | AdvanceRecord) => {
    setIsAddingNew(true);
    switch (type) {
      case 'maintenance':
        setSelectedMaintenance(record as MaintenanceRecord);
        break;
      case 'fuel':
        setSelectedFuel(record as FuelRecord);
        break;
      case 'advance':
        setSelectedAdvance(record as AdvanceRecord);
        break;
    }
  };

  const handleFormSubmit = (type: 'maintenance' | 'fuel' | 'advance') => {
    setIsAddingNew(false);
    switch (type) {
      case 'maintenance':
        setSelectedMaintenance(undefined);
        break;
      case 'fuel':
        setSelectedFuel(undefined);
        break;
      case 'advance':
        setSelectedAdvance(undefined);
        break;
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Layout onLogout={handleLogout}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveTab('delivery');
                  setIsAddingNew(false);
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'delivery'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Delivery
              </button>
              <button
                onClick={() => {
                  setActiveTab('maintenance');
                  setIsAddingNew(false);
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'maintenance'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Maintenance
              </button>
              <button
                onClick={() => {
                  setActiveTab('fuel');
                  setIsAddingNew(false);
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'fuel'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Fuel
              </button>
              <button
                onClick={() => {
                  setActiveTab('advance');
                  setIsAddingNew(false);
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'advance'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Advance
              </button>
              <button
                onClick={() => {
                  setActiveTab('driverPayment');
                  setIsAddingNew(false);
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'driverPayment'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Driver Payment
              </button>
              <button
                onClick={() => {
                  setActiveTab('vendorPayment');
                  setIsAddingNew(false);
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'vendorPayment'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Vendor Payment
              </button>
            </div>

            {activeTab !== 'driverPayment' && activeTab !== 'vendorPayment' && (
              <button
                onClick={() => {
                  setIsAddingNew(true);
                  setSelectedMaintenance(undefined);
                  setSelectedFuel(undefined);
                  setSelectedAdvance(undefined);
                  setSelectedDelivery(undefined);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New
              </button>
            )}
          </div>
        </div>

        {activeTab === 'delivery' && (
          isAddingNew ? (
            <DeliveryForm
              onSubmit={() => {
                setIsAddingNew(false);
                loadDeliveryData();
              }}
              initialData={selectedDelivery}
              isEdit={!!selectedDelivery}
            />
          ) : (
            <DataDisplay
              data={deliveryData}
              sortConfig={sortConfig}
              onSort={(field) =>
                setSortConfig(prev => ({
                  field,
                  order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
                }))
              }
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onEdit={(record) => {
                setSelectedDelivery(record);
                setIsAddingNew(true);
              }}
              onDelete={handleDeleteDelivery}
            />
          )
        )}

        {activeTab === 'maintenance' && (
          isAddingNew ? (
            <MaintenanceForm
              onSubmit={() => handleFormSubmit('maintenance')}
              initialData={selectedMaintenance}
              isEdit={!!selectedMaintenance}
            />
          ) : (
            <MaintenanceTable
              onEdit={(record) => handleEditRecord('maintenance', record)}
              onRefresh={() => setSelectedMaintenance(undefined)}
            />
          )
        )}

        {activeTab === 'fuel' && (
          isAddingNew ? (
            <FuelForm
              onSubmit={() => handleFormSubmit('fuel')}
              initialData={selectedFuel}
              isEdit={!!selectedFuel}
            />
          ) : (
            <FuelTable
              onEdit={(record) => handleEditRecord('fuel', record)}
              onRefresh={() => setSelectedFuel(undefined)}
            />
          )
        )}

        {activeTab === 'advance' && (
          isAddingNew ? (
            <AdvanceForm
              onSubmit={() => handleFormSubmit('advance')}
              initialData={selectedAdvance}
              isEdit={!!selectedAdvance}
            />
          ) : (
            <AdvanceTable
              onEdit={(record) => handleEditRecord('advance', record)}
              onRefresh={() => setSelectedAdvance(undefined)}
            />
          )
        )}

        {activeTab === 'driverPayment' && (
          <DriverPaymentTable
            data={[]}
            advanceData={[]}
            sortConfig={{ field: 'date', order: 'desc' }}
            onSort={() => {}}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        )}

        {activeTab === 'vendorPayment' && (
          <VendorPaymentTable
            sortConfig={{ field: 'date', order: 'desc' }}
            onSort={() => {}}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        )}

        <DeleteConfirmation
          isOpen={deleteConfirmation.isOpen}
          onClose={() => setDeleteConfirmation({ isOpen: false, id: null })}
          onConfirm={confirmDelete}
        />
      </div>
    </Layout>
  );
}