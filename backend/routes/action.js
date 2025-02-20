import express from "express";
import dataStreaming from "../databank/streaming.js";
import helpStreaming from "../databank/streaming.js";

import devices from "../databank/devices.js";
import { identityModel, accountModel, itemModel, transactionEntryModel } from "../databank/models.js";
import { reloadCacheForModel, reloadDevices } from "../databank/cache.js";
import { comparePassword, generateToken, verifyToken } from "../helpers/authorization.js";

const router = express.Router();

router.post("/performTransaction/:buyer/:seller", async (req, res) => {

});

router.post("/login", async (req, res) => {
    console.log('starting')
    const account = await accountModel.findOne({name: req.body.name}) 

    if (!account){
        return res.status(404).json({});
    }

    if (await comparePassword(req.body.password, account.password)){
        res.status(200).json({token: generateToken(account), account: account});

        return
    }

    return res.status(400).json({});
});

router.post("/validate", async (req, res) => {
    const token = req.body.token

    if (!token){
        return res.status(404).json({});
    }

    let verified = verifyToken(token)
    if (verified){
        const account = (await accountModel.findById(verified.mongoID))?._doc
        return res.status(200).json({account});
    }

    return res.status(400).json({});
});

router.post("/help", async (req, res) => {
    helpStreaming.notifySubscribers(req.body.user, req.body.message)
})

router.get("/connect/account/:type/", async (req, res) => {
    if (req.params.type == 'data') {
        dataStreaming.subscribe(req, res);
    }

    if (req.params.type == 'help') {
        helpStreaming.subscribe(req, res);
    }
});


router.post('/scan/:id', async (req, res) => {
    let device = devices.get(Number(req.params.id))

    if (!device) { return res.status(200).json({}) }

    device.setScanCardID(Number(req.body.cardID))
    device.trigger();

    if (device.mode == 0) {
        try {
            let newIdentity = new identityModel({cardID: Number(req.body.cardID)});
            await newIdentity.save();

            reloadCacheForModel(identityModel)
        } catch(e) {console.log(e)}
    }

    reloadDevices();
    return res.status(200).json({});
})

router.post('/write/:id', async (req, res) => {
    console.log(req.body)

    let device = devices.get(Number(req.params.id))

    if (!device) { return res.status(200).json({}) }

    device.setScanCardID(Number(req.body.cardID))
    console.log(device)
    device.trigger();

    reloadDevices();
    return res.status(200).json({});
})

router.get("/connect/device/:id", async (req, res) => {
    devices.add(Number(req.params.id), req, res);
});

export default router;