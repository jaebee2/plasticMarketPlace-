const express = require('express');
const router = express.Router();
const usersDB = require('../db/users');

// Register a new user
router.post('/register', (req, res) => {
  const newUser = req.body;
  usersDB.insert(newUser, (err, doc) => {
    if (err) return res.status(500).send(err);
    res.status(201).json(doc);
  });
});

// Simple login (no tokens, just email/password check)
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  usersDB.findOne({ email, password }, (err, user) => {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(401).send('Invalid credentials');
    res.json(user);
  });
});

module.exports = router;
