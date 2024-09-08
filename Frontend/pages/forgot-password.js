// /pages/forgot-password.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import Layout from '../components/layout'; // Adjust the import path if necessary

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Call your API to request a password reset
      const response = await axios.post('http://localhost:5000/api/forgot_password', { email });
      setMessage('A reset link has been sent to your email address.');
    } catch (error) {
      setMessage('Failed to send reset link. Please try again.');
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            maxWidth: 400,
            width: '100%',
            padding: 4,
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
            Forgot Password
          </Typography>
          <Typography variant="body2" align="center" sx={{ color: '#666', mb: 3 }}>
            Enter your email address and we'll send you a link to reset your password.
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
              sx={{ mb: 3 }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ padding: 1 }}>
              Send Reset Link
            </Button>
          </form>
          {message && (
            <Typography variant="body2" align="center" sx={{ color: '#333', mt: 3 }}>
              {message}
            </Typography>
          )}
        </Paper>
      </Box>
    </Layout>
  );
};

export default ForgotPasswordPage;

