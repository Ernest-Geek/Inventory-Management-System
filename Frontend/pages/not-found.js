// pages/not-found.js
import React from 'react';
import { Container, Typography, Box, Card, CardContent } from '@mui/material';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 700 }}>
        Access Denied
      </Typography>
      <Card sx={{
        marginBottom: theme => theme.spacing(3),
        backgroundColor: '#f44336',
        color: '#fff',
        borderRadius: theme => theme.shape.borderRadius,
        boxShadow: theme => theme.shadows ? theme.shadows[5] : '0px 4px 8px rgba(0, 0, 0, 0.2)',
      }}>
        <CardContent>
          <Typography variant="body1">
            Only admins are allowed here. Please contact your administrator if you believe this is a mistake.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default NotFoundPage;
