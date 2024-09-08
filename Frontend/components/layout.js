import React from 'react';
import { Box, CssBaseline, Toolbar, Typography } from '@mui/material';
import { AppBarStyled, StyledMainBox } from './styles'; // Import your styled components

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarStyled position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            StockMaster
          </Typography>
        </Toolbar>
      </AppBarStyled>
      <StyledMainBox component="main">
        <Toolbar />
        {children}
      </StyledMainBox>
    </Box>
  );
};

export default Layout;
