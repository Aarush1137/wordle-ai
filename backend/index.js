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

const { spawn } = require('child_process');

app.post('/api/get-next-word', (req, res) => {
  const { correctLetters, misplacedLetters, incorrectLetters } = req.body;

  // Spawn a new Python process
  const pythonProcess = spawn('python', ['./wordle_ai.py',
    JSON.stringify(correctLetters),
    JSON.stringify(misplacedLetters),
    JSON.stringify(incorrectLetters)
  ]);

  let pythonOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    pythonOutput += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).send('Error executing Python script');
    }
    res.json({ nextWord: pythonOutput.trim() });
  });
});
