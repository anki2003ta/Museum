import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await client.connect();
      const database = client.db('musemate');
      const collection = database.collection('booking_details');
      const result = await collection.insertOne(req.body);
      res.status(200).json({ message: 'Booking details saved successfully', data: result });
    } catch (error) {
      res.status(500).json({ message: 'Error saving booking details', error });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
