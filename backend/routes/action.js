import express from "express";
import streaming from "../databank/streaming.js";

import devices from "../databank/devices.js";
import { identityModel, accountModel, itemModel, transactionEntryModel } from "../databank/models.js";
import { reloadCacheForModel } from "../databank/cache.js";
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
        const account = (await accountModel.findById(verified.mongoID))._doc
        return res.status(200).json({account});
    }

    return res.status(400).json({});
});

router.get("/connect/device/:id", (req, res) => {
    devices.add(Number(req.params.id), req, res);
});

router.get("/connect/account", (req, res) => {
    streaming.subscribe(req, res);
});

export default router;