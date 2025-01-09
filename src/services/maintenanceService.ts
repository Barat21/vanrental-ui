import { MaintenanceRecord, MaintenanceFormData } from '../components/Maintenance/types';

const API_URL = 'https://van-rental.onrender.com/api';

export async function createMaintenance(data: MaintenanceFormData): Promise<MaintenanceRecord> {
  try {
    const response = await fetch(`${API_URL}/maintenance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vanNo: data.vanNo,
        amount: data.cost,
        description: data.description,
        date: data.date,
        driverName: data.driverName,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'Failed to create maintenance record');
    }

    const result = await response.json();
    return {
      id: result.id,
      date: result.date,
      description: result.description,
      cost: result.amount,
      vanNo: result.vanNo,
      driverName: result.driverName,
    };
  } catch (error) {
    console.error('Create maintenance error:', error);
    throw error instanceof Error ? error : new Error('Failed to create maintenance record');
  }
}

export async function updateMaintenance(id: string, data: MaintenanceFormData): Promise<MaintenanceRecord> {
  try {
    const response = await fetch(`${API_URL}/maintenance/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vanNo: data.vanNo,
        amount: data.cost,
        description: data.description,
        date: data.date,
        driverName: data.driverName,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'Failed to update maintenance record');
    }

    const result = await response.json();
    return {
      id: result.id,
      date: result.date,
      description: result.description,
      cost: result.amount,
      vanNo: result.vanNo,
      driverName: result.driverName,
    };
  } catch (error) {
    console.error('Update maintenance error:', error);
    throw error instanceof Error ? error : new Error('Failed to update maintenance record');
  }
}

export async function deleteMaintenance(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/maintenance/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'Failed to delete maintenance record');
    }
  } catch (error) {
    console.error('Delete maintenance error:', error);
    throw error instanceof Error ? error : new Error('Failed to delete maintenance record');
  }
}

export async function fetchMaintenance(): Promise<MaintenanceRecord[]> {
  try {
    const response = await fetch(`${API_URL}/maintenance`);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'Failed to fetch maintenance records');
    }

    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id,
      date: item.date,
      description: item.description,
      cost: item.amount,
      vanNo: item.vanNo,
      driverName: item.driverName,
    }));
  } catch (error) {
    console.error('Fetch maintenance error:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch maintenance records');
  }
}