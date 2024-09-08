// Home.js
'use client'
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Layout from '../components/layout'; // Import the Layout component

export default function Home() {
  return (
    <Layout>
      <Box
        sx={{
          textAlign: 'center',
          py: 5,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 64px)', // Adjust based on AppBar height
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            color: '#333',
            mb: 2,
          }}
        >
          Elevate Your Inventory Management Experience
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            maxWidth: 600,
            fontWeight: 400,
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
            color: '#555',
            lineHeight: 1.6,
            mb: 4,
          }}
        >
          Effortlessly manage your inventory, track movements, update stock levels, and generate comprehensive reports with ease.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" size="large" href="/register">
            Get Started
          </Button>
          <Button variant="outlined" color="secondary" size="large" href="/login">
            Login
          </Button>
        </Box>
      </Box>
    </Layout>
  );
}
