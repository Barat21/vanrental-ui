import React, { useState, useMemo } from 'react';
import { DeliveryRecord, SortConfig } from './types';
import { DriverSalaryTable } from './DriverSalaryTable';
import { VendorRentTable } from './VendorRentTable';
import { DateRangeFilter } from './DateRangeFilter';
import { Download } from 'lucide-react';
import { exportToExcel } from '../../utils/exportToExcel';

interface DataDisplayProps {
  data: DeliveryRecord[];
  sortConfig: SortConfig;
  onSort: (field: keyof DeliveryRecord) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function DataDisplay({
  data,
  sortConfig,
  onSort,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DataDisplayProps) {
  const [activeTab, setActiveTab] = useState<'driver' | 'vendor'>('driver');

  const filteredData = useMemo(() => {
    return data.filter(record => {
      if (!startDate && !endDate) return true;
      const recordDate = new Date(record.deliveryDate);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date(8640000000000000);
      return recordDate >= start && recordDate <= end;
    });
  }, [data, startDate, endDate]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const { field, order } = sortConfig;
      const aValue = a[field];
      const bValue = b[field];
      
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleExport = () => {
    const dataToExport = sortedData.map(record => ({
      Date: record.deliveryDate,
      From: record.from,
      To: record.to,
      'Driver Name': record.driverName,
      'Driver Rent': record.driverRent,
      'Misc Spends': record.miscSpends,
      Wayment: record.wayment,
      'Number of Bags': record.numberOfBags,
      'Rent per Bag': record.rentPerBag,
      'Total Rent': record.totalRent
    }));

    exportToExcel(dataToExport, `${activeTab}-records-${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('driver')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'driver'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Driver Salary
          </button>
          <button
            onClick={() => setActiveTab('vendor')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'vendor'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Vendor Rent
          </button>
        </nav>
      </div>

      <div className="flex justify-between items-center">
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
        />
        
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          Export to Excel
        </button>
      </div>

      {activeTab === 'driver' ? (
        <DriverSalaryTable
          data={sortedData}
          sortConfig={sortConfig}
          onSort={onSort}
        />
      ) : (
        <VendorRentTable
          data={sortedData}
          sortConfig={sortConfig}
          onSort={onSort}
        />
      )}
    </div>
  );
}