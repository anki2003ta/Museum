export async function sendBookingData(bookingDetails: any) {
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingDetails),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save booking data');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  