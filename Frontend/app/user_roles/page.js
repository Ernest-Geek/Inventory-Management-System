import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, Box, Button, TextField,
  Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const UserRoles = () => {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState({ id: null, name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const response = await axios.get('/roles');
    setRoles(response.data);
  };

  const handleOpen = () => {
    setCurrentRole({ id: null, name: '', description: '' });
    setIsEditing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (isEditing) {
      await axios.put(`/roles/${currentRole.id}`, currentRole);
    } else {
      await axios.post('/roles', currentRole);
    }
    fetchRoles();
    setOpen(false);
  };

  const handleEdit = (role) => {
    setCurrentRole(role);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/roles/${id}`);
    fetchRoles();
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



