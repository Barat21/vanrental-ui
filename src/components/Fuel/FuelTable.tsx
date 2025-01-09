import React, { useState, useEffect } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Edit, Trash2 } from 'lucide-react';
import { FuelRecord } from './types';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { DateRangeFilter } from '../DataDisplay/DateRangeFilter';
import { exportToExcel } from '../../utils/exportToExcel';
import { fetchFuel, deleteFuel } from '../../services/fuelService';
import { LoadingSpinner } from '../LoadingSpinner';

interface FuelTableProps {
  onEdit: (record: FuelRecord) => void;
  onRefresh: () => void;
}

export function FuelTable({ onEdit, onRefresh }: FuelTableProps) {
  const [data, setData] = useState<FuelRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ field: keyof FuelRecord; order: 'asc' | 'desc' }>({
    field: 'date',
    order: 'desc',
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadFuelRecords();
  }, []);

  const loadFuelRecords = async () => {
    try {
      setIsLoading(true);
      const records = await fetchFuel();
      setData(records);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load fuel records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteFuel(id);
      await loadFuelRecords();
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete record');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: keyof FuelRecord) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (field: keyof FuelRecord) => {
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

  const sortedData = [...filteredData].sort((a, b) => {
    const field = sortConfig.field;
    const order = sortConfig.order === 'asc' ? 1 : -1;
    return a[field] > b[field] ? order : -order;
  });

  const totalCost = sortedData.reduce((sum, record) => sum + record.cost, 0);

  const handleExport = () => {
    const dataToExport = sortedData.map(record => ({
      Date: record.date,
      'Driver Name': record.driverName,
      Description: record.description,
      Cost: record.cost,
    }));

    exportToExcel(dataToExport, `fuel-records-${new Date().toISOString().split('T')[0]}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
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
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-1">
                  Date {getSortIcon('date')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Driver Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(record.date)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {record.driverName || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {record.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(record.cost)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(record)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" colSpan={3}>
                Total Cost
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600" colSpan={2}>
                {formatCurrency(totalCost)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}