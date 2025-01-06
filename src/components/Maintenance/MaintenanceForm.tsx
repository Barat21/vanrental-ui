import React, { useState } from 'react';
import { Wrench, Calendar, FileText, DollarSign, Truck, User } from 'lucide-react';
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
      vanNo: 'VAN001',
      driverName: '',
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
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
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