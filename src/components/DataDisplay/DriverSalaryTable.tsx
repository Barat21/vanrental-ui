import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Edit, Trash2 } from 'lucide-react';
import { DeliveryRecord, SortConfig } from './types';
import { formatDate, formatCurrency } from '../../utils/formatters';

interface DriverSalaryTableProps {
  data: DeliveryRecord[];
  sortConfig: SortConfig;
  onSort: (field: keyof DeliveryRecord) => void;
  onEdit: (record: DeliveryRecord) => void;
  onDelete: (id: string) => void;
}

export function DriverSalaryTable({
  data,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
}: DriverSalaryTableProps) {
  const [driverSearch, setDriverSearch] = React.useState('');

  const filteredData = data.filter((record) =>
    record.driverName.toLowerCase().includes(driverSearch.toLowerCase())
  );

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
          {/* ... table header remains the same ... */}
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((record) => {
              const rowTotal =
                record.driverRent + record.miscSpends - (record.advance || 0);

              return (
                <tr key={record.id} className="hover:bg-gray-50">
                  {/* ... other cells remain the same ... */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(record)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this record?')) {
                            onDelete(record.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* ... table footer remains the same ... */}
        </table>
      </div>
    </div>
  );