import React, { useState } from 'react';
import { Calendar, User, DollarSign } from 'lucide-react';
import { FormInput } from '../DeliveryForm/FormInput';
import { AdvanceRecord } from './types';
import { createAdvance, updateAdvance } from '../../services/advanceService';
import { LoadingSpinner } from '../LoadingSpinner';

interface AdvanceFormProps {
  onSubmit: () => void;
  initialData?: AdvanceRecord;
  isEdit?: boolean;
}

export function AdvanceForm({ onSubmit, initialData, isEdit = false }: AdvanceFormProps) {
  const [formData, setFormData] = useState<Omit<AdvanceRecord, 'id'>>(
    initialData || {
      date: '',
      driverName: '',
      amount: 0,
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
        await updateAdvance(initialData.id, formData);
      } else {
        await createAdvance(formData);
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
          icon={<User className="h-5 w-5" />}
          label="Driver Name"
          name="driverName"
          value={formData.driverName}
          onChange={handleChange}
          disabled={isLoading}
        />

        <FormInput
          icon={<DollarSign className="h-5 w-5" />}
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? <LoadingSpinner /> : (isEdit ? 'Update Advance Payment' : 'Add Advance Payment')}
        </button>
      </form>
    </div>
  );
}