import { TripData } from '../types/trip';

export async function createTrip(tripData: Omit<TripData, 'id'>): Promise<TripData> {
  try {
    const response = await fetch(
      'https://van-rental.onrender.com/api/tripdata',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Create trip error:', error);
    throw new Error('Error occurred and try again after sometime.');
  }
}

export async function updateTrip(
  tripId: number,
  tripData: Omit<TripData, 'id'>
): Promise<TripData> {
  try {
    const response = await fetch(
      `https://van-rental.onrender.com/api/tripdata/${tripId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Update trip error:', error);
    throw new Error('Error occurred while updating. Please try again.');
  }
}

export async function deleteTrip(tripId: number): Promise<void> {
  try {
    const response = await fetch(
      `https://van-rental.onrender.com/api/tripdata/${tripId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Delete trip error:', error);
    throw new Error('Error occurred while deleting. Please try again.');
  }
}

export async function uploadTripImage(file: File, tripId: number): Promise<void> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tripId', tripId.toString());

    const response = await fetch(
      'https://van-rental.onrender.com/api/images/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
}

export async function fetchTrips(): Promise<TripData[]> {
  try {
    const response = await fetch(
      'https://van-rental.onrender.com/api/tripdata'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch trips error:', error);
    throw new Error('Error occurred and try again after sometime.');
  }
}