class Device {
    constructor (deviceID, res) {
        this.scanCardID     = null;
        this.writeCardID    = null
        this.deviceID       = deviceID;
        this.mode           = 0; // Activator, Deactivator, Writer, Reader, Distributor, Checkout
        this.entryDetection = 0; // Entry, Exit, Switch, None

        this.res = res;
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
            scanCardID: this.currentCardID,
            writeCardID: this.writeCardID,

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
            this.remove(deviceID);
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
}

const devices = new Devices();
export default devices;