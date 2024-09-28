// backend/index.js

const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Endpoint
app.post('/api/get-next-words', (req, res) => {
  const { correctLetters, misplacedLetters, incorrectLetters } = req.body;

  // Ensure inputs are properly formatted
  const formattedCorrectLetters = correctLetters.map(letter => letter || null);
  const formattedMisplacedLetters = misplacedLetters;
  const formattedIncorrectLetters = incorrectLetters;

  // Path to the Python script
  const pythonScriptPath = path.join(__dirname, 'wordle_ai.py');

  // Spawn a new Python process
  const pythonProcess = spawn('python', [pythonScriptPath,
    JSON.stringify(formattedCorrectLetters),
    JSON.stringify(formattedMisplacedLetters),
    JSON.stringify(formattedIncorrectLetters)
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
    try {
      const nextWords = JSON.parse(pythonOutput.trim());
      res.json({ nextWords });
    } catch (error) {
      console.error('Error parsing Python output:', error);
      res.status(500).send('Error parsing Python output');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
