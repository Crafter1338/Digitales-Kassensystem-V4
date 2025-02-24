import mongoose from 'mongoose';
import express from 'express';
import net from 'net';

import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import { identityModel, accountModel, itemModel, scheduleEntryModel, eventModel, logEntryModel, transactionEntryModel } from './databank/models.js';

import apiRoutes from './server/routes/api.js';
import actionRoutes from './server/routes/action.js';

import { hashPassword } from './helpers/authorization.js';
import cache from './databank/cache.js';
import devices from './databank/devices.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose
.connect(process.env.MONGO_URI)
.then(() => {console.log('Connected to MongoDB')})
.catch(err => console.error('MongoDB connection error:', err));

async function setupBaseData() {
	if (! await accountModel.findOne({name: 'admin'})){
		let admin = new accountModel({name: 'admin', password: (await hashPassword('admin')), authority: 30});
		await admin.save();
	}

	if ( (await eventModel.find({})).length == 0){
		let event = new eventModel({});
		await event.save();
	}

	cache.initializeCache();
}

setupBaseData()

app.use('/api', apiRoutes);
app.use('/action', actionRoutes);

app.use(express.static('./frontend/dist'));

app.get('*', (req, res) => {
   res.sendFile('index.html', { root: './frontend/dist' });
});

app.listen(process.env.PORT, process.env.HOST, () => {
	console.log(`Server running on http://${process.env.HOST}:${process.env.PORT}`);
});

const server = net.createServer((socket) => {
    console.log("ESP8266 connected:", socket.remoteAddress);

    socket.once('data', async (data) => {
        try {
            const message = JSON.parse(data.toString().trim());

            if (!message.deviceID) {
                console.log("No deviceID provided. Closing connection.");
                socket.destroy();
                return;
            }

            const deviceID = message.deviceID;
            console.log(`Registering device: ${deviceID}`);

            devices.add(deviceID, socket);

            process.nextTick(() => {
                cache.reloadDevices().catch(err => console.error("Cache reload error:", err));
            });

        } catch (err) {
            console.error("Invalid initial JSON. Closing connection.");
            socket.destroy();
        }
    });
});

server.listen(5000, () => console.log("TCP Server running on port 5000"));
