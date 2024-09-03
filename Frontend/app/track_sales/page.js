'use client';
import React, { useState } from 'react';
import {
  Container, Typography, Grid, Paper, Box, TextField, Button, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { Search as SearchIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

const TrackSales = () => {
  const [sales, setSales] = useState([
    { id: 1, date: '2024-09-01', customer: 'John Doe', amount: 150, details: '2 items purchased' },
    { id: 2, date: '2024-09-02', customer: 'Jane Smith', amount: 300, details: '3 items purchased' },
    { id: 3, date: '2024-09-03', customer: 'Bob Johnson', amount: 100, details: '1 item purchased' },
  ]);

  const [filteredSales, setFilteredSales] = useState(sales);
  const [searchDate, setSearchDate] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const handleSearch = () => {
    if (searchDate) {
      // Parse the searchDate and filter sales based on the date
      const searchDateFormatted = format(parseISO(searchDate), 'yyyy-MM-dd');
      setFilteredSales(sales.filter(sale => sale.date === searchDateFormatted));
    } else {
      setFilteredSales(sales);
    }
  };

  const handleViewDetails = (sale) => {
    setSelectedSale(sale);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, mt: 4 }}>
        Track Sales
      </Typography>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          type="date"
          label="Search by Date"
          variant="outlined"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch} startIcon={<SearchIcon />}>
          Search
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{format(parseISO(sale.date), 'MM/dd/yyyy')}</TableCell>
                <TableCell>{sale.customer}</TableCell>
                <TableCell>${sale.amount}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleViewDetails(sale)} color="primary">
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Sale Details</DialogTitle>
        <DialogContent>
          {selectedSale && (
            <>
              <Typography variant="body1"><strong>Date:</strong> {format(parseISO(selectedSale.date), 'MM/dd/yyyy')}</Typography>
              <Typography variant="body1"><strong>Customer:</strong> {selectedSale.customer}</Typography>
              <Typography variant="body1"><strong>Amount:</strong> ${selectedSale.amount}</Typography>
              <Typography variant="body1"><strong>Details:</strong> {selectedSale.details}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TrackSales;

