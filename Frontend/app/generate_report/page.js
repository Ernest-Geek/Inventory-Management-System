'use client';
import React, { useState } from 'react';
import {
  Container, Typography, Box, Button, TextField, Paper, MenuItem, Select, InputLabel, FormControl,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { format } from 'date-fns';
import { Save as SaveIcon, Print as PrintIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const GenerateReport = () => {
  const [reportType, setReportType] = useState('summary');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [open, setOpen] = useState(false);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    const response = await fetch(`http://localhost:5000/api/reports/generate?report_type=${reportType}&start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`);
    const data = await response.json();
    setReportData(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const downloadCSV = (data) => {
    const header = reportType === 'summary' 
      ? 'Date,Product,Amount\n' 
      : 'Date,Product,Amount,Details\n';
    const rows = data.map(row => 
      reportType === 'summary'
        ? `${format(new Date(row.date), 'MM/dd/yyyy')},${row.product_name},${row.total_price}`
        : `${format(new Date(row.date), 'MM/dd/yyyy')},${row.product_name},${row.total_price},${row.details}`
    ).join('\n');

    const csvContent = `data:text/csv;charset=utf-8,${header}${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'report.csv');
    document.body.appendChild(link); // Required for FF
    link.click();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
          <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
          <Button variant="contained" color="primary" onClick={handleGenerateReport} startIcon={<PrintIcon />}>
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
                    <TableCell>Product</TableCell>
                    <TableCell>Amount</TableCell>
                    {reportType === 'detailed' && <TableCell>Details</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{format(new Date(row.date), 'MM/dd/yyyy')}</TableCell>
                      <TableCell>{row.product_name}</TableCell>
                      <TableCell>${row.total_price}</TableCell>
                      {reportType === 'detailed' && <TableCell>{row.details}</TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Close</Button>
            <Button 
              onClick={() => downloadCSV(reportData)} 
              color="secondary" 
              startIcon={<SaveIcon />}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default GenerateReport;




