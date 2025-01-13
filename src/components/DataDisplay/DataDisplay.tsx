import React, { useState } from 'react';
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

  const handleExportDriver = () => {
    const totalDriverRent = filteredData.reduce((sum, record) => sum + record.driverRent, 0);
    const totalMiscSpends = filteredData.reduce((sum, record) => sum + record.miscSpends, 0);
    const totalAdvance = filteredData.reduce((sum, record) => sum + (record.advance || 0), 0);
    const grandTotal = totalDriverRent + totalMiscSpends - totalAdvance;

    const dataToExport = [
      ...filteredData.map(record => ({
        Date: record.deliveryDate,
        'From - To': `${record.from} - ${record.to}`,
        'Driver Name': record.driverName,
        'Driver Rent': record.driverRent,
        'Misc Spends': record.miscSpends,
        'Advance': record.advance || 0,
        'Total': record.driverRent + record.miscSpends - (record.advance || 0)
      })),
      {
        Date: 'TOTALS',
        'From - To': '',
        'Driver Name': '',
        'Driver Rent': totalDriverRent,
        'Misc Spends': totalMiscSpends,
        'Advance': totalAdvance,
        'Total': grandTotal
      }
    ];

    exportToExcel(dataToExport, `driver-salary-${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportVendor = () => {
    const totalRent = filteredData.reduce((sum, record) => sum + record.totalRent, 0);
    const totalMiscSpends = filteredData.reduce((sum, record) => sum + record.miscSpends, 0);
    const totalAdvance = filteredData.reduce((sum, record) => sum + (record.advance || 0), 0);
    const grandTotal = totalRent + totalMiscSpends - totalAdvance;

    const dataToExport = [
      ...filteredData.map(record => ({
        Date: record.deliveryDate,
        'From - To': `${record.from} - ${record.to}`,
        'Number of Bags': record.numberOfBags,
        'Wayment': record.wayment,
        'Rent per Bag': record.rentPerBag,
        'Total Rent': record.totalRent,
        'Misc Spends': record.miscSpends,
        'Advance': record.advance || 0,
        'Net Amount': record.totalRent + record.miscSpends - (record.advance || 0)
      })),
      {
        Date: 'TOTALS',
        'From - To': '',
        'Number of Bags': '',
        'Wayment': '',
        'Rent per Bag': '',
        'Total Rent': totalRent,
        'Misc Spends': totalMiscSpends,
        'Advance': totalAdvance,
        'Net Amount': grandTotal
      }
    ];

    exportToExcel(dataToExport, `vendor-rent-${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
        />
        
        <div className="flex items-center gap-4">
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
          <button
            onClick={displayMode === 'driver' ? handleExportDriver : handleExportVendor}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export to Excel
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