import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Avatar, Chip, Button, TextField, InputAdornment
} from '@mui/material';
import { Search, Block } from '@mui/icons-material';

const ManageStaff = () => {

  const [staffList, setStaffList] = useState([
    { id: 1, name: 'Nurse Priya', email: 'priya@staff.com', role: 'Nurse', hospital: 'MediCare Hospital', shift: 'MORNING', patients: 2, status: 'ACTIVE' },
    { id: 2, name: 'Nurse Kavitha', email: 'kavitha@staff.com', role: 'Nurse', hospital: 'MediCare Hospital', shift: 'MORNING', patients: 3, status: 'ACTIVE' },
    { id: 3, name: 'Staff Ravi', email: 'ravi@staff.com', role: 'Assistant', hospital: 'City Hospital', shift: 'EVENING', patients: 1, status: 'ACTIVE' },
    { id: 4, name: 'Nurse Sunita', email: 'sunita@staff.com', role: 'Nurse', hospital: 'Apollo Hospital', shift: 'NIGHT', patients: 0, status: 'INACTIVE' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const toggleStatus = (id) => {
    setStaffList(staffList.map(s =>
      s.id === id ? { ...s, status: s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : s
    ));
  };

  const filtered = staffList.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.hospital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const shiftColors = {
    MORNING: { bg: '#fff8e1', color: '#f57f17' },
    EVENING: { bg: '#e3f2fd', color: '#1565c0' },
    NIGHT: { bg: '#ede7f6', color: '#4527a0' }
  };

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="xl">

        <Box mb={4}>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>Manage Staff</Typography>
          <Typography color="textSecondary">View and manage all hospital staff</Typography>
        </Box>

        <TextField
          fullWidth placeholder="Search staff or hospital..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3, bgcolor: 'white', borderRadius: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: '#6a1b9a' }} /></InputAdornment> }}
        />

        <Grid container spacing={3}>
          {filtered.map(staff => {
            const shift = shiftColors[staff.shift];
            return (
              <Grid item xs={12} md={6} lg={4} key={staff.id}>
                <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0', transition: 'all 0.3s', '&:hover': { boxShadow: 4 } }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Avatar sx={{ bgcolor: '#f57f17', width: 56, height: 56, fontWeight: 'bold', fontSize: 20 }}>
                        {staff.name.charAt(0)}
                      </Avatar>
                      <Box flex={1}>
                        <Typography fontWeight="bold">{staff.name}</Typography>
                        <Typography variant="body2" color="textSecondary">{staff.role}</Typography>
                        <Typography variant="caption" color="textSecondary">{staff.hospital}</Typography>
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
                      <Chip
                        label={`${staff.shift} Shift`}
                        size="small"
                        sx={{ bgcolor: shift.bg, color: shift.color, fontWeight: 700 }}
                      />
                      <Chip
                        label={`${staff.patients} Patients`}
                        size="small"
                        sx={{ bgcolor: '#f8fafc', color: '#64748b', fontWeight: 600 }}
                      />
                    </Box>

                    <Button
                      fullWidth variant="outlined"
                      startIcon={<Block />}
                      onClick={() => toggleStatus(staff.id)}
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
      </Container>
    </Box>
  );
};

export default ManageStaff;