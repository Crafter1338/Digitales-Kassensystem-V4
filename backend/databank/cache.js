import { identityModel, accountModel, itemModel, eventModel, scheduleEntryModel, transactionEntryModel, logEntryModel } from './models.js';

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

export const initializeCache = async () => {
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

        cache.devices = devices.getAllLeaned()

        console.log("Cache initialized.");
    } catch (error) {
        console.error("Error initializing cache:", error);
    }
};

export const reloadCacheForModel = async (model) => {
    try {
        const cacheKey = modelNameToCache[model.modelName];
        if (!cacheKey) {
            console.warn(`Unknown model: ${model.modelName}, skipping cache reload.`);
            return;
        }

        cache[cacheKey] = await model.find().lean();
        console.log(`Cache updated for ${model.modelName}`);
    } catch (error) {
        console.error(`Error reloading cache for ${model.modelName}:`, error);
    }
};

export const reloadDevices = async () => {
    try {
        console.log(devices.getAllLeaned())
        cache.devices = devices.getAllLeaned()
        console.log("Cache updated for devices");
    } catch (error) {
        console.error("Error reloading cache for devices:", error);
    }
};

// Get cached data
export const getCache = () => cache;