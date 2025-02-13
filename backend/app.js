import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import { identityModel, accountModel, itemModel, scheduleEntryModel, eventModel, logEntryModel, transactionEntryModel } from './databank/models.js';

import apiRoutes from './routes/api.js';
import actionRoutes from './routes/action.js';
import { hashPassword } from './helpers/authorization.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

async function setupBaseData() {
	if (! await accountModel.findOne({name: 'admin'})){
		let admin = new accountModel({name: 'admin', password: (await hashPassword('admin')), authority: 20});
		await admin.save();
	}

	if ( (await eventModel.find({})).length == 0){
		let event = new eventModel({});
		await event.save();
	}
}

setupBaseData()

app.use('/api', apiRoutes);
app.use('/action', actionRoutes);

app.listen(process.env.PORT, process.env.HOST, () => {
	console.log(`Server running on http://${process.env.HOST}:${process.env.PORT}`);
});