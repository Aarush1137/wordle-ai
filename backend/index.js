// backend/index.js

const express = require('express');
const app = express();
const port = 5000; // Port for the backend server
const mongoose = require('mongoose');

app.use(express.json());

// Placeholder for MongoDB connection (we'll fill this in later)

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
