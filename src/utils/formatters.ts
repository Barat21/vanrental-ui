export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return '-'; // Return placeholder for null/undefined dates
  }

  try {
    // Handle ISO date format YYYY-MM-DD
    const [year, month, day] = dateString.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '-';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};