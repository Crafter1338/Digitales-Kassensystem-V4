import express from 'express';
import { identityModel, accountModel, itemModel, scheduleEntryModel, eventModel, logEntryModel, transactionEntryModel }  from '../databank/models.js';

import { hashPassword, verifyToken } from "../helpers/authorization.js";
import { reloadCacheForModel, reloadDevices } from '../databank/cache.js';
import devices from '../databank/devices.js';

const router = express.Router();

const models = {
    identity: identityModel,
    account: accountModel,
    item: itemModel,
    schedule_entry: scheduleEntryModel,
    event: eventModel,
    log_entry: logEntryModel,
    transaction: transactionEntryModel
};

const verify = (req, res) => {
    const decoded = verifyToken(req.headers.authorization?.split(' ')[1]);
    if (!decoded) {
        res.status(401).json({ error: "Unauthorized" });
        return null;
    }
    return decoded;
};

const parseQuery = (query) => {
    try {
        return JSON.parse(query);
    } catch {
        return null;
    }
};

router.get('/:model/fetch', async (req, res) => {
    if (!verify(req, res)) return;

    const model = models[req.params.model.toLowerCase()];
    if (!model) return res.status(400).json({ error: "Invalid model" });

    try {
        const data = await model.find().lean();
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

router.post('/:model/new', async (req, res) => {
    if (!verify(req, res)) return;
    
    const model = models[req.params.model.toLowerCase()];
    if (!model) return res.status(400).json({ error: "Invalid model" });
    
    try {
        if (req.body.password) {
            req.body.password = await hashPassword(req.body.password);
        }

        console.log(req.body);

        const instance = new model(req.body);
        await instance.save();
        await reloadCacheForModel(model);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

router.post('/:model/update_one/:query', async (req, res) => {
    if (!verify(req, res)) return;
    
    if (req.params.model.toLowerCase() == 'devices') {
        let device = devices.get(req.params.query);

        if (device) {
            device.name = req.body.name || '';
            device.description = req.body.description || '';
            device.mode = req.body.mode || 0;
            device.entryDetection = req.body.entryDetection || 0;

            device.scanCardID = null;

            reloadDevices();
            return res.status(200).json({});
        }

        return res.status(200).json({});
    }

    const model = models[req.params.model.toLowerCase()];
    if (!model) return res.status(400).json({ error: "Invalid model" });
    
    const query = parseQuery(req.params.query);
    if (!query) return res.status(400).json({ error: "Invalid query format" });
    
    if (req.body.password) {
        req.body.password = await hashPassword(req.body.password);
    }

    try {
        await model.updateOne(query, req.body);
        await reloadCacheForModel(model);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

router.post('/:model/update_many/:query', async (req, res) => {
    if (!verify(req, res)) return;
    
    const model = models[req.params.model.toLowerCase()];
    if (!model) return res.status(400).json({ error: "Invalid model" });
    
    const query = parseQuery(req.params.query);
    if (!query) return res.status(400).json({ error: "Invalid query format" });

    if (req.body.password) {
        if (req.body.password?.length == 0) { delete req.body.password; } else {
            req.body.password = await hashPassword(req.body.password);
        }
    }

    try {
        await model.updateMany(query, req.body);
        await reloadCacheForModel(model);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

router.post('/:model/delete_one/:query', async (req, res) => {
    if (!verify(req, res)) return;
    
    const model = models[req.params.model.toLowerCase()];
    if (!model) return res.status(400).json({ error: "Invalid model" });
    
    const query = parseQuery(req.params.query);
    if (!query) return res.status(400).json({ error: "Invalid query format" });
    
    try {
        await model.deleteOne(query);
        await reloadCacheForModel(model);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

router.post('/:model/delete_many/:query', async (req, res) => {
    console.log(parseQuery(req.params.query))
    if (!verify(req, res)) return;
    
    const model = models[req.params.model.toLowerCase()];
    if (!model) return res.status(400).json({ error: "Invalid model" });
    
    const query = parseQuery(req.params.query);
    if (!query) return res.status(400).json({ error: "Invalid query format" });
    
    try {
        await model.deleteMany(query);
        await reloadCacheForModel(model);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);

        res.status(400).json({ error: error.message });
    }
});

export default router;