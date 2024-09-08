'use client'
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button, Paper, Grid, MenuItem, Select, FormControl, InputLabel,
  Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import axios from 'axios';

const UpdateStock = ({ onStockUpdated }) => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [stock, setStock] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/products/${selectedProductId}/update_stock`,
        { stock: parseInt(stock, 10) },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        setModalMessage('Stock updated successfully');
        setOpenModal(true);
        setStock('');
        if (onStockUpdated) {
          onStockUpdated();  // Notify parent component
        }
      } else {
        setModalMessage('Failed to update stock');
        setOpenModal(true);
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      setModalMessage('Failed to update stock');
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 700 }}>
        Update Stock
      </Typography>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="body1" align="center" color="textSecondary" gutterBottom sx={{ mb: 4 }}>
          Please select the product and enter the new stock level.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" margin="normal" required>
                <InputLabel>Product</InputLabel>
                <Select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  label="Product"
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="New Stock Level"
                type="number"
                fullWidth
                variant="outlined"
                margin="normal"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
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
                Update Stock
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Update Stock</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {modalMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UpdateStock;






