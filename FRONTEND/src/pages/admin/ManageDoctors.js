import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent,
  Grid, Avatar, Chip, Button, TextField, InputAdornment, CircularProgress, Alert
} from '@mui/material';
import { Search, CheckCircle, Cancel } from '@mui/icons-material';
import api from '../../services/api';

const ManageDoctors = () => {

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/admin/doctors');
      setDoctors(res.data);
    } catch (err) {
      setError('Failed to load doctors.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/doctors/${id}/approve`);
      setDoctors(doctors.map(d => d.id === id ? { ...d, status: 'APPROVED' } : d));
    } catch (err) {
      setError('Failed to approve doctor.');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/admin/doctors/${id}/reject`);
      setDoctors(doctors.map(d => d.id === id ? { ...d, status: 'REJECTED' } : d));
    } catch (err) {
      setError('Failed to reject doctor.');
    }
  };

  const filtered = doctors.filter(d =>
    (d.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.specialization || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    if (status === 'APPROVED') return { bg: '#e8f5e9', color: '#2e7d32' };
    if (status === 'PENDING')  return { bg: '#fff8e1', color: '#f57f17' };
    return { bg: '#ffebee', color: '#d32f2f' };
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
          <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>Manage Doctors</Typography>
          <Typography color="textSecondary">Approve, reject and manage all doctors</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

        {/* Stats */}
        <Grid container spacing={2} mb={4}>
          {[
            { label: 'APPROVED', count: doctors.filter(d => d.status === 'APPROVED').length, color: '#2e7d32', bg: '#e8f5e9' },
            { label: 'PENDING',  count: doctors.filter(d => d.status === 'PENDING').length,  color: '#f57f17', bg: '#fff8e1' },
            { label: 'REJECTED', count: doctors.filter(d => d.status === 'REJECTED').length, color: '#d32f2f', bg: '#ffebee' },
          ].map(s => (
            <Grid item xs={4} key={s.label}>
              <Card sx={{ borderRadius: 3, border: `1px solid ${s.bg}` }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h4" fontWeight={900} sx={{ color: s.color }}>{s.count}</Typography>
                  <Typography variant="caption" fontWeight="bold" color="textSecondary">{s.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <TextField
          fullWidth placeholder="Search doctors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3, bgcolor: 'white', borderRadius: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: '#6a1b9a' }} /></InputAdornment> }}
        />

        {filtered.length === 0 ? (
          <Card sx={{ borderRadius: 4, p: 6, textAlign: 'center' }}>
            <Typography color="textSecondary">No doctors found.</Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filtered.map(doctor => {
              const statusStyle = getStatusStyle(doctor.status);
              return (
                <Grid item xs={12} md={6} key={doctor.id}>
                  <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0', transition: 'all 0.3s', '&:hover': { boxShadow: 4 } }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Avatar sx={{ bgcolor: '#6a1b9a', width: 56, height: 56, fontWeight: 'bold', fontSize: 20 }}>
                          {(doctor.name || 'D').charAt(0)}
                        </Avatar>
                        <Box flex={1}>
                          <Typography fontWeight="bold" sx={{ color: '#1e293b' }}>{doctor.name}</Typography>
                          <Typography variant="body2" color="textSecondary">{doctor.specialization}</Typography>
                          <Typography variant="caption" color="textSecondary">{doctor.hospitalName}</Typography>
                        </Box>
                        <Chip
                          label={doctor.status}
                          size="small"
                          sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 700 }}
                        />
                      </Box>

                      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, mb: 2 }}>
                        <Typography variant="caption" color="textSecondary">📧 {doctor.email}</Typography>
                        <br />
                        <Typography variant="caption" color="textSecondary">📞 {doctor.phone || 'N/A'}</Typography>
                      </Box>

                      {doctor.status === 'PENDING' && (
                        <Box display="flex" gap={1}>
                          <Button
                            fullWidth variant="contained"
                            startIcon={<CheckCircle />}
                            onClick={() => handleApprove(doctor.id)}
                            sx={{ bgcolor: '#2e7d32', fontWeight: 700, borderRadius: 2 }}
                          >
                            Approve
                          </Button>
                          <Button
                            fullWidth variant="outlined" color="error"
                            startIcon={<Cancel />}
                            onClick={() => handleReject(doctor.id)}
                            sx={{ fontWeight: 700, borderRadius: 2 }}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
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

export default ManageDoctors;