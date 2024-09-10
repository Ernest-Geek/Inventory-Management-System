'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, Box, Button, TextField,
  Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const UserRolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState({ id: null, name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/roles`);
      setRoles(response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      } else if (error.request) {
        console.error('Error request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
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
    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/roles/${currentRole.id}`, currentRole);
      } else {
        await axios.post(`${API_BASE_URL}/roles`, currentRole);
      }
      fetchRoles();
      setOpen(false);
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const handleEdit = (role) => {
    setCurrentRole(role);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/roles/${id}`);
      fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, mt: 4 }}>
        User Roles Management
      </Typography>
      
      <Card sx={{
        marginBottom: theme => theme.spacing(3),
        backgroundColor: '#2196f3',
        color: '#fff',
        borderRadius: theme => theme.shape.borderRadius,
        boxShadow: theme => theme.shadows ? theme.shadows[5] : '0px 4px 8px rgba(0, 0, 0, 0.2)',
      }}>
        <CardContent>

          <Typography variant="body1">
            Manage user roles within your application. Use the buttons to add, edit, or delete roles. Each role can be assigned a name and description for clarity.
          </Typography>
        </CardContent>
      </Card>
      
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

export default UserRolesPage;





