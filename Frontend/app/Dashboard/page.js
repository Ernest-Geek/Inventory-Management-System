'use client'
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Divider,
  AppBar, CssBaseline, Drawer, IconButton, List, ListItem,
  ListItemIcon, ListItemText, Toolbar, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Card, CardContent,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button
} from '@mui/material';
import {
  Menu as MenuIcon, AddCircle, Edit as EditIcon, People, BarChart, Assessment, Logout, Delete as DeleteIcon, Dashboard as DashboardIcon
} from '@mui/icons-material';
import { styled } from '@mui/system';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import AddProduct from '../add-product/page';
import UserRoles  from '../user_roles/page';
import TrackSales from '../track_sales/page';
import GenerateReport from '../generate_report/page';

const drawerWidth = 240;

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  width: { sm: `calc(100% - ${drawerWidth}px)` },
  marginLeft: { sm: `${drawerWidth}px` },
  backgroundColor: '#1976d2',
  zIndex: 1201,
}));

const StyledMainBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: { sm: `${drawerWidth}px` },
  width: '100%',
  backgroundColor: '#f5f5f5',
  color: '#333',
  position: 'relative',
}));

const WelcomingCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  backgroundColor: '#2196f3',
  color: '#fff',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows ? theme.shadows[5] : '0px 4px 8px rgba(0, 0, 0, 0.2)',
}));

const WelcomingCardContent = styled(CardContent)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
}));

const DashboardPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [openUpdateStockModal, setOpenUpdateStockModal] = useState(false);
  const [stock, setStock] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products`);
      if (response.status !== 200) throw new Error('Network response was not ok');
      const data = response.data;
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      enqueueSnackbar('Error fetching products', { variant: 'error' });
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/products/${productId}`);
      if (response.status !== 200) throw new Error('Network response was not ok');
      fetchProducts(); // Refresh the product list after deletion
      enqueueSnackbar('Product deleted successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error deleting product:', error);
      enqueueSnackbar('Error deleting product', { variant: 'error' });
    }
  };

  const handleOpenUpdateStockModal = (productId) => {
    setSelectedProductId(productId);
    setOpenUpdateStockModal(true);
  };

  const handleCloseUpdateStockModal = () => {
    setOpenUpdateStockModal(false);
    setStock('');
  };

  const handleUpdateStock = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/products/${selectedProductId}/update_stock`, { stock: parseInt(stock, 10) });
      if (response.status !== 200) throw new Error('Network response was not ok');
      fetchProducts(); // Refresh the product list after updating stock
      enqueueSnackbar('Stock updated successfully', { variant: 'success' });
      handleCloseUpdateStockModal();
    } catch (error) {
      console.error('Error updating stock:', error);
      enqueueSnackbar('Error updating stock', { variant: 'error' });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
    setMobileOpen(false); // Close the drawer on mobile after selection
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderProductActions = (productId) => (
    <>
      <IconButton onClick={() => handleOpenUpdateStockModal(productId)} color="primary">
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => handleDeleteProduct(productId)} color="error">
        <DeleteIcon />
      </IconButton>
    </>
  );

  const renderContent = () => {
    if (currentView === 'dashboard') {
      return (
        <Container maxWidth="lg">
          <WelcomingCard>
            <WelcomingCardContent>
              <Typography variant="h4" gutterBottom>
                Welcome to the Dashboard!
              </Typography>
              <Typography variant="body1">
                Here you can view and manage all your products. Use the sidebar to navigate through other sections.
              </Typography>
            </WelcomingCardContent>
          </WelcomingCard>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
            Products
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{renderProductActions(product.id)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={products.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Container>
      );
    }

    switch (currentView) {
      case 'add-Product':
        return <AddProduct onProductAdded={fetchProducts} />;
      case 'user_roles':
        return <UserRoles />;
      case 'track_sales':
        return <TrackSales />;
      case 'generate_report':
        return <GenerateReport />;
      default:
        return <Typography variant="h5">Select a section from the sidebar.</Typography>;
    }
  };

  // Define the drawer content
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem button onClick={() => handleNavigation('dashboard')}>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('add-Product')}>
          <ListItemIcon><AddCircle /></ListItemIcon>
          <ListItemText primary="Add Product" />
        </ListItem>
        {/* Removed Update Stock from the drawer */}
        <ListItem button onClick={() => handleNavigation('user_roles')}>
          <ListItemIcon><People /></ListItemIcon>
          <ListItemText primary="User Roles" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('track_sales')}>
          <ListItemIcon><BarChart /></ListItemIcon>
          <ListItemText primary="Track Sales" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('generate_report')}>
          <ListItemIcon><Assessment /></ListItemIcon>
          <ListItemText primary="Generate Report" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><Logout /></ListItemIcon>
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
        {renderContent()}
        {/* Modal for Updating Stock */}
        <Dialog open={openUpdateStockModal} onClose={handleCloseUpdateStockModal}>
          <DialogTitle>Update Stock</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Stock Quantity"
              type="number"
              fullWidth
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUpdateStockModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdateStock} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </StyledMainBox>
    </Box>
  );
};

export default DashboardPage;






















