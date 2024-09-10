'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, Box, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const TrackSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sales');
        if (response.status === 200) {
          setSales(response.data);
          processChartData(response.data); // Process data for chart
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
    const intervalId = setInterval(fetchSales, 60000); // Refresh every 60 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const processChartData = (salesData) => {
    const formattedData = salesData.map(sale => ({
      date: new Date(sale.sale_date).toLocaleDateString(),
      totalPrice: sale.total_price
    }));
    setChartData(formattedData);
  };

  const filteredSales = sales.filter(sale =>
    sale.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Track Sales
      </Typography>
      <TextField
        label="Search Sales"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Sales Chart
        </Typography>
        <LineChart width={600} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalPrice" stroke="#8884d8" />
        </LineChart>
      </Box>
      <Typography variant="h6" gutterBottom>
        Sales Data
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Total Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{new Date(sale.sale_date).toLocaleDateString()}</TableCell>
                <TableCell>{sale.product_name}</TableCell>
                <TableCell>${sale.total_price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default TrackSales;











