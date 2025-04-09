// db/users.js
const Datastore = require('nedb');
const usersDB = new Datastore({ filename: './db/users.db', autoload: true });

module.exports = usersDB;
