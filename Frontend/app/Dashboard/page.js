'use client';
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Grid, Paper, Box, Divider,
  AppBar, CssBaseline, Drawer, IconButton, List, ListItem,
  ListItemIcon, ListItemText, Toolbar, Button
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard as DashboardIcon, AddCircle, Edit, People, BarChart, Assessment, Logout
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format } from 'date-fns';
import axios from 'axios';

const drawerWidth = 240;

const StyledMainBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: { sm: `${drawerWidth}px` },
  width: '100%',
  backgroundColor: '#f5f5f5',
  color: '#333',
  position: 'relative',
}));

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  width: { sm: `calc(100% - ${drawerWidth}px)` },
  marginLeft: { sm: `${drawerWidth}px` },
  backgroundColor: '#1976d2',
  zIndex: 1201, // Ensure the AppBar is on top of the Drawer
}));

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalStock: 0,
    recentSales: [],
    lowStockItems: []
  });

  // useEffect(() => {
  //   // Fetch dashboard data
  //   const fetchData = async () => {
  //     const response = await axios.get('http://localhost:5000/api/overview');
  //     const data = await response.json();
  //     setDashboardData(data);
  //   };

  //   fetchData();
  // }, []);

  // Format date for sales chart
  const formatDate = (date) => format(new Date(date), 'MM/dd/yyyy');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem button component="a" href="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <Divider />
        <ListItem button component="a" href="/add-product">
          <ListItemIcon>
            <AddCircle />
          </ListItemIcon>
          <ListItemText primary="Add Product" />
        </ListItem>
        <ListItem button component="a" href="/update_stock">
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText primary="Update Stock" />
        </ListItem>
        <ListItem button component="a" href="/user_roles">
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText primary="User Roles" />
        </ListItem>
        <Divider />
        <ListItem button component="a" href="/track_sales">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText primary="Track Sales" />
        </ListItem>
        <ListItem button component="a" href="/generate_report">
          <ListItemIcon>
            <Assessment />
          </ListItemIcon>
          <ListItemText primary="Generate Report" />
        </ListItem>
        <Divider />
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarStyled position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            StockMaster
          </Typography>
        </Toolbar>
      </AppBarStyled>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <StyledMainBox component="main">
        <Toolbar />
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center', fontWeight: 700 }}>
            Inventory Dashboard
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Total Products</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2' }}>
                  {dashboardData.totalProducts}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Total Stock</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2' }}>
                  {dashboardData.totalStock}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Low Stock Items</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#d32f2f' }}>
                  {dashboardData.lowStockItems.length}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 700 }}>
            Recent Sales
          </Typography>
          <Box sx={{ height: 400, mb: 4 }}>
            <LineChart width="100%" height="100%" data={dashboardData.recentSales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sale_date" tickFormatter={formatDate} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total_price" stroke="#8884d8" strokeWidth={3} />
            </LineChart>
          </Box>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
            Low Stock Items
          </Typography>
          <Grid container spacing={2}>
            {dashboardData.lowStockItems.map((item) => (
              <Grid item xs={12} md={4} key={item.id}>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>{item.name}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#d32f2f' }}>
                    Stock: {item.stock}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </StyledMainBox>
    </Box>
  );
};

export default Dashboard;


