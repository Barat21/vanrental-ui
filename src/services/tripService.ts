interface TripData {
  id?: number;
  fromLocation: string;
  toLocation: string;
  dateOfDelivery: string;
  wayment: number;
  numberOfBags: number;
  rentPerBag: number;
  driverName: string;
  driverRent: number;
  miscSpends: number;
  vanNo: string;
  advance: number;
}

export async function createTrip(
  tripData: Omit<TripData, 'id'>
): Promise<TripData> {
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

export async function fetchTrips(): Promise<TripData[]> {
  try {
    const response = await fetch(
      'https://van-rental.onrender.com/api/tripdata'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Inside trip service");
    console.log(response);
    return await response.json();
  } catch (error) {
    console.error('Fetch trips error:', error);
    throw new Error('Error occurred and try again after sometime.');
  }
}
