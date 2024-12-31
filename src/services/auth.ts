interface LoginCredentials {
  name: string;
  password: string;
}

export async function authenticate(credentials: LoginCredentials): Promise<boolean> {
  try {
    const response = await fetch('https://van-rental.onrender.com/api/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
      mode: 'cors', // Enable CORS
    });

    console.log('Response status:', response.status);
    
    const data = await response.text();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle both JSON and plain text responses
    try {
      const jsonData = JSON.parse(data);
      return !!jsonData; // Convert to boolean
    } catch {
      return data.toLowerCase() === 'true';
    }

  } catch (error) {
    // Log the full error details
    console.error('Authentication error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error: error,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    throw error;
  }
}