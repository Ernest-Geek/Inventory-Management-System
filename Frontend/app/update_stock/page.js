'use client'
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Grid } from '@mui/material';

const UpdateStock = () => {
  const [productId, setProductId] = useState('');
  const [stock, setStock] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.fetch(`http://localhost:5000/api/products/${productId}/update_stock`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock })
    });

    if (response.ok) {
      alert('Stock updated successfully');
    } else {
      alert('Failed to update stock');
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Paper elevation={4} style={{ padding: '2rem' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Update Stock
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
          Please enter the product ID and the new stock level.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Product ID"
                variant="outlined"
                fullWidth
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="New Stock Level"
                type="number"
                variant="outlined"
                fullWidth
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                style={{ padding: '0.75rem' }}
              >
                Update Stock
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default UpdateStock;
