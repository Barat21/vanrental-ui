import React, { useState } from 'react';
import { Calendar, User, DollarSign } from 'lucide-react';
import { FormInput } from '../DeliveryForm/FormInput';
import { AdvanceRecord } from './types';

interface AdvanceFormProps {
  onSubmit: (data: AdvanceRecord) => void;
}

export function AdvanceForm({ onSubmit }: AdvanceFormProps) {
  const [formData, setFormData] = useState<Omit<AdvanceRecord, 'id'>>({
    date: '',
    driverName: '',
    amount: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Date.now().toString(),
    });
    setFormData({ date: '', driverName: '', amount: 0 });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          icon={<Calendar className="h-5 w-5" />}
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
        />

        <FormInput
          icon={<User className="h-5 w-5" />}
          label="Driver Name"
          name="driverName"
          value={formData.driverName}
          onChange={handleChange}
        />

        <FormInput
          icon={<DollarSign className="h-5 w-5" />}
          label="Advance Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Advance Payment
        </button>
      </form>
    </div>
  );
}
