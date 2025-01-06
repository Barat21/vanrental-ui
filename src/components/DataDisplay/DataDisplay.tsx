import React, { useState } from 'react';
import { DeliveryRecord, SortConfig } from './types';
import { DriverSalaryTable } from './DriverSalaryTable';
import { VendorRentTable } from './VendorRentTable';
import { DateRangeFilter } from './DateRangeFilter';

interface DataDisplayProps {
  data: DeliveryRecord[];
  sortConfig: SortConfig;
  onSort: (field: keyof DeliveryRecord) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onEdit: (record: DeliveryRecord) => void;
  onDelete: (id: string) => void;
}

export function DataDisplay({
  data,
  sortConfig,
  onSort,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onEdit,
  onDelete,
}: DataDisplayProps) {
  const [displayMode, setDisplayMode] = useState<'driver' | 'vendor'>('driver');

  const filteredData = data.filter(record => {
    if (!startDate && !endDate) return true;
    const recordDate = new Date(record.deliveryDate);
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date(8640000000000000);
    return recordDate >= start && recordDate <= end;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
        />
        
        <div className="flex gap-2">
          <button
            onClick={() => setDisplayMode('driver')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              displayMode === 'driver'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Driver View
          </button>
          <button
            onClick={() => setDisplayMode('vendor')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              displayMode === 'vendor'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Vendor View
          </button>
        </div>
      </div>

      {displayMode === 'driver' ? (
        <DriverSalaryTable
          data={filteredData}
          sortConfig={sortConfig}
          onSort={onSort}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : (
        <VendorRentTable
          data={filteredData}
          sortConfig={sortConfig}
          onSort={onSort}
        />
      )}
    </div>
  );
}