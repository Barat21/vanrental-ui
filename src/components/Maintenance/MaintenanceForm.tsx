import React, { useState } from 'react';
import { Wrench, Calendar, FileText, DollarSign, Truck, User, CreditCard } from 'lucide-react';
import { FormInput } from '../DeliveryForm/FormInput';
import { MaintenanceFormData, MaintenanceRecord } from './types';
import { createMaintenance, updateMaintenance } from '../../services/maintenanceService';

interface MaintenanceFormProps {
  onSubmit: () => void;
  initialData?: MaintenanceRecord;
  isEdit?: boolean;
}

export function MaintenanceForm({ onSubmit, initialData, isEdit = false }: MaintenanceFormProps) {
  const [formData, setFormData] = useState<MaintenanceFormData>(
    initialData || {
      date: '',
      description: '',
      cost: 0,
      vanNo: 'TN19AW2497',
      driverName: '',
      paidByDriver: false,
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isEdit && initialData) {
        await updateMaintenance(initialData.id, formData);
      } else {
        await createMaintenance(formData);
      }
      onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg">
            {error}
          </div>
        )}

        <FormInput
          icon={<Calendar className="h-5 w-5" />}
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          disabled={isLoading}
        />

        <FormInput
          icon={<Truck className="h-5 w-5" />}
          label="Van Number"
          name="vanNo"
          value={formData.vanNo}
          onChange={handleChange}
          disabled={isLoading}
        />

        <FormInput
          icon={<User className="h-5 w-5" />}
          label="Driver Name"
          name="driverName"
          value={formData.driverName}
          onChange={handleChange}
          disabled={isLoading}
        />

        <FormInput
          icon={<FileText className="h-5 w-5" />}
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
        />

        <FormInput
          icon={<DollarSign className="h-5 w-5" />}
          label="Cost"
          name="cost"
          type="number"
          value={formData.cost}
          onChange={handleChange}
          disabled={isLoading}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="paidByDriver"
            name="paidByDriver"
            checked={formData.paidByDriver}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="paidByDriver" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <CreditCard className="h-5 w-5 text-gray-400" />
            Paid by Driver
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : (isEdit ? 'Update Maintenance Record' : 'Add Maintenance Record')}
        </button>
      </form>
    </div>
  );
}