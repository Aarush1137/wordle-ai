// backend/index.js

const express = require('express');
const app = express();
const port = 5000; // Port for the backend server
const mongoose = require('mongoose');
const uri = 'mongodb+srv://viragjain7890:UUnCz0Zwr8fhFS1Q@cluster0.euei2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
app.use(express.json());
// Replace with your actual connection string


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('MongoDB connection error:', error));

  const interactionSchema = new mongoose.Schema({
    correctLetters: [String],
    misplacedLetters: Object,
    incorrectLetters: [String],
    nextWord: String,
    timestamp: { type: Date, default: Date.now }
  });
  
  const Interaction = mongoose.model('Interaction', interactionSchema);
  
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
