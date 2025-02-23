import sse from '../sse.js';
import express from "express";
import cache from "../../databank/cache.js";

import devices from "../../databank/devices.js";
import { identityModel, accountModel, itemModel, transactionEntryModel } from "../../databank/models.js";
import { comparePassword, generateToken, verifyToken } from "../../helpers/authorization.js";

const router = express.Router();

router.post("/performTransaction/:buyer/:seller", async (req, res) => {

});

router.post("/login", async (req, res) => {
    const account = await accountModel.findOne({name: req.body.name});

    if (!account){
        return res.status(404).json({});
    }

    if (await comparePassword(req.body.password, account.password)){
        return res.status(200).json({token: generateToken(account), account: account});
    }

    return res.status(400).json({});
});

router.post("/validate", async (req, res) => {
    const token = req.body.token;

    if (!token){
        return res.status(404).json({});
    }

    let verified = verifyToken(token);
    if (verified){
        const account = (await accountModel.findById(verified.mongoID))?._doc;
        return res.status(200).json({account});
    }

    return res.status(400).json({});
});


router.get("/connect/account", async (req, res) => {
    sse.subscribe(req, res);
});

router.post('/write-uid/:id', async (req, res) => {

})

export default router;