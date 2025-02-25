import sse from "../server/sse.js";
import cache from "./cache.js";
import { identityModel } from "./models.js";

class Device {
    constructor(deviceID, socket) {
        this.cardID         = null;
        this.deviceID       = deviceID;
        this.mode           = 0; // Activator, Deactivator, Writer, Reader, Distributor, Checkout
        this.entryDetection = 0; // Entry, Exit, Switch, None

        this.name;
        this.description;

        this.socket = socket;
    }

    setMode(mode) {
        this.mode = mode;
    }

    setEntryDetection(entryDetection) {
        this.entryDetection = entryDetection;
    }

    setScanCardID(cardID) {
        this.scanCardID = cardID;
    }

    setWriteCardID(cardID) {
        this.writeCardID = cardID;
    }

    lean() {
        return {
            scanCardID: this.scanCardID,

            name: this.name,
            description: this.description,

            deviceID: this.deviceID,
            mode: this.mode,
            entryDetection: this.entryDetection,
        };
    }

    trigger() {
        this.sendData(this.lean());
    }

    sendData(data) {
        if (this.socket) {
            try {
                this.socket.write(JSON.stringify(data) + "\n");
            } catch (err) {
                console.error(`Error sending data to ${this.deviceID}:`, err);
            }
        }
    }
}

class Devices {
    constructor() {
        this.devices = [];
    }

    add(deviceID, socket) {
        deviceID = Number(deviceID);
        let device = this.get(deviceID);

        if (device) {
            device.socket = socket;
        } else {
            device = new Device(deviceID, socket);
            this.devices.push(device);
        }

        console.log(deviceID + ' connected');

        device.trigger();
        cache.reloadDevices();

        socket.on('end', async () => {
            console.log(deviceID + ' disconnected');
            this.remove(deviceID);
            await cache.reloadDevices();
        });

        socket.on('error', async (err) => {
            console.error(deviceID + ' socket error:', err);
            this.remove(deviceID);
            await cache.reloadDevices();
        });

        socket.on('data', async (data) => {
            console.log(`Received from ${deviceID}:`, data.toString().trim());

            try {
                const parsed = JSON.parse(data.toString().trim());
                const { action, payload } = parsed;

                if (action == "scan") {
                    devices.get(deviceID)?.setScanCardID(payload.cardID);
                    await cache.reloadDevices();

                    switch (device.mode) {
                        case 0:
                            try {
                                let newIdentity = new identityModel({cardID: Number(payload.cardID)});
                                await newIdentity.save();
                            } catch {}
                            break;
                
                        case 1:
                            try {
                                await identityModel.deleteOne({cardID: Number(payload.cardID)});
                            } catch {}
                            break;
                    }

                    let identity = new identityModel({cardID: Number(payload.cardID)});

                    if (identity) {
                        if (identity.entryTimestamp == 0 || !identity.entryTimestamp) { identity.entryTimestamp = Date.now() }
                        identity.exitTimestamp = Date.now();
                    
                        switch (device.entryDetection) {
                            case 0:
                                identity.isOnSite = true;
                                break;
                            
                            case 1:
                                identity.isOnSite = false;
                                break;
                    
                            case 2:
                                identity.isOnSite = !identity.isOnSite;
                                break;
                        }
                
                        await identityModel.findByIdAndUpdate(identity._id, identity);
                    }

                    await cache.reloadCacheForModel(identityModel);
                    sse.notify("scan-uid", { deviceID, ...payload });
                }
            } catch (err) {
                console.error(`Invalid JSON from ${deviceID}:`, err);
            }
        });
    }

    remove(deviceID) {
        deviceID = Number(deviceID);
        this.devices = this.devices.filter(device => device.deviceID !== deviceID);
    }

    get(deviceID) {
        deviceID = Number(deviceID);
        return this.devices.find(device => device.deviceID === deviceID) || null;
    }

    getAll() {
        return this.devices;
    }

    getAllLeaned() {
        return this.devices.map(device => device.lean());
    }

    notify(deviceID, data) {
        deviceID = Number(deviceID);
        let device = this.get(deviceID);
        if (device) {
            device.sendData(data);
        }
    }
}

const devices = new Devices();
export default devices;