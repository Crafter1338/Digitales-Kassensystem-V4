import mongoose from 'mongoose';

// schemas //
const identitySchema = new mongoose.Schema({
    cardID: { type: String, required: true, unique: true },
    wardrobeID: { type: String, unique: true },

    accountID: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }, // dont propagate to client

    currentInventory: [
        {
            reference: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
            quantity: { type: Number, default: 0 },
        },       
    ],
    startInventory: [ 
        {
            reference: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
            quantity: { type: Number, default: 0 },
        },       
     ],
    
    entryTimestamp: { type: Date },
    exitTimestamp: { type: Date },
    isOnSite: { type: Boolean, default: false },

    transactions: [
        {
            reference: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }, // dont propagate to client
        }
    ],

    status: { type: String },
    authority: { type: Number, required: true },
});

const accountSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    identitityID: { type: mongoose.Schema.Types.ObjectId, ref: 'Identity' }, // dont propagate to client
    authority: { type: Number, required: true },

    schedule: [
        {
            timestamp: { type: Date },
            reference: { type: mongoose.Schema.Types.ObjectId, ref: 'ScheduleEntry' },
        },
    ],
});

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },

    price: { type: Number, required: true },
    cost: { type: Number, default: 0 },

    availableQuantity: { type: Number },
    actualAvailableQuantity: { type: Number },
    availableQuantity: { type: Number },

    totalQuantitySold: { type: Number, default: 0 },
    totalQuantityFetched: { type: Number, default: 0 },
});

const eventSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },

    startTimestamp: { type: Date },
    endTimestamp: { type: Date },

    shiftAmount: { type: Number, default: 0 },
    shiftDuration: { type: Number, default: 0 },
});

const scheduleEntrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
});

const transactionEntrySchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Identity'},

    inventoryChanges: [
        {
            reference: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
            quantity: { type: Number, default: 0 },
        }
    ],

    totalPrice: { type: Number, default: 0 },

    timestamp: { type: Date },
});

const logEntrySchema = new mongoose.Schema({
    timestamp: { type: Date },
    message: { type: String },
});

// pre hooks //
identitySchema.pre('remove', async function (next) {
    const identityId = this._id;
    try {
        await mongoose.model('Account').updateMany(
            { identityID: identityId },
            { $unset: { identityID: "" } }
        );

        await mongoose.model('Transaction').deleteMany(
            { 'buyer': identityId }
        );

        // log the deletion of transactions:
        log(`Identität ${identityId} (${this.cardUID}) und alle zugehörigen Transaktionen wurden gelöscht`, identityId, true);

        next();
    } catch (error) {
        next(error);
    }
});

accountSchema.pre('remove', async function (next) {
    const accountId = this._id;
    try {
        await mongoose.model('Identity').updateMany( // wont work
            { 'transactions.seller': accountId },
            { $pull: { transactions: { seller: accountId } } }
        );

        await mongoose.model('Identity').updateMany(
            { accountID: accountId },
            { $unset: { accountID: "" } }
        );

        await mongoose.model('Transaction').deleteMany(
            { 'seller': accountId }
        );
        
        next();
    } catch (error) {
        next(error);
    }
});

itemSchema.pre('remove', async function (next) {
    const itemId = this._id;
    try {
        await mongoose.model('Identity').updateMany(
            { 'currentInventory.reference': itemId },
            { $pull: { currentInventory: { reference: itemId } } }
        );

        await mongoose.model('Identity').updateMany(
            { 'startInventory.reference': itemId },
            { $pull: { startInventory: { reference: itemId } } }
        );

        next();
    } catch (error) {
        next(error);
    }
});


scheduleEntrySchema.pre('remove', async function (next) {
    const scheduleEntryId = this._id;
    try {
        await mongoose.model('Account').updateMany(
            { 'schedule.reference': scheduleEntryId },
            { $pull: { schedule: { reference: scheduleEntryId } } }
        );

        next();
    } catch (error) {
        next(error);
    }
});


// models //
const identityModel         = mongoose.model('Identity', identitySchema);
const accountModel          = mongoose.model('Account', accountSchema);
const itemModel             = mongoose.model('Item', itemSchema);
const eventModel            = mongoose.model('Event', eventSchema);
const scheduleEntryModel    = mongoose.model('ScheduleEntry', scheduleEntrySchema);
const transactionEntryModel = mongoose.model('TransactionEntry', transactionEntrySchema);
const logEntryModel         = mongoose.model('LogEntry', logEntrySchema);

// export //
export {
    identityModel,
    accountModel,
    itemModel,
    eventModel,
    scheduleEntryModel,
    transactionEntryModel,
    logEntryModel,
};