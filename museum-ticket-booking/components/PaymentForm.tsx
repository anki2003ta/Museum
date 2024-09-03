import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Button from '@/components/ui/button';

interface PaymentFormProps {
  totalPrice: number;
  onPaymentSuccess: () => void;
}

export default function PaymentForm({ totalPrice, onPaymentSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage('');

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setErrorMessage('Card details not found.');
      setIsProcessing(false);
      return;
    }

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed.');
        setIsProcessing(false);
        return;
      }

      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: paymentMethod?.id,
          totalAmount: totalPrice,
          // Additional booking details here
        }),
      });

      if (!response.ok) {
        throw new Error('Payment could not be processed');
      }

      onPaymentSuccess();
    } catch (error) {
      setErrorMessage(error.message || 'Payment processing failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
      <CardElement className="border p-2 rounded-lg" />
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      <Button
        type="submit"
        disabled={isProcessing || !stripe}
        className="bg-[#8b7d6b] hover:bg-[#7a6c5b] mt-4 px-4 py-2 rounded-lg"
      >
        {isProcessing ? 'Processing...' : `Pay Rs.${totalPrice}`}
      </Button>
    </form>
  );
}
