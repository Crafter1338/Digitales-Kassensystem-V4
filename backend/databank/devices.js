class Device {
    constructor (deviceID, res) {
        this.currentCardID  = null;
        this.deviceID       = deviceID;
        this.mode           = 0; // Activator, Deactivator, Writer, Reader, Distributor, Checkout
        this.entryDetection = 0; // Entry, Exit, Switch, None

        //imeplement sse subscribtion to req and res setup headers

        this.res = res;
    }

    setMode (mode) {
        this.mode = mode;
    }

    setEntryDetection (entryDetection) {
        this.entryDetection = entryDetection;
    }

    lean () {
        return {
            currentCardID: this.currentCardID,
            deviceID: this.deviceID,
            mode: this.mode,
            entryDetection: this.entryDetection,
        };
    }

    trigger () {
        this.sendData(this.lean());
    }

    sendData (data) {
        this.res.send(`data: ${JSON.stringify(data)}\n\n`);
    }
}

class Devices {
    constructor () {
        this.devices = [];
    }

    add(req, res) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
    
        const deviceID = req.body.deviceID;
        let device = this.get(deviceID);

        if (device) {
            device.res = res;
        } else {
            device = new Device(deviceID, res);
            this.devices.push(device);
        }
    
        device.trigger();
    
        req.on('close', () => {
            this.remove(deviceID);
        });
    }

    remove (deviceID) {
        this.devices = this.devices.filter(device => device.deviceID !== deviceID);
    }

    get (deviceID) {
        return this.devices.find(device => device.deviceID === deviceID) || null; 
    }

    getAll () {
        return this.devices || [];
    }
}

const devices = new Devices();
export default devices;