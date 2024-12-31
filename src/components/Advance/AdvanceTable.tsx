import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Search } from 'lucide-react';
import { AdvanceRecord } from './types';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { DateRangeFilter } from '../DataDisplay/DateRangeFilter';
import { exportToExcel } from '../../utils/exportToExcel';

interface AdvanceTableProps {
  data: AdvanceRecord[];
  sortConfig: { field: keyof AdvanceRecord; order: 'asc' | 'desc' };
  onSort: (field: keyof AdvanceRecord) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function AdvanceTable({
  data,
  sortConfig,
  onSort,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: AdvanceTableProps) {
  const [driverSearch, setDriverSearch] = useState('');

  const getSortIcon = (field: keyof AdvanceRecord) => {
    if (sortConfig.field !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortConfig.order === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const filteredByDate = data.filter(record => {
    if (!startDate && !endDate) return true;
    const recordDate = new Date(record.date);
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date(8640000000000000);
    return recordDate >= start && recordDate <= end;
  });

  const filteredData = filteredByDate.filter(record =>
    record.driverName.toLowerCase().includes(driverSearch.toLowerCase())
  );

  const totalAmount = filteredData.reduce((sum, record) => sum + record.amount, 0);

  const handleExport = () => {
    const dataToExport = filteredData.map(record => ({
      Date: record.date,
      'Driver Name': record.driverName,
      Amount: record.amount,
    }));

    exportToExcel(dataToExport, `advance-payments-${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4 flex-wrap">
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

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by driver name..."
          value={driverSearch}
          onChange={(e) => setDriverSearch(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => onSort('date')}
              >
                <div className="flex items-center gap-1">
                  Date {getSortIcon('date')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Driver Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(record.date)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {record.driverName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(record.amount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" colSpan={2}>
                Total Advance Payments
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatCurrency(totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}