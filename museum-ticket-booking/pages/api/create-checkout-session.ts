import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const YOUR_DOMAIN = 'http://localhost:3003'; // Update with your domain

  try {
    // Extract total amount from the request body
    const { total } = req.body;

    // Ensure total is a number and greater than 0
    if (typeof total !== 'number' || total <= 0) {
      return res.status(400).json({ error: 'Invalid total amount' });
    }

    // Convert total to cents
    const amountInCents = total * 100;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Museum Visit',
            },
            unit_amount: amountInCents, // Use cents here
          },
          quantity: 1, // Only one line item
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
