import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Avatar, Chip, Button, TextField, InputAdornment, CircularProgress, Alert
} from '@mui/material';
import { Search, Block } from '@mui/icons-material';
import api from '../../services/api';

const ManageStaff = () => {

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await api.get('/admin/staff');
      setStaffList(res.data);
    } catch (err) {
      setError('Failed to load staff.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/admin/staff/${id}/toggle-status`);
      setStaffList(staffList.map(s =>
        s.id === id ? { ...s, status: currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : s
      ));
    } catch (err) {
      setError('Failed to update staff status.');
    }
  };

  const filtered = staffList.filter(s =>
    (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.hospitalName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const shiftColors = {
    MORNING: { bg: '#fff8e1', color: '#f57f17' },
    EVENING: { bg: '#e3f2fd', color: '#1565c0' },
    NIGHT:   { bg: '#ede7f6', color: '#4527a0' }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress sx={{ color: '#6a1b9a' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="xl">

        <Box mb={4}>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>Manage Staff</Typography>
          <Typography color="textSecondary">View and manage all hospital staff</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

        <TextField
          fullWidth placeholder="Search staff or hospital..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3, bgcolor: 'white', borderRadius: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: '#6a1b9a' }} /></InputAdornment> }}
        />

        {filtered.length === 0 ? (
          <Card sx={{ borderRadius: 4, p: 6, textAlign: 'center' }}>
            <Typography color="textSecondary">No staff found.</Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filtered.map(staff => {
              const shift = shiftColors[staff.shift] || { bg: '#f8fafc', color: '#64748b' };
              return (
                <Grid item xs={12} md={6} lg={4} key={staff.id}>
                  <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0', transition: 'all 0.3s', '&:hover': { boxShadow: 4 } }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Avatar sx={{ bgcolor: '#f57f17', width: 56, height: 56, fontWeight: 'bold', fontSize: 20 }}>
                          {(staff.name || 'S').charAt(0)}
                        </Avatar>
                        <Box flex={1}>
                          <Typography fontWeight="bold">{staff.name}</Typography>
                          <Typography variant="body2" color="textSecondary">{staff.staffRole || 'Staff'}</Typography>
                          <Typography variant="caption" color="textSecondary">{staff.hospitalName || 'N/A'}</Typography>
                        </Box>
                        <Chip
                          label={staff.status}
                          size="small"
                          sx={{
                            bgcolor: staff.status === 'ACTIVE' ? '#e8f5e9' : '#ffebee',
                            color: staff.status === 'ACTIVE' ? '#2e7d32' : '#d32f2f',
                            fontWeight: 700
                          }}
                        />
                      </Box>

                      <Box display="flex" gap={1} mb={2}>
                        {staff.shift && (
                          <Chip
                            label={`${staff.shift} Shift`}
                            size="small"
                            sx={{ bgcolor: shift.bg, color: shift.color, fontWeight: 700 }}
                          />
                        )}
                        <Chip
                          label={staff.email}
                          size="small"
                          sx={{ bgcolor: '#f8fafc', color: '#64748b', fontWeight: 600 }}
                        />
                      </Box>

                      <Button
                        fullWidth variant="outlined"
                        startIcon={<Block />}
                        onClick={() => toggleStatus(staff.id, staff.status)}
                        sx={{
                          borderColor: staff.status === 'ACTIVE' ? '#d32f2f' : '#2e7d32',
                          color: staff.status === 'ACTIVE' ? '#d32f2f' : '#2e7d32',
                          fontWeight: 700, borderRadius: 2
                        }}
                      >
                        {staff.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ManageStaff;