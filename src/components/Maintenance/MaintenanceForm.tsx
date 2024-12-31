import React, { useState } from 'react';
import { Wrench, Calendar, FileText, DollarSign } from 'lucide-react';
import { FormInput } from '../DeliveryForm/FormInput';
import { MaintenanceRecord } from './types';

interface MaintenanceFormProps {
  onSubmit: (data: MaintenanceRecord) => void;
}

export function MaintenanceForm({ onSubmit }: MaintenanceFormProps) {
  const [formData, setFormData] = useState<Omit<MaintenanceRecord, 'id'>>({
    date: '',
    description: '',
    cost: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Date.now().toString(),
    });
    setFormData({ date: '', description: '', cost: 0 });
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
        <FormInput
          icon={<Calendar className="h-5 w-5" />}
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
        />

        <FormInput
          icon={<FileText className="h-5 w-5" />}
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <FormInput
          icon={<DollarSign className="h-5 w-5" />}
          label="Cost"
          name="cost"
          type="number"
          value={formData.cost}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Maintenance Record
        </button>
      </form>
    </div>
  );
}