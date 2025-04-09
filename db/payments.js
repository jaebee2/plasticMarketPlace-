// db/payments.js
const Datastore = require('nedb');
const paymentsDB = new Datastore({ filename: './db/payments.db', autoload: true });

module.exports = paymentsDB;
