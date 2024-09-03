// /pages/login.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      alert(response.data.message);
      router.push('/Dashboard'); // Redirect to the dashboard after login
    } catch (error) {
      alert('Login failed: ' + error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6e45e2, #88d3ce)', // Gradient background
        padding: 2,
      }}
    >
      <Paper
        elevation={6} // Slightly higher elevation for more depth
        sx={{
          maxWidth: 400,
          width: '100%',
          padding: 4,
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background
        }}
      >
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            sx={{ mb: 3 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ padding: 1 }}>
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;

