import { TripData } from '../types/trip';

const API_URL = 'https://van-rental.onrender.com/api';

export async function createTrip(tripData: Omit<TripData, 'id'>): Promise<TripData> {
  try {
    const response = await fetch(`${API_URL}/tripdata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create trip: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Create trip error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create trip. Please try again later.');
  }
}

export async function updateTrip(
  tripId: number,
  tripData: Omit<TripData, 'id'>
): Promise<TripData> {
  try {
    const response = await fetch(`${API_URL}/tripdata/${tripId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update trip: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Update trip error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update trip. Please try again later.');
  }
}

export async function deleteTrip(tripId: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/tripdata/${tripId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete trip: ${errorText}`);
    }
  } catch (error) {
    console.error('Delete trip error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to delete trip. Please try again later.');
  }
}

export async function uploadTripImage(file: File, tripId: number): Promise<void> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tripId', tripId.toString());

    const response = await fetch(`${API_URL}/images/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload image: ${errorText}`);
    }
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to upload image. Please try again later.');
  }
}

export async function fetchTrips(): Promise<TripData[]> {
  try {
    const response = await fetch(`${API_URL}/tripdata`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch trips: ${errorText}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format: expected an array of trips');
    }
    
    return data;
  } catch (error) {
    console.error('Fetch trips error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch trips. Please try again later.');
  }
}