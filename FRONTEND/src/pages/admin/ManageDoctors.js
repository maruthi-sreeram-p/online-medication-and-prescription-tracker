import React, { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent,
  Grid, Avatar, Chip, Button, TextField, InputAdornment
} from '@mui/material';
import { Search, CheckCircle, Cancel } from '@mui/icons-material';

const ManageDoctors = () => {

  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. Ram Kumar', email: 'ram@doctor.com', specialization: 'Cardiologist', hospital: 'MediCare Hospital', patients: 24, status: 'APPROVED' },
    { id: 2, name: 'Dr. Sneha Reddy', email: 'sneha@doctor.com', specialization: 'Dermatologist', hospital: 'City Hospital', patients: 15, status: 'APPROVED' },
    { id: 3, name: 'Dr. Arjun Mehta', email: 'arjun@doctor.com', specialization: 'Neurologist', hospital: 'MediCare Hospital', patients: 0, status: 'PENDING' },
    { id: 4, name: 'Dr. Priya Singh', email: 'priya@doctor.com', specialization: 'Pediatrician', hospital: 'Apollo Hospital', patients: 0, status: 'PENDING' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleApprove = (id) => {
    setDoctors(doctors.map(d => d.id === id ? { ...d, status: 'APPROVED' } : d));
  };

  const handleReject = (id) => {
    setDoctors(doctors.map(d => d.id === id ? { ...d, status: 'REJECTED' } : d));
  };

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    if (status === 'APPROVED') return { bg: '#e8f5e9', color: '#2e7d32' };
    if (status === 'PENDING') return { bg: '#fff8e1', color: '#f57f17' };
    return { bg: '#ffebee', color: '#d32f2f' };
  };

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="xl">

        <Box mb={4}>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>
            Manage Doctors
          </Typography>
          <Typography color="textSecondary">
            Approve, reject and manage all doctors
          </Typography>
        </Box>

        {/* Stats */}
        <Grid container spacing={2} mb={4}>
          <Grid item xs={4}>
            <Card sx={{ borderRadius: 3, border: '1px solid #e8f5e9' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h4" fontWeight={900} sx={{ color: '#2e7d32' }}>
                  {doctors.filter(d => d.status === 'APPROVED').length}
                </Typography>
                <Typography variant="caption" fontWeight="bold" color="textSecondary">APPROVED</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ borderRadius: 3, border: '1px solid #fff8e1' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h4" fontWeight={900} sx={{ color: '#f57f17' }}>
                  {doctors.filter(d => d.status === 'PENDING').length}
                </Typography>
                <Typography variant="caption" fontWeight="bold" color="textSecondary">PENDING</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ borderRadius: 3, border: '1px solid #ffebee' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h4" fontWeight={900} sx={{ color: '#d32f2f' }}>
                  {doctors.filter(d => d.status === 'REJECTED').length}
                </Typography>
                <Typography variant="caption" fontWeight="bold" color="textSecondary">REJECTED</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search */}
        <TextField
          fullWidth placeholder="Search doctors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3, bgcolor: 'white', borderRadius: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: '#6a1b9a' }} /></InputAdornment> }}
        />

        {/* Doctor Cards */}
        <Grid container spacing={3}>
          {filtered.map(doctor => {
            const statusStyle = getStatusStyle(doctor.status);
            return (
              <Grid item xs={12} md={6} key={doctor.id}>
                <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0', transition: 'all 0.3s', '&:hover': { boxShadow: 4 } }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Avatar sx={{ bgcolor: '#6a1b9a', width: 56, height: 56, fontWeight: 'bold', fontSize: 20 }}>
                        {doctor.name.charAt(0)}
                      </Avatar>
                      <Box flex={1}>
                        <Typography fontWeight="bold" sx={{ color: '#1e293b' }}>{doctor.name}</Typography>
                        <Typography variant="body2" color="textSecondary">{doctor.specialization}</Typography>
                        <Typography variant="caption" color="textSecondary">{doctor.hospital}</Typography>
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
                      <Typography variant="caption" color="textSecondary">👥 {doctor.patients} Patients</Typography>
                    </Box>

                    {doctor.status === 'PENDING' && (
                      <Box display="flex" gap={1}>
                        <Button fullWidth variant="contained"
                          startIcon={<CheckCircle />}
                          onClick={() => handleApprove(doctor.id)}
                          sx={{ bgcolor: '#2e7d32', fontWeight: 700, borderRadius: 2 }}>
                          Approve
                        </Button>
                        <Button fullWidth variant="outlined" color="error"
                          startIcon={<Cancel />}
                          onClick={() => handleReject(doctor.id)}
                          sx={{ fontWeight: 700, borderRadius: 2 }}>
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
      </Container>
    </Box>
  );
};

export default ManageDoctors;