'use client';
import React, { useState } from 'react';
import {
  Container, Typography, Grid, Paper, Box, Button, TextField,
  Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const UserRoles = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin', description: 'Full access to all resources' },
    { id: 2, name: 'Manager', description: 'Can manage inventory and sales' },
    { id: 3, name: 'Staff', description: 'Can view and update stock levels' },
  ]);

  const [open, setOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState({ id: null, name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);

  const handleOpen = () => {
    setCurrentRole({ id: null, name: '', description: '' });
    setIsEditing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (isEditing) {
      setRoles(roles.map(role => role.id === currentRole.id ? currentRole : role));
    } else {
      setRoles([...roles, { ...currentRole, id: roles.length + 1 }]);
    }
    setOpen(false);
  };

  const handleEdit = (role) => {
    setCurrentRole(role);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setRoles(roles.filter(role => role.id !== id));
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, mt: 4 }}>
        User Roles Management
      </Typography>
      <Box sx={{ textAlign: 'right', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Role
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(role)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(role.id)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Edit Role' : 'Add Role'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Role Name"
            type="text"
            fullWidth
            variant="outlined"
            value={currentRole.name}
            onChange={(e) => setCurrentRole({ ...currentRole, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={currentRole.description}
            onChange={(e) => setCurrentRole({ ...currentRole, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleSave} color="primary">{isEditing ? 'Save Changes' : 'Add Role'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserRoles;

