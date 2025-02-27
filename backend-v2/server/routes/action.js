import sse from '../sse.js';
import express from "express";
import cache from "../../databank/cache.js";

import devices from "../../databank/devices.js";
import { identityModel, accountModel, itemModel, transactionEntryModel } from "../../databank/models.js";
import { comparePassword, generateToken, verifyToken } from "../../helpers/authorization.js";

const router = express.Router();

router.post("/perform-transaction/:seller/:buyer", async (req, res) => {
    const sellerID = req.params.seller;
    const buyerID = req.params.buyer;

    const seller = await accountModel.findById(sellerID);
    const buyer = await identityModel.findById(buyerID);

    if (!buyer || !seller){
        return res.status(404).json({});
    }

    let total = 0;
    const items = await itemModel.find({});
    const inventoryChanges = await Promise.all(
        items.map(async (serverItem, index) => {
            const before = req.body.inventoryBefore[index] || {reference: serverItem?.reference, quantity: 0};
            const after = req.body.inventoryAfter[index] || {reference: serverItem?.reference, quantity: 0};

            const difference = after.quantity - before.quantity;
            total += Math.max(0, difference) * serverItem?.price;
    
            serverItem.totalQuantitySold += Math.max(0, difference);
            serverItem.totalQuantityFetched += Math.abs(Math.min(0, difference))
    
            await serverItem.save();
    
            return {
                reference: serverItem._id,
                quantity: difference,
            };
        })
    );

    let transaction = new transactionEntryModel({
        buyer: buyerID,
        seller: sellerID,

        inventoryChanges: inventoryChanges,

        totalPrice: Number(total) || 0,

        timestamp: Date.now(),
    });
    await transaction.save();

    console.log(inventoryChanges);

    buyer.currentInventory = req.body.inventoryAfter;
    buyer.transactions.push({reference: transaction._id});

    buyer.markModified("currentInventory");

    await buyer.save();

    await cache.reloadAllModels();
    return res.status(200).json({});
});

router.post("/perform-payout/:seller/:buyer", async (req, res) => {
    const sellerID = req.params.seller;
    const buyerID = req.params.buyer;

    const seller = await accountModel.findById(sellerID);
    const buyer = await identityModel.findById(buyerID);

    if (!buyer || !seller){
        return res.status(404).json({});
    }

    const items = await itemModel.find({});

    items.forEach(async (serverItem, index) => {
        serverItem.totalQuantitySold -= Math.max(0, (buyer.currentInventory[index]?.quantity || 0 - buyer.startInventory[index]?.quantity || 0));
        await serverItem.save();
    });

    buyer.currentInventory = [];
    buyer.transactions = [];
    buyer.markModified("currentInventory");

    await buyer.save();

    await cache.reloadAllModels();
    return res.status(200).json({});
});


router.post("/request-help", async (req, res) => {
    sse.notify("help", req.body);

    return res.status(200).json({});
})


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