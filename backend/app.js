import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import { identityModel, accountModel, itemModel, scheduleEntryModel, eventModel, logEntryModel, transactionEntryModel } from './databank/models.js';

import apiRoutes from './routes/api.js';
import actionRoutes from './routes/action.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function setupBaseData() {

}

setupBaseData()

app.use('/api', apiRoutes);
app.use('/action', actionRoutes);

app.listen(process.env.PORT, process.env.HOST, () => {
	console.log(`Server running on http://${process.env.HOST}:${process.env.PORT}`);
});