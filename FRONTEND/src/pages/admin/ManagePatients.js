import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent,
  Avatar, TextField, InputAdornment, Chip,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, CircularProgress, Alert
} from '@mui/material';
import { Search, Block } from '@mui/icons-material';
import api from '../../services/api';

const ManagePatients = () => {

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/admin/patients');
      setPatients(res.data);
    } catch (err) {
      setError('Failed to load patients.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/admin/patients/${id}/toggle-status`);
      setPatients(patients.map(p =>
        p.id === id ? { ...p, status: currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : p
      ));
    } catch (err) {
      setError('Failed to update patient status.');
    }
  };

  const filtered = patients.filter(p =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>Manage Patients</Typography>
          <Typography color="textSecondary">View and manage all registered patients</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

        <TextField
          fullWidth placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3, bgcolor: 'white', borderRadius: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: '#6a1b9a' }} /></InputAdornment> }}
        />

        <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0' }}>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell><strong>Patient</strong></TableCell>
                  <TableCell><strong>Age/Gender</strong></TableCell>
                  <TableCell><strong>Blood Group</strong></TableCell>
                  <TableCell><strong>Phone</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="textSecondary">No patients found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : filtered.map((patient) => (
                  <TableRow key={patient.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{ bgcolor: '#6a1b9a', width: 38, height: 38, fontWeight: 'bold' }}>
                          {(patient.name || 'P').charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography fontWeight="bold" sx={{ fontSize: '0.9rem' }}>{patient.name}</Typography>
                          <Typography variant="caption" color="textSecondary">{patient.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{patient.age} yrs • {patient.gender}</TableCell>
                    <TableCell>
                      <Chip
                        label={patient.bloodGroup || 'N/A'}
                        size="small"
                        sx={{ bgcolor: '#e3f2fd', color: '#0062ff', fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>{patient.phone || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={patient.status}
                        size="small"
                        sx={{
                          bgcolor: patient.status === 'ACTIVE' ? '#e8f5e9' : '#ffebee',
                          color: patient.status === 'ACTIVE' ? '#2e7d32' : '#d32f2f',
                          fontWeight: 700
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small" variant="outlined"
                        startIcon={<Block />}
                        onClick={() => toggleStatus(patient.id, patient.status)}
                        sx={{
                          borderColor: patient.status === 'ACTIVE' ? '#d32f2f' : '#2e7d32',
                          color: patient.status === 'ACTIVE' ? '#d32f2f' : '#2e7d32',
                          fontWeight: 700, borderRadius: 2
                        }}
                      >
                        {patient.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>
    </Box>
  );
};

export default ManagePatients;