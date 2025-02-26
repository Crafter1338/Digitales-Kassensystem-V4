import { identityModel, accountModel, itemModel, eventModel, scheduleEntryModel, transactionEntryModel, logEntryModel } from './models.js';
import sse from '../server/sse.js';
import devices from './devices.js';

const cache = {
    identities: [],
    accounts: [],
    items: [],
    events: [],
    scheduleEntries: [],
    transactions: [],
    logs: [],
    devices: [],
};

const modelNameToCache = {
    Identity: 'identities',
    Account: 'accounts',
    Item: 'items',
    Event: 'events',
    ScheduleEntry: 'scheduleEntries',
    TransactionEntry: 'transactions',
    LogEntry: 'logs',
};

const reloadAllModels = async () => {
    try {
        const models = [identityModel, accountModel, itemModel, eventModel, scheduleEntryModel, transactionEntryModel, logEntryModel];

        for (const model of models) {
            const cacheKey = modelNameToCache[model.modelName];
            if (!cacheKey) {
                console.warn(`Unknown model: ${model.modelName}, skipping cache reload.`);
                continue;
            }

            cache[cacheKey] = await model.find().lean();
        }

        cache.devices = devices.getAllLeaned();
        sse.notify("cache", cache);

        console.log("Cache reloaded.");
    } catch (error) {
        console.error("Error reloading cache:", error);
    }
}

const initializeCache = async () => {
    console.log("Initializing cache...");
    
    try {
        const models = [identityModel, accountModel, itemModel, eventModel, scheduleEntryModel, transactionEntryModel, logEntryModel];

        for (const model of models) {
            const cacheKey = modelNameToCache[model.modelName];
            if (!cacheKey) {
                console.warn(`Unknown model: ${model.modelName}, skipping cache initialization.`);
                continue;
            }

            cache[cacheKey] = await model.find().lean();
        }

        cache.devices = devices.getAllLeaned();
        sse.notify("cache", cache);

        console.log("Cache initialized.");
    } catch (error) {
        console.error("Error initializing cache:", error);
    }
};

const reloadCacheForModel = async (model) => {
    try {
        const cacheKey = modelNameToCache[model.modelName];
        if (!cacheKey) {
            console.warn(`Unknown model: ${model.modelName}, skipping cache reload.`);
            return;
        }

        cache[cacheKey] = await model.find().lean();
        sse.notify("cache", cache);

        console.log(`Cache updated for ${model.modelName}`);
    } catch (error) {
        console.error(`Error reloading cache for ${model.modelName}:`, error);
    }
};

const reloadDevices = async () => {
    try {
        cache.devices = devices.getAllLeaned();
        sse.notify("cache", cache);

        console.log("Cache updated for devices");
    } catch (error) {
        console.error("Error reloading cache for devices:", error);
    }
};

const getCache = () => cache;

export default { getCache, reloadCacheForModel, reloadAllModels, reloadDevices, initializeCache };