import React, { useState, useEffect } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Download, ExternalLink } from 'lucide-react';
import { VendorPaymentRecord } from './types';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { DateRangeFilter } from '../DataDisplay/DateRangeFilter';
import { exportToExcel } from '../../utils/exportToExcel';
import { fetchTrips } from '../../services/tripService';
import { LoadingSpinner } from '../LoadingSpinner';

interface VendorPaymentTableProps {
  sortConfig: { field: keyof VendorPaymentRecord; order: 'asc' | 'desc' };
  onSort: (field: keyof VendorPaymentRecord) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function VendorPaymentTable({
  sortConfig,
  onSort,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: VendorPaymentTableProps) {
  const [data, setData] = useState<VendorPaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVendorPayments();
  }, []);

  const loadVendorPayments = async () => {
    try {
      setIsLoading(true);
      const trips = await fetchTrips();
      
      // Transform trip data to vendor payment records
      const vendorPayments: VendorPaymentRecord[] = trips.map(trip => ({
        id: String(trip.id),
        date: trip.dateOfDelivery,
        from: trip.fromLocation,
        to: trip.toLocation,
        numberOfBags: trip.numberOfBags,
        wayment: trip.wayment,
        rent: trip.numberOfBags * trip.rentPerBag,
        miscSpends: trip.miscSpends,
        advance: trip.advance || 0,
        imageUrl: trip.imageUrl || ''
      }));

      setData(vendorPayments);
      setError(null);
    } catch (err) {
      setError('Failed to load vendor payments. Please try again later.');
      console.error('Error loading vendor payments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSortIcon = (field: keyof VendorPaymentRecord) => {
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

  const totalRent = filteredData.reduce((sum, record) => sum + record.rent, 0);
  const totalMiscSpends = filteredData.reduce((sum, record) => sum + record.miscSpends, 0);
  const totalAdvance = filteredData.reduce((sum, record) => sum + record.advance, 0);

  const handleExport = () => {
    const dataToExport = filteredData.map(record => ({
      ID: record.id,
      Date: record.date,
      From: record.from,
      To: record.to,
      'Number of Bags': record.numberOfBags,
      Wayment: record.wayment,
      Rent: record.rent,
      'Misc Spends': record.miscSpends,
      Advance: record.advance
    }));

    exportToExcel(dataToExport, `vendor-payments-${new Date().toISOString().split('T')[0]}`);
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => onSort('date')}
              >
                <div className="flex items-center gap-1">
                  Date {getSortIcon('date')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From - To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Number of Bags
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wayment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Misc Spends
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Advance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image URL
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(record.date)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {record.from} - {record.to}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {record.numberOfBags}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {record.wayment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(record.rent)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(record.miscSpends)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(record.advance)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.imageUrl ? (
                    <a
                      href={record.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      Spends <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" colSpan={5}>
                Total Rent
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatCurrency(totalRent)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatCurrency(totalMiscSpends)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatCurrency(totalAdvance)}
              </td>
              <td></td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" colSpan={7}>
                Net Payment (Total Rent + Misc Spends - Advance)
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                {formatCurrency(totalRent + totalMiscSpends - totalAdvance)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}