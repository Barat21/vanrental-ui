import { MaintenanceRecord, MaintenanceFormData } from '../components/Maintenance/types';

export async function createMaintenance(data: MaintenanceFormData): Promise<MaintenanceRecord> {
  try {
    const response = await fetch('https://van-rental.onrender.com/api/maintenance', {
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
      throw new Error(`HTTP error! status: ${response.status}`);
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
    throw new Error('Failed to create maintenance record');
  }
}

export async function updateMaintenance(id: string, data: MaintenanceFormData): Promise<MaintenanceRecord> {
  try {
    const response = await fetch(`https://van-rental.onrender.com/api/maintenance/${id}`, {
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
      throw new Error(`HTTP error! status: ${response.status}`);
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
    throw new Error('Failed to update maintenance record');
  }
}

export async function deleteMaintenance(id: string): Promise<void> {
  try {
    const response = await fetch(`https://van-rental.onrender.com/api/maintenance/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Delete maintenance error:', error);
    throw new Error('Failed to delete maintenance record');
  }
}

export async function fetchMaintenance(): Promise<MaintenanceRecord[]> {
  try {
    const response = await fetch('https://van-rental.onrender.com/api/maintenance');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
    throw new Error('Failed to fetch maintenance records');
  }
}