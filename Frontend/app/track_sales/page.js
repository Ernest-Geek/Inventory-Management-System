'use client';
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, TextField, Button, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle, Paper
} from '@mui/material';
import { Search as SearchIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { format, parseISO, isValid } from 'date-fns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const TrackSales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sales');
      const data = await response.json();
      setSales(data);
      setFilteredSales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date && isValid(date)) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const filtered = sales.filter(sale => format(parseISO(sale.sale_date), 'yyyy-MM-dd') === formattedDate);
      setFilteredSales(filtered);
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, mt: 4 }}>
          Track Sales
        </Typography>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <DatePicker
            label="Search by Date"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
          <Button variant="contained" color="primary" onClick={() => handleDateChange(selectedDate)} startIcon={<SearchIcon />}>
            Search
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{format(parseISO(sale.sale_date), 'MM/dd/yyyy')}</TableCell>
                  <TableCell>{sale.product_name}</TableCell>
                  <TableCell>${sale.total_price.toFixed(2)}</TableCell>
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
                <Typography variant="body1"><strong>Date:</strong> {format(parseISO(selectedSale.sale_date), 'MM/dd/yyyy')}</Typography>
                <Typography variant="body1"><strong>Product:</strong> {selectedSale.product_name}</Typography>
                <Typography variant="body1"><strong>Amount:</strong> ${selectedSale.total_price.toFixed(2)}</Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default TrackSales;





