import { AdvanceRecord } from '../components/Advance/types';

export async function createAdvance(data: Omit<AdvanceRecord, 'id'>): Promise<AdvanceRecord> {
  try {
    const response = await fetch('https://van-rental.onrender.com/api/advance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        driverName: data.driverName,
        date: data.date,
        amount: data.amount,
        vanNo: '12345', // Default van number
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      id: result.id,
      date: result.date,
      driverName: result.driverName,
      amount: result.amount,
    };
  } catch (error) {
    console.error('Create advance error:', error);
    throw new Error('Failed to create advance record');
  }
}

export async function updateAdvance(id: string, data: Omit<AdvanceRecord, 'id'>): Promise<AdvanceRecord> {
  try {
    const response = await fetch(`https://van-rental.onrender.com/api/advance/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        driverName: data.driverName,
        date: data.date,
        amount: data.amount,
        vanNo: '12345',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      id: result.id,
      date: result.date,
      driverName: result.driverName,
      amount: result.amount,
    };
  } catch (error) {
    console.error('Update advance error:', error);
    throw new Error('Failed to update advance record');
  }
}

export async function deleteAdvance(id: string): Promise<void> {
  try {
    const response = await fetch(`https://van-rental.onrender.com/api/advance/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Delete advance error:', error);
    throw new Error('Failed to delete advance record');
  }
}

export async function fetchAdvance(): Promise<AdvanceRecord[]> {
  try {
    const response = await fetch('https://van-rental.onrender.com/api/advance');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id,
      date: item.date,
      driverName: item.driverName,
      amount: item.amount,
    }));
  } catch (error) {
    console.error('Fetch advance records error:', error);
    throw new Error('Failed to fetch advance records');
  }
}