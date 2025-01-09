import { FuelRecord } from '../components/Fuel/types';

export async function createFuel(data: Omit<FuelRecord, 'id'>): Promise<FuelRecord> {
  try {
    const response = await fetch('https://van-rental.onrender.com/api/diesel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vanNo: 'VAN001', // Default van number
        amount: data.cost,
        description: data.description,
        date: data.date,
        driverName: data.driverName || 'Default Driver', // Add default driver if not provided
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      id: result.id,
      date: result.date,
      description: result.description,
      cost: result.amount,
      driverName: result.driverName,
    };
  } catch (error) {
    console.error('Create fuel record error:', error);
    throw new Error('Failed to create fuel record');
  }
}

export async function updateFuel(id: string, data: Omit<FuelRecord, 'id'>): Promise<FuelRecord> {
  try {
    const response = await fetch(`https://van-rental.onrender.com/api/diesel/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vanNo: 'VAN001',
        amount: data.cost,
        description: data.description,
        date: data.date,
        driverName: data.driverName || 'Default Driver',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      id: result.id,
      date: result.date,
      description: result.description,
      cost: result.amount,
      driverName: result.driverName,
    };
  } catch (error) {
    console.error('Update fuel record error:', error);
    throw new Error('Failed to update fuel record');
  }
}

export async function deleteFuel(id: string): Promise<void> {
  try {
    const response = await fetch(`https://van-rental.onrender.com/api/diesel/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Delete fuel record error:', error);
    throw new Error('Failed to delete fuel record');
  }
}

export async function fetchFuel(): Promise<FuelRecord[]> {
  try {
    const response = await fetch('https://van-rental.onrender.com/api/diesel');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id,
      date: item.date,
      description: item.description,
      cost: item.amount,
      driverName: item.driverName,
    }));
  } catch (error) {
    console.error('Fetch fuel records error:', error);
    throw new Error('Failed to fetch fuel records');
  }
}