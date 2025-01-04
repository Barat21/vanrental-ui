import React, { useState, useCallback } from 'react';
import {
  Truck,
  Calendar,
  Package,
  User,
  DollarSign,
  Upload,
  Receipt,
} from 'lucide-react';
import { DeliveryFormData, FormErrors } from './types';
import { FormInput } from './FormInput';
import { ImageUpload } from './ImageUpload';
import { createTrip, uploadTripImage } from '../../services/tripService';
import { LoadingSpinner } from '../LoadingSpinner';

interface DeliveryFormProps {
  onSubmit: (formData: DeliveryFormData) => void;
}

const initialFormData: DeliveryFormData = {
  from: '',
  to: '',
  deliveryDate: '',
  wayment: 0,
  numberOfBags: 0,
  rentPerBag: 0,
  driverName: '',
  driverRent: 0,
  miscSpends: 0,
  image: null,
  advance: 0,
};

export function DeliveryForm({ onSubmit }: DeliveryFormProps) {
  const [formData, setFormData] = useState<DeliveryFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const calculateBags = useCallback((wayment: number) => {
    return Math.ceil(wayment / 78);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSubmitError(null);
    setSubmitSuccess(false);

    if (type === 'number') {
      const numValue = parseFloat(value) || 0;
      setFormData((prev) => {
        const newData = { ...prev, [name]: numValue };
        if (name === 'wayment') {
          newData.numberOfBags = calculateBags(numValue);
        }
        return newData;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (file: File | null) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.from) newErrors.from = 'From location is required';
    if (!formData.to) newErrors.to = 'To location is required';
    if (!formData.deliveryDate)
      newErrors.deliveryDate = 'Delivery date is required';
    if (formData.wayment <= 0)
      newErrors.wayment = 'Wayment must be greater than 0';
    if (formData.rentPerBag <= 0)
      newErrors.rentPerBag = 'Rent per bag must be greater than 0';
    if (!formData.driverName) newErrors.driverName = 'Driver name is required';
    if (formData.driverRent <= 0)
      newErrors.driverRent = 'Driver rent must be greater than 0';
    if (formData.miscSpends < 0)
      newErrors.miscSpends = 'Misc spends cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      try {
        const tripData = {
          fromLocation: formData.from,
          toLocation: formData.to,
          dateOfDelivery: formData.deliveryDate,
          wayment: formData.wayment,
          numberOfBags: formData.numberOfBags,
          rentPerBag: formData.rentPerBag,
          driverName: formData.driverName,
          driverRent: formData.driverRent,
          miscSpends: formData.miscSpends,
          vanNo: 'default', // Add default value or make it configurable
          advance: formData.advance,
        };

        // First save the trip data
        const savedTrip = await createTrip(tripData);

        // If there's an image and we have the trip ID, upload the image
        if (formData.image && savedTrip.id) {
          await uploadTripImage(formData.image, savedTrip.id);
        }

        setSubmitSuccess(true);
        onSubmit(formData);
        setFormData(initialFormData);
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : 'An error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {submitSuccess && (
          <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-4">
            Trip data saved successfully!
          </div>
        )}

        {submitError && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-4">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            icon={<Truck className="h-5 w-5" />}
            label="From"
            name="from"
            value={formData.from}
            onChange={handleChange}
            error={errors.from}
            disabled={isLoading}
          />

          <FormInput
            icon={<Truck className="h-5 w-5" />}
            label="To"
            name="to"
            value={formData.to}
            onChange={handleChange}
            error={errors.to}
            disabled={isLoading}
          />

          <FormInput
            icon={<Calendar className="h-5 w-5" />}
            label="Date of Delivery"
            name="deliveryDate"
            type="date"
            value={formData.deliveryDate}
            onChange={handleChange}
            error={errors.deliveryDate}
            disabled={isLoading}
          />

          <FormInput
            icon={<Package className="h-5 w-5" />}
            label="Wayment"
            name="wayment"
            type="number"
            value={formData.wayment}
            onChange={handleChange}
            error={errors.wayment}
            disabled={isLoading}
          />

          <FormInput
            icon={<Package className="h-5 w-5" />}
            label="Number of Bags"
            name="numberOfBags"
            type="number"
            value={formData.numberOfBags}
            onChange={handleChange}
            disabled
          />

          <FormInput
            icon={<DollarSign className="h-5 w-5" />}
            label="Rent per Bag"
            name="rentPerBag"
            type="number"
            value={formData.rentPerBag}
            onChange={handleChange}
            error={errors.rentPerBag}
            disabled={isLoading}
          />

          <FormInput
            icon={<User className="h-5 w-5" />}
            label="Driver Name"
            name="driverName"
            value={formData.driverName}
            onChange={handleChange}
            error={errors.driverName}
            disabled={isLoading}
          />

          <FormInput
            icon={<DollarSign className="h-5 w-5" />}
            label="Driver Rent"
            name="driverRent"
            type="number"
            value={formData.driverRent}
            onChange={handleChange}
            error={errors.driverRent}
            disabled={isLoading}
          />

          <FormInput
            icon={<Receipt className="h-5 w-5" />}
            label="Misc Spends"
            name="miscSpends"
            type="number"
            value={formData.miscSpends}
            onChange={handleChange}
            error={errors.miscSpends}
            disabled={isLoading}
          />

          <FormInput
            icon={<DollarSign className="h-5 w-5" />}
            label="Advance"
            name="advance"
            type="number"
            value={formData.advance}
            onChange={handleChange}
            error={errors.advance}
            disabled={isLoading}
          />
        </div>

        <ImageUpload
          onImageUpload={handleImageUpload}
          error={errors.image}
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <LoadingSpinner /> : 'Submit Delivery Details'}
        </button>
      </form>
    </div>
  );
}