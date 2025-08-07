import { MongoClient } from 'mongodb';
import logger from './logger.js';
const client = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017');
let db;

const requiredCollections = [
  'DNSZone',
  'Agent',
  'Route',
  'Auth'
];


export function isConnected() {
  if (!db) throw new Error('Database not connected. Call connectToDatabase() first.');
}

export async function connectToDatabase() {
  if (!db) {
    try {
      await client.connect();
      db = client.db('nimbus');
      await checkCollections();
    } catch (error) {
      throw error;
    }
  }
  return db;
}

export function collection(name) {
  isConnected();
  return db.collection(name);
}

export async function checkCollections() {
  isConnected();
  const colls = await db.listCollections({}, { nameOnly: true }).toArray();
  const existingColls = colls.map(c => c.name);
  const missingColls = requiredCollections.filter(c => !existingColls.includes(c));
  if (missingColls.length > 0) {
    logger.warn(`Creating missing collections: ${missingColls.join(', ')}`);
    await Promise.all(missingColls.map(c => db.createCollection(c)));
  }
}
