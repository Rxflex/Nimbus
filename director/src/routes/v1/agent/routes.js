import { collection } from "../../../utils/database.js";

export async function GET(req, res) {
  const coll = collection('DNSZone');
  const zones = await coll.find({}).toArray();
  res.json({
    status: true,
    ...zones
  })
}