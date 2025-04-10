const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;
const SECRET = '';
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'marketplace',
});

// Signup endpoint
app.post('/signup', (req, res) => {
  const { name, email, password, role } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Hashing error' });

    const query = 'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, hashedPassword, role], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM Users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ id: user.user_id, role: user.role }, SECRET, { expiresIn: '7d' });
      res.json({ message: 'Login successful', token, user });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Dashboard route
app.get('/dashboard', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.query('SELECT user_id, name, email, role FROM Users WHERE user_id = ?', [userId], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: 'User not found' });

    res.json({ user: results[0] });
  });
});
