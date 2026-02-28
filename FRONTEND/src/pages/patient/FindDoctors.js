import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Avatar, Button, Chip, TextField, InputAdornment,
  CircularProgress, Alert
} from '@mui/material';
import { Search, PersonAdd, CheckCircle, LocalHospital } from '@mui/icons-material';
import api from '../../services/api';

const FindDoctors = () => {

  const patientId = localStorage.getItem('userId');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [requestedDoctors, setRequestedDoctors] = useState(new Set());
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchDoctors();
    fetchAlreadySentRequests(); // ✅ load persisted requests on mount
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors/all');
      setDoctors(res.data);
    } catch (err) {
      setDoctors([]);
      setErrorMsg('Could not load doctors. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch which doctors this patient already sent requests to
  const fetchAlreadySentRequests = async () => {
    try {
      const res = await api.get(`/patients/${patientId}/requests`);
      // backend returns list of request objects, each has doctorId
      const alreadySentIds = new Set((res.data || []).map(r => r.doctorId));
      setRequestedDoctors(alreadySentIds);
    } catch (err) {
      // endpoint may not exist yet — silently ignore, state stays empty Set
    }
  };

  const handleSendRequest = async (doctorId) => {
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await api.post(`/patients/${patientId}/request/${doctorId}`);
      setRequestedDoctors(prev => new Set([...prev, doctorId]));
      setSuccessMsg('✅ Request sent! The doctor will accept it from Patient Requests page.');
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || '';
      if (msg.toLowerCase().includes('already')) {
        // Already sent — reflect in UI
        setRequestedDoctors(prev => new Set([...prev, doctorId]));
        setSuccessMsg('Request already sent to this doctor!');
      } else {
        setErrorMsg(msg || 'Failed to send request. Try again.');
      }
    }
  };

  const filtered = doctors.filter(d =>
    (d.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.specialization || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.hospitalName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getColor = (spec) => {
    const map = {
      'Cardiologist': '#e3f2fd', 'Dermatologist': '#fce4ec',
      'Neurologist': '#ede7f6', 'Orthopedic': '#e8f5e9',
      'Pediatrician': '#fff8e1', 'General': '#f3e5f5',
    };
    return map[spec] || '#f0f7ff';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress sx={{ color: '#2e7d32' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="xl">

        <Box mb={4}>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>Find Doctors</Typography>
          <Typography color="textSecondary">Browse all registered doctors and send a connection request</Typography>
        </Box>

        {successMsg && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}
        {errorMsg && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg('')}>{errorMsg}</Alert>}

        <TextField
          fullWidth
          placeholder="Search by name, specialization or hospital..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 4, bgcolor: 'white', borderRadius: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#0062ff' }} />
              </InputAdornment>
            )
          }}
        />

        {doctors.length === 0 ? (
          <Card sx={{ borderRadius: 4, boxShadow: 2, p: 6, textAlign: 'center' }}>
            <LocalHospital sx={{ fontSize: 80, color: '#e2e8f0', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" fontWeight="bold">No doctors registered yet!</Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              Ask a doctor to register at the Register page with role "Doctor".
            </Typography>
          </Card>
        ) : filtered.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Typography color="textSecondary" variant="h6">No doctors found for "{searchTerm}"</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filtered.map(doctor => {
              const isRequested = requestedDoctors.has(doctor.id);
              return (
                <Grid item xs={12} sm={6} lg={4} key={doctor.id}>
                  <Card
                    sx={{
                      borderRadius: 4,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s',
                      '&:hover': { boxShadow: '0 8px 30px rgba(0,98,255,0.12)', transform: 'translateY(-3px)' }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Chip
                          label={doctor.specialization || 'General'}
                          size="small"
                          sx={{ bgcolor: getColor(doctor.specialization), color: '#0062ff', fontWeight: 700 }}
                        />
                        <Chip label="✅ Available" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700 }} />
                      </Box>

                      <Box display="flex" alignItems="center" gap={2} mb={3}>
                        <Avatar
                          sx={{
                            bgcolor: '#0062ff', width: 64, height: 64,
                            fontSize: 24, fontWeight: 'bold',
                            boxShadow: '0 4px 12px rgba(0,98,255,0.3)'
                          }}
                        >
                          {(doctor.name || 'D').charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography fontWeight="bold" variant="h6" sx={{ color: '#1e293b' }}>{doctor.name}</Typography>
                          <Typography variant="body2" color="textSecondary">🏥 {doctor.hospitalName || 'Hospital not set'}</Typography>
                          {doctor.phone && (
                            <Typography variant="body2" sx={{ color: '#0062ff', fontWeight: 600 }}>📞 {doctor.phone}</Typography>
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, mb: 3, border: '1px solid #e2e8f0' }}>
                        <Box display="flex" justifyContent="space-around">
                          <Box textAlign="center">
                            <Typography fontWeight={900} sx={{ color: '#0062ff' }}>{doctor.specialization || 'General'}</Typography>
                            <Typography variant="caption" color="textSecondary">Specialization</Typography>
                          </Box>
                          <Box textAlign="center">
                            <Typography fontWeight={900} sx={{ color: '#2e7d32' }}>{doctor.email?.split('@')[0]}</Typography>
                            <Typography variant="caption" color="textSecondary">Username</Typography>
                          </Box>
                        </Box>
                      </Box>

                      {isRequested ? (
                        <Button
                          fullWidth variant="contained"
                          startIcon={<CheckCircle />}
                          disabled
                          sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700, borderRadius: 2, py: 1.2 }}
                        >
                          Request Sent ✓
                        </Button>
                      ) : (
                        <Button
                          fullWidth variant="contained"
                          startIcon={<PersonAdd />}
                          onClick={() => handleSendRequest(doctor.id)}
                          sx={{ bgcolor: '#0062ff', fontWeight: 700, borderRadius: 2, py: 1.2, '&:hover': { bgcolor: '#0051d5' } }}
                        >
                          Send Request
                        </Button>
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

export default FindDoctors;