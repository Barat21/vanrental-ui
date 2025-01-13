import React, { useState } from 'react';
import { DeliveryRecord, SortConfig } from './types';
import { DriverSalaryTable } from './DriverSalaryTable';
import { VendorRentTable } from './VendorRentTable';
import { DateRangeFilter } from './DateRangeFilter';
import { Download, Search } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data based on date range and search term
  const filteredData = data.filter(record => {
    // Date filter
    const recordDate = new Date(record.deliveryDate);
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date(8640000000000000);
    const dateMatch = recordDate >= start && recordDate <= end;

    // Search filter - convert everything to lowercase for case-insensitive search
    const searchLower = searchTerm.toLowerCase();
    const searchMatch = searchTerm === '' || Object.values(record).some(value => 
      String(value).toLowerCase().includes(searchLower)
    );

    return dateMatch && searchMatch;
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
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
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

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search in all columns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
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