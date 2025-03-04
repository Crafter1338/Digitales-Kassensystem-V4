import { reloadDevices } from "./cache.js";

class Device {
    constructor (deviceID, res) {
        this.scanCardID     = null;
        this.writeCardID    = null
        this.deviceID       = deviceID;
        this.mode           = 0; // Activator, Deactivator, Writer, Reader, Distributor, Checkout
        this.entryDetection = 0; // Entry, Exit, Switch, None

        this.name;
        this.description;

        this.res = res;

        this.heartbeatInterval = null;
        this.startHeartbeat();
    }

    startHeartbeat () {
        this.stopHeartbeat();
        this.heartbeatInterval = setInterval(() => {
            this.trigger();
        }, 10000); // Send heartbeat every 30 seconds
    }

    stopHeartbeat () {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    setMode (mode) {
        this.mode = mode;
    }

    setEntryDetection (entryDetection) {
        this.entryDetection = entryDetection;
    }

    setScanCardID (cardID) {
        this.scanCardID = cardID;
    }

    setWriteCardID (cardID) {
        this.writeCardID = cardID;
    }

    lean () {
        return {
            scanCardID: this.scanCardID,
            writeCardID: this.writeCardID,

            name: this.name,
            description: this.description,

            deviceID: this.deviceID,
            mode: this.mode,
            entryDetection: this.entryDetection,
        };
    }

    trigger () {
        this.sendData(this.lean());
    }

    sendData (data) {
        this.res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
}

class Devices {
    constructor () {
        this.devices = [];
    }

    add(deviceID, req, res) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        let device = this.get(deviceID);

        if (device) {
            device.res = res;
        } else {
            device = new Device(deviceID, res);
            this.devices.push(device);
        }
    
        console.log(deviceID + ' connected')

        device.trigger();
    
        req.on('close', () => {
            console.log(deviceID + ' disconnected')
            device.stopHeartbeat();
            this.remove(deviceID);
            reloadDevices();
        });
    }

    remove (deviceID) {
        this.devices = this.devices.filter(device => device.deviceID != deviceID);
    }

    get (deviceID) {
        return this.devices.find(device => device.deviceID == deviceID) || null; 
    }

    getAll () {
        return this.devices;
    }

    getAllLeaned () {
        return this.devices.map((device) => {
            return device.lean();
        })
    }
}

const devices = new Devices();
export default devices;