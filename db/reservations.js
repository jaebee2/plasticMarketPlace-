// db/reservations.js
const Datastore = require('nedb');
const reservationsDB = new Datastore({ filename: './db/reservations.db', autoload: true });

module.exports = reservationsDB;
