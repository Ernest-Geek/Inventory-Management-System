'use client';
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Grid } from '@mui/material';
import axios from 'axios';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/add_product', {
        name,
        description,
        price,
        quantity: stock, // Assuming quantity maps to stock
        category
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 201) {
        alert('Product added successfully');
        // Clear form fields
        setName('');
        setDescription('');
        setPrice('');
        setStock('');
        setCategory('');
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 700 }}>
        Add New Product
      </Typography>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Product Name"
                fullWidth
                variant="outlined"
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                variant="outlined"
                margin="normal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Stock"
                type="number"
                fullWidth
                variant="outlined"
                margin="normal"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                sx={{ mb: 2 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Price"
                type="number"
                fullWidth
                variant="outlined"
                margin="normal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                sx={{ mb: 2 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Category"
                fullWidth
                variant="outlined"
                margin="normal"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Add Product
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddProduct;
