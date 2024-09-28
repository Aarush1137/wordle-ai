// backend/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI; // Stored in .env file
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Mongoose Schema and Model
const interactionSchema = new mongoose.Schema({
  correctLetters: [String],
  misplacedLetters: Object,
  incorrectLetters: [String],
  nextWord: String,
  timestamp: { type: Date, default: Date.now }
});

const Interaction = mongoose.model('Interaction', interactionSchema);

// API Endpoint
app.post('/api/get-next-word', (req, res) => {
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
    const nextWord = pythonOutput.trim();

    // Save interaction to MongoDB
    const newInteraction = new Interaction({
      correctLetters: formattedCorrectLetters,
      misplacedLetters: formattedMisplacedLetters,
      incorrectLetters: formattedIncorrectLetters,
      nextWord
    });

    newInteraction.save()
      .then(() => console.log('Interaction saved'))
      .catch((error) => console.error('Error saving interaction:', error));

    res.json({ nextWord });
  });
});

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

      // Save interaction to MongoDB
      const newInteraction = new Interaction({
        correctLetters: formattedCorrectLetters,
        misplacedLetters: formattedMisplacedLetters,
        incorrectLetters: formattedIncorrectLetters,
        nextWord: nextWords[0], // Save the first suggested word for consistency
      });

      newInteraction.save()
        .then(() => console.log('Interaction saved'))
        .catch((error) => console.error('Error saving interaction:', error));

      res.json({ nextWords }); // Send the list of suggested words back to the frontend
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

