import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import logger from "./utils/logger.js";
import { connectToDatabase } from "./utils/database.js";

const PORT = process.env.PORT || 3333;

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.all(/.*/, (req, res) => {
  return res.status(404).json({ message: 'Route not found' });
});

connectToDatabase().then(() => {
  logger.info('Connected to the database successfully');
  app.listen(PORT);
  logger.info(`Server is running on http://localhost:${PORT}`);
}).catch((error) => {
  logger.error('Database connection failed:', error);
  process.exit(1);
});