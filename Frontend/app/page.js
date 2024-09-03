'use client';
import React from 'react';
import { AppBar, Box, CssBaseline, IconButton, Toolbar, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { styled } from '@mui/system';
import { Button } from '@mui/material';

const drawerWidth = 240;

const StyledMainBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  width: '100%',
  backgroundColor: '#f5f5f5',
  color: '#333',
  position: 'relative',
}));

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#1976d2',
  zIndex: 1201, // Ensure the AppBar is on top
}));

export default function Home() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarStyled position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            StockMaster
          </Typography>
        </Toolbar>
      </AppBarStyled>
      <StyledMainBox component="main">
        <Toolbar />
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
              fontWeight: 700, // Bold weight
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, // Responsive font size
              color: '#333', // Dark text color for contrast
              mb: 2, // Margin bottom for spacing
            }}
          >
            Elevate Your Inventory Management Experience
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              maxWidth: 600,
              fontWeight: 400, // Regular weight
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }, // Responsive font size
              color: '#555', // Slightly lighter text color
              lineHeight: 1.6, // Increased line height for readability
              mb: 4, // Margin bottom for spacing
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
      </StyledMainBox>
    </Box>
  );
}
