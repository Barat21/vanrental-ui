import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Download } from 'lucide-react';
import { MaintenanceRecord } from './types';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { DateRangeFilter } from '../DataDisplay/DateRangeFilter';
import { exportToExcel } from '../../utils/exportToExcel';

interface MaintenanceTableProps {
  data: MaintenanceRecord[];
  sortConfig: { field: keyof MaintenanceRecord; order: 'asc' | 'desc' };
  onSort: (field: keyof MaintenanceRecord) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function MaintenanceTable({
  data,
  sortConfig,
  onSort,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: MaintenanceTableProps) {
  const getSortIcon = (field: keyof MaintenanceRecord) => {
    if (sortConfig.field !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortConfig.order === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const filteredData = data.filter(record => {
    if (!startDate && !endDate) return true;
    const recordDate = new Date(record.date);
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date(8640000000000000);
    return recordDate >= start && recordDate <= end;
  });

  const totalCost = filteredData.reduce((sum, record) => sum + record.cost, 0);

  const handleExport = () => {
    const dataToExport = filteredData.map(record => ({
      Date: record.date,
      Description: record.description,
      Cost: record.cost,
    }));

    exportToExcel(dataToExport, `maintenance-records-${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="space-y-4">
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
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost
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
                  {record.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(record.cost)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" colSpan={2}>
                Total
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatCurrency(totalCost)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}