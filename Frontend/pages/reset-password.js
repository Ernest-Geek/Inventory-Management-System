// /pages/reset-password/[token].js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/reset_password/${token}`, { password });
      alert(response.data.message);
      router.push('/login'); // Redirect to login page after password reset
    } catch (error) {
      alert('Reset failed: ' + error.response.data.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', my: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reset Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="New Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Reset Password
        </Button>
      </form>
    </Box>
  );
};

export default ResetPasswordPage;
