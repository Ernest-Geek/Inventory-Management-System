'use client'
import { styled } from '@mui/system';
import { AppBar, Box } from '@mui/material';

export const AppBarStyled = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#1976d2',
  zIndex: 1201,
}));

export const StyledMainBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  width: '100%',
  backgroundColor: '#f5f5f5',
  color: '#333',
  position: 'relative',
}));