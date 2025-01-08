import React, { useState } from 'react';
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
import { Truck, Wrench, Fuel, Wallet, Users, Building, Plus, ArrowLeft } from 'lucide-react';

const tabs = [
  { id: 'delivery', label: 'Delivery', icon: <Truck className="h-5 w-5" /> },
  { id: 'maintenance', label: 'Maintenance', icon: <Wrench className="h-5 w-5" /> },
  { id: 'fuel', label: 'Fuel', icon: <Fuel className="h-5 w-5" /> },
  { id: 'advance', label: 'Advance', icon: <Wallet className="h-5 w-5" /> },
  { id: 'driverPayment', label: 'Driver Payment', icon: <Users className="h-5 w-5" /> },
  { id: 'vendorPayment', label: 'Vendor Payment', icon: <Building className="h-5 w-5" /> },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('delivery');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceRecord | undefined>();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: 'deliveryDate', order: 'desc' });

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleMaintenanceEdit = (record: MaintenanceRecord) => {
    setSelectedMaintenance(record);
    setIsAddingNew(true);
  };

  const handleMaintenanceSubmit = () => {
    setIsAddingNew(false);
    setSelectedMaintenance(undefined);
  };

  const handleDeliverySubmit = (data: DeliveryFormData) => {
    console.log('Delivery submitted:', data);
    setIsAddingNew(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Layout onLogout={handleLogout}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h1>
            {!isAddingNew ? (
              <button
                onClick={() => setIsAddingNew(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add New
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setSelectedMaintenance(undefined);
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to List
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsAddingNew(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {activeTab === 'delivery' && (
            isAddingNew ? (
              <DeliveryForm onSubmit={handleDeliverySubmit} />
            ) : (
              <DataDisplay
                data={[]}
                sortConfig={sortConfig}
                onSort={() => {}}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            )
          )}

          {activeTab === 'maintenance' && (
            isAddingNew ? (
              <MaintenanceForm 
                onSubmit={handleMaintenanceSubmit}
                initialData={selectedMaintenance}
                isEdit={!!selectedMaintenance}
              />
            ) : (
              <MaintenanceTable 
                onEdit={handleMaintenanceEdit}
                onRefresh={() => setSelectedMaintenance(undefined)}
              />
            )
          )}

          {activeTab === 'fuel' && (
            isAddingNew ? (
              <FuelForm onSubmit={() => setIsAddingNew(false)} />
            ) : (
              <FuelTable
                data={[]}
                sortConfig={{ field: 'date', order: 'desc' }}
                onSort={() => {}}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
            )
          )}

          {activeTab === 'advance' && (
            isAddingNew ? (
              <AdvanceForm onSubmit={() => setIsAddingNew(false)} />
            ) : (
              <AdvanceTable
                data={[]}
                sortConfig={{ field: 'date', order: 'desc' }}
                onSort={() => {}}
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
        </div>
      </div>
    </Layout>
  );
}