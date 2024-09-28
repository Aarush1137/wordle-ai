// frontend/src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';

const LetterInput = styled(TextField)(({ theme }) => ({
  width: '50px',
  marginRight: '5px',
  '& input': {
    textTransform: 'uppercase',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
  },
}));

function App() {
  const [correctLetters, setCorrectLetters] = useState(['', '', '', '', '']);
  const [misplacedLetters, setMisplacedLetters] = useState({});
  const [incorrectLetters, setIncorrectLetters] = useState('');
  const [nextWords, setNextWords] = useState([]);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for the backend
    const data = {
      correctLetters: correctLetters.map((letter) => letter || null),
      misplacedLetters,
      incorrectLetters: incorrectLetters.split('').filter((letter) => letter),
    };

    try {
      const response = await axios.post('http://localhost:5000/api/get-next-words', data);
      setNextWords(response.data.nextWords);
      setError('');
    } catch (error) {
      console.error('There was an error!', error);
      setError('An error occurred while fetching the next words.');
    }
  };

  // Functions to update the letter arrays
  const updateCorrectLetters = (index, value) => {
    const newCorrectLetters = [...correctLetters];
    const letter = value.toLowerCase();

    // Remove the letter from incorrect letters if present
    if (incorrectLetters.includes(letter)) {
      setIncorrectLetters((prev) => prev.replace(new RegExp(letter, 'g'), ''));
    }

    newCorrectLetters[index] = letter;
    setCorrectLetters(newCorrectLetters);
    setValidationError('');
  };

  const updateMisplacedLetters = (index, value) => {
    const newMisplacedLetters = { ...misplacedLetters };
    const letter = value.toLowerCase();

    if (letter) {
      // Remove the letter from incorrect letters if present
      if (incorrectLetters.includes(letter)) {
        setIncorrectLetters((prev) => prev.replace(new RegExp(letter, 'g'), ''));
      }

      newMisplacedLetters[index] = letter;
    } else {
      delete newMisplacedLetters[index];
    }
    setMisplacedLetters(newMisplacedLetters);
    setValidationError('');
  };

  const handleIncorrectLettersChange = (e) => {
    const input = e.target.value.toLowerCase().replace(/[^a-z]/g, '');

    // Check for letters that are already in correct or misplaced letters
    const allUsedLetters = [
      ...correctLetters.filter((letter) => letter),
      ...Object.values(misplacedLetters),
    ];

    const duplicateLetters = allUsedLetters.filter((letter) => input.includes(letter));

    if (duplicateLetters.length > 0) {
      setValidationError(
        `The letter(s) "${duplicateLetters.join(', ').toUpperCase()}" cannot be in Incorrect Letters because they are already in Correct or Misplaced Letters.`
      );
      // Remove duplicate letters from the input
      const filteredInput = input
        .split('')
        .filter((letter) => !duplicateLetters.includes(letter))
        .join('');
      setIncorrectLetters(filteredInput);
    } else {
      setIncorrectLetters(input);
      setValidationError('');
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: '40px' }}>
      <Paper elevation={3} sx={{ padding: '30px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Wordle AI Assistant
        </Typography>

        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Enter Feedback:
          </Typography>

          <Box sx={{ marginBottom: '20px' }}>
            <Typography variant="subtitle1">Correct Letters (Green):</Typography>
            <Grid container spacing={1}>
              {[0, 1, 2, 3, 4].map((index) => (
                <Grid item key={`correct-${index}`}>
                  <LetterInput
                    variant="outlined"
                    inputProps={{ maxLength: 1 }}
                    value={correctLetters[index]}
                    onChange={(e) => updateCorrectLetters(index, e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#6aaa64',
                        color: '#fff',
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ marginBottom: '20px' }}>
            <Typography variant="subtitle1">Misplaced Letters (Yellow):</Typography>
            <Grid container spacing={1}>
              {[0, 1, 2, 3, 4].map((index) => (
                <Grid item key={`misplaced-${index}`}>
                  <LetterInput
                    variant="outlined"
                    inputProps={{ maxLength: 1 }}
                    value={misplacedLetters[index] || ''}
                    onChange={(e) => updateMisplacedLetters(index, e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#c9b458',
                        color: '#fff',
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ marginBottom: '20px' }}>
            <Typography variant="subtitle1">Incorrect Letters (Gray):</Typography>
            <TextField
              variant="outlined"
              placeholder="Enter letters without spaces"
              value={incorrectLetters.toUpperCase()}
              onChange={handleIncorrectLettersChange}
              inputProps={{ style: { textTransform: 'uppercase' } }}
              fullWidth
            />
          </Box>

          {validationError && (
            <Alert severity="error" sx={{ marginBottom: '20px' }}>
              {validationError}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={!!validationError}
          >
            Get Next Words
          </Button>
        </form>

        {nextWords.length > 0 && (
          <Box sx={{ marginTop: '30px' }}>
            <Typography variant="h6">Next Suggested Words:</Typography>
            <List>
              {nextWords.map((word, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={word.toUpperCase()}
                    primaryTypographyProps={{ fontSize: '18px', fontWeight: 'bold' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ marginTop: '20px' }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Container>
  );
}

export default App;
