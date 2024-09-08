'use client'
import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Container, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Product name must contain only letters and spaces')
    .required('Product name is required'),
  description: Yup.string()
    .required('Description is required'),
  price: Yup.number()
    .typeError('Price must be a number')
    .positive('Price must be greater than zero')
    .required('Price is required'),
  stock: Yup.number()
    .typeError('Stock must be a number')
    .integer('Stock must be an integer')
    .min(0, 'Stock cannot be negative')
    .required('Stock is required'),
});

const AddProduct = ({ onProductAdded }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (values) => {
    try {
      await axios.post('http://localhost:5000/api/add_product', values);
      setSuccess(true);
      setMessage('Product added successfully');
      onProductAdded(); // Notify parent to refresh product list
    } catch (error) {
      setSuccess(false);
      setMessage('Failed to add product');
    } finally {
      setOpen(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center', fontWeight: 700 }}>
        Add New Product
      </Typography>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Formik
          initialValues={{ name: '', description: '', price: '', stock: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <Box sx={{ mb: 3 }}>
                <Field
                  as={TextField}
                  name="name"
                  label="Product Name"
                  fullWidth
                  variant="outlined"
                  helperText={<ErrorMessage name="name" />}
                  error={Boolean(<ErrorMessage name="name" />)}
                  sx={{
                    '& .MuiFormHelperText-root': {
                      color: 'blue',
                    },
                    '& .MuiFormControl-root': {
                      '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'blue',
                      },
                    },
                  }}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Field
                  as={TextField}
                  name="description"
                  label="Description"
                  fullWidth
                  variant="outlined"
                  helperText={<ErrorMessage name="description" />}
                  error={Boolean(<ErrorMessage name="description" />)}
                  sx={{
                    '& .MuiFormHelperText-root': {
                      color: 'blue',
                    },
                    '& .MuiFormControl-root': {
                      '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'blue',
                      },
                    },
                  }}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Field
                  as={TextField}
                  name="price"
                  label="Price"
                  type="number"
                  fullWidth
                  variant="outlined"
                  helperText={<ErrorMessage name="price" />}
                  error={Boolean(<ErrorMessage name="price" />)}
                  sx={{
                    '& .MuiFormHelperText-root': {
                      color: 'blue',
                    },
                    '& .MuiFormControl-root': {
                      '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'blue',
                      },
                    },
                  }}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Field
                  as={TextField}
                  name="stock"
                  label="Stock"
                  type="number"
                  fullWidth
                  variant="outlined"
                  helperText={<ErrorMessage name="stock" />}
                  error={Boolean(<ErrorMessage name="stock" />)}
                  sx={{
                    '& .MuiFormHelperText-root': {
                      color: 'blue',
                    },
                    '& .MuiFormControl-root': {
                      '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'blue',
                      },
                    },
                  }}
                />
              </Box>
              <Button type="submit" variant="contained" color="primary">
                Add Product
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>

      {/* Modal Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{success ? 'Success' : 'Error'}</DialogTitle>
        <DialogContent>
          <Typography>{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddProduct;



