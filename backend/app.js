import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import { identityModel, accountModel, itemModel, scheduleEntryModel, eventModel, logEntryModel, transactionEntryModel } from './databank/models.js';

import apiRoutes from './routes/api.js';
import actionRoutes from './routes/action.js';
import { hashPassword } from './helpers/authorization.js';
import { initializeCache } from './databank/cache.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose
.connect(process.env.MONGO_URI)
.then(() => {console.log('Connected to MongoDB'); initializeCache()})
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

app.use(express.static('./frontend/dist'));

// Handle all unmatched routes and serve the React app
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: './frontend/dist' });
});

app.listen(process.env.PORT, process.env.HOST, () => {
	console.log(`Server running on http://${process.env.HOST}:${process.env.PORT}`);
});