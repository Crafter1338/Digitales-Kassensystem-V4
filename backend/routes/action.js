import express from "express";
import streaming from "../databank/streaming.js";

import devices from "../databank/devices.js";
import { identityModel, accountModel, itemModel, transactionEntryModel } from "../databank/models.js";
import { reloadCacheForModel } from "../databank/cache.js";
import { verifyToken } from "../helpers/authorization.js";

const router = express.Router();

router.post("/performTransaction/:buyer/:seller", async (req, res) => {

});

router.get("/connect/device", (req, res) => {
    devices.add(req, res);
});

router.get("/connect/account", (req, res) => {
    streaming.subscribe(req, res);
});

export default router;