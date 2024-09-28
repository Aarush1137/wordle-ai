// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = 5000; // You can use any available port

app.use(cors());
app.use(bodyParser.json());

// Test route
app.get('/', (req, res) => {
  res.send('Wordle AI Backend is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/api/getSuggestion', async (req, res) => {
    const { guessedWords } = req.body;
  
    try {
      // Call the Python AI script
      const response = await axios.post('http://localhost:5001/get_suggestion', { guessedWords });
      const suggestion = response.data.suggestion;
      res.json({ suggestion });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error getting suggestion from AI server' });
    }
  });