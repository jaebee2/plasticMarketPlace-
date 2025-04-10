const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;
const SECRET = "";
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "marketplace",
});

// Signup endpoint
app.post("/signup", (req, res) => {
  const { name, email, password, role } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: "Hashing error" });

    const query =
      "INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(query, [name, email, hashedPassword, role], (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.status(201).json({ message: "User registered successfully" });
    });
  });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM Users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch)
        return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user.user_id, role: user.role }, SECRET, {
        expiresIn: "7d",
      });
      res.json({ message: "Login successful", token, user });
    });
  });
});

let listings = [
  {
    listing_id: 1,
    owner_id: 101,
    title: "paper waste",
    description: "2 bundles of paper waste",
    price: 1500,
    availability: true,
  },
  {
    listing_id: 2,
    owner_id: 102,
    title: "nylon waste",
    description: "10 packs of nylon waste",
    price: 4000,
    availability: false,
  },
];

// GET all listings
app.get("/api/listings", (req, res) => {
  res.json(listings);
});

// GET a specific listing by ID
app.get("/api/listings/:id", (req, res) => {
  const listing = listings.find(
    (l) => l.listing_id === parseInt(req.params.id)
  );
  if (!listing) return res.status(404).send("Listing not found");
  res.json(listing);
});

// POST a new listing
app.post("/api/listings", (req, res) => {
  const newListing = {
    listing_id: listings.length + 1,
    owner_id: req.body.owner_id,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    availability: req.body.availability || true,
  };

  listings.push(newListing);
  res.status(201).json(newListing);
});

// PUT (update) an existing listing
app.put("/api/listings/:id", (req, res) => {
  const listing = listings.find(
    (l) => l.listing_id === parseInt(req.params.id)
  );
  if (!listing) return res.status(404).send("Listing not found");

  listing.owner_id = req.body.owner_id || listing.owner_id;
  listing.title = req.body.title || listing.title;
  listing.description = req.body.description || listing.description;
  listing.price = req.body.price || listing.price;
  listing.availability =
    req.body.availability !== undefined
      ? req.body.availability
      : listing.availability;

  res.json(listing);
});

// DELETE a listing
app.delete("/api/listings/:id", (req, res) => {
  const listingIndex = listings.findIndex(
    (l) => l.listing_id === parseInt(req.params.id)
  );
  if (listingIndex === -1) return res.status(404).send("Listing not found");

  const deletedListing = listings.splice(listingIndex, 1);
  res.json(deletedListing);
});

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Dashboard route
app.get("/dashboard", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT user_id, name, email, role FROM Users WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err || results.length === 0)
        return res.status(404).json({ error: "User not found" });

      res.json({ user: results[0] });
    }
  );
});
