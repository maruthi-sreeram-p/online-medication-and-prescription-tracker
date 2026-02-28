import React, { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent,
  Avatar, TextField, InputAdornment, Chip,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button
} from '@mui/material';
import { Search, Block } from '@mui/icons-material';

const ManagePatients = () => {

  const [patients, setPatients] = useState([
    { id: 1, name: 'Namitha Ganji', email: 'namitha@gmail.com', age: 25, gender: 'Female', doctor: 'Dr. Ram Kumar', adherence: 85, status: 'ACTIVE' },
    { id: 2, name: 'Sree Ram', email: 'sreer@gmail.com', age: 28, gender: 'Male', doctor: 'Dr. Ram Kumar', adherence: 72, status: 'ACTIVE' },
    { id: 3, name: 'Pramodini', email: 'pramo@gmail.com', age: 24, gender: 'Female', doctor: 'Dr. Sneha Reddy', adherence: 90, status: 'ACTIVE' },
    { id: 4, name: 'Maruthi Sreeram', email: 'maruthi@gmail.com', age: 26, gender: 'Male', doctor: 'Dr. Ram Kumar', adherence: 65, status: 'INACTIVE' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const toggleStatus = (id) => {
    setPatients(patients.map(p =>
      p.id === id ? { ...p, status: p.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : p
    ));
  };

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAdherenceColor = (pct) => {
    if (pct >= 80) return '#2e7d32';
    if (pct >= 50) return '#f57f17';
    return '#d32f2f';
  };

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="xl">

        <Box mb={4}>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>Manage Patients</Typography>
          <Typography color="textSecondary">View and manage all registered patients</Typography>
        </Box>

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
                  <TableCell><strong>Doctor</strong></TableCell>
                  <TableCell><strong>Adherence</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((patient) => (
                  <TableRow key={patient.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{ bgcolor: '#6a1b9a', width: 38, height: 38, fontWeight: 'bold' }}>
                          {patient.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography fontWeight="bold" sx={{ fontSize: '0.9rem' }}>{patient.name}</Typography>
                          <Typography variant="caption" color="textSecondary">{patient.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{patient.age} yrs • {patient.gender}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#0062ff', fontWeight: 600 }}>{patient.doctor}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={900} sx={{ color: getAdherenceColor(patient.adherence) }}>
                        {patient.adherence}%
                      </Typography>
                    </TableCell>
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
                        onClick={() => toggleStatus(patient.id)}
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