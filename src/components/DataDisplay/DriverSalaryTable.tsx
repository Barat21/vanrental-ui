import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { DeliveryRecord, SortConfig } from './types';
import { formatDate, formatCurrency } from '../../utils/formatters';

interface DriverSalaryTableProps {
  data: DeliveryRecord[];
  sortConfig: SortConfig;
  onSort: (field: keyof DeliveryRecord) => void;
}

export function DriverSalaryTable({
  data,
  sortConfig,
  onSort,
}: DriverSalaryTableProps) {
  const [driverSearch, setDriverSearch] = React.useState('');
  console.log('Unfiltered Data');
  console.log(data);

  const filteredData = data.filter((record) =>
    record.driverName.toLowerCase().includes(driverSearch.toLowerCase())
  );

  console.log('filtered Data' + filteredData);

  const getSortIcon = (field: keyof DeliveryRecord) => {
    if (sortConfig.field !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortConfig.order === 'asc' ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const totalDriverRent = filteredData.reduce(
    (sum, record) => sum + record.driverRent,
    0
  );
  const totalMiscSpends = filteredData.reduce(
    (sum, record) => sum + record.miscSpends,
    0
  );
  const totalAdvance = filteredData.reduce(
    (sum, record) => sum + (record.advance || 0),
    0
  );
  const grandTotal = totalDriverRent + totalMiscSpends - totalAdvance;

  return (
    <div className="space-y-4">
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
                onClick={() => onSort('deliveryDate')}
              >
                <div className="flex items-center gap-1">
                  Date {getSortIcon('deliveryDate')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Driver Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From - To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Driver Rent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Misc Spends
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Advance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((record) => {
              const rowTotal =
                record.driverRent + record.miscSpends - (record.advance || 0);
              console.log('Advance for record', record.id, ':', record.advance);

              return (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(record.deliveryDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.driverName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.from} - {record.to}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(record.driverRent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(record.miscSpends)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(record.advance || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(rowTotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-50 font-medium">
            <tr>
              <td colSpan={3} className="px-6 py-4 text-sm text-gray-900">
                Totals
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {formatCurrency(totalDriverRent)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {formatCurrency(totalMiscSpends)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {formatCurrency(totalAdvance)}
              </td>
              <td className="px-6 py-4 text-sm text-blue-600">
                {formatCurrency(grandTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
