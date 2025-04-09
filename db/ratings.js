// db/ratings.js
const Datastore = require('nedb');
const ratingsDB = new Datastore({ filename: './db/ratings.db', autoload: true });

module.exports = ratingsDB;
