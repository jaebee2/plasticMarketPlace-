// db/listings.js
const Datastore = require('nedb');
const listingsDB = new Datastore({ filename: './db/listings.db', autoload: true });

module.exports = listingsDB;
