import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Link, Slide, Snackbar, Alert, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useRouter } from 'next/router';
import Layout from '../components/layout'; // Adjust the import path if necessary

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      setSnackbarMessage('Logged in successfully!');
      setOpenSnackbar(true);
      setTimeout(() => router.push('/Dashboard'), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      setSnackbarMessage('Login failed. Please try again.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
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
            Welcome to StockMaster
          </Typography>
          <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4, color: '#555' }}>
            Please log in to continue
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
            <Box sx={{ position: 'relative', mb: 3 }}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={toggleShowPassword}
                      edge="end"
                      sx={{ position: 'absolute', right: 0, top: 0, padding: '14px' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                padding: '12px',
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              Login
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link
                href="/forgot-password"
                variant="body2"
                sx={{ color: '#1976d2', textDecoration: 'none' }}
              >
                Forgot Password?
              </Link>
            </Box>
          </form>
          <Slide direction="down" in={openSnackbar} mountOnEnter unmountOnExit>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
            >
              <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Slide>
        </Paper>
      </Box>
    </Layout>
  );
};

export default LoginPage;






