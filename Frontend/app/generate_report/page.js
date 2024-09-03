'use client';
import React, { useState } from 'react';
import {
  Container, Typography, Box, Button, TextField, Paper, Grid,
  MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { Save as SaveIcon, Print as PrintIcon } from '@mui/icons-material';

const GenerateReport = () => {
  const [reportType, setReportType] = useState('summary');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [open, setOpen] = useState(false);

  const handleGenerateReport = () => {
    // Placeholder data generation
    // Replace this with actual data fetching logic
    const data = [
      { id: 1, date: '2024-09-01', customer: 'John Doe', amount: 150, details: '2 items purchased' },
      { id: 2, date: '2024-09-02', customer: 'Jane Smith', amount: 300, details: '3 items purchased' },
    ];
    setReportData(data);
  };

  const handleViewReport = () => {
    handleGenerateReport();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, mt: 4 }}>
        Generate Report
      </Typography>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <FormControl sx={{ mb: 2, minWidth: 120 }}>
          <InputLabel id="report-type-label">Report Type</InputLabel>
          <Select
            labelId="report-type-label"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            label="Report Type"
          >
            <MenuItem value="summary">Summary Report</MenuItem>
            <MenuItem value="detailed">Detailed Report</MenuItem>
          </Select>
        </FormControl>
        <TextField
          type="date"
          label="Start Date"
          variant="outlined"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          type="date"
          label="End Date"
          variant="outlined"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleViewReport} startIcon={<PrintIcon />}>
          Generate Report
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Generated Report</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            {reportType === 'summary' ? 'Summary Report' : 'Detailed Report'}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  {reportType === 'detailed' && <TableCell>Details</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{format(parseISO(row.date), 'MM/dd/yyyy')}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell>${row.amount}</TableCell>
                    {reportType === 'detailed' && <TableCell>{row.details}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
          <Button onClick={handleGenerateReport} color="secondary" startIcon={<SaveIcon />}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GenerateReport;

