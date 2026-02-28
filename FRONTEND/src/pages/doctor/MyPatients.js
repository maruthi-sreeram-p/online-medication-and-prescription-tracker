//
import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Avatar, TextField, InputAdornment, Chip, LinearProgress,
  Button, CircularProgress
} from '@mui/material';
import { Search, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const MyPatients = () => {

  const navigate = useNavigate();
  const doctorId = localStorage.getItem('userId');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get(`/doctors/${doctorId}/patients`);
      setPatients(res.data);
    } catch (err) {
      console.error('Failed to fetch patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAdherenceColor = (pct) => {
    if (pct >= 80) return '#2e7d32';
    if (pct >= 50) return '#f57f17';
    return '#d32f2f';
  };

  const getAdherenceBg = (pct) => {
    if (pct >= 80) return '#e8f5e9';
    if (pct >= 50) return '#fff3e0';
    return '#ffebee';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress sx={{ color: '#0062ff' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="xl">

        <Box mb={4}>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>My Patients</Typography>
          <Typography color="textSecondary">{patients.length} patients under your care</Typography>
        </Box>

        <TextField
          fullWidth
          placeholder="Search patients by name..."
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

        {patients.length === 0 ? (
          <Card sx={{ borderRadius: 4, boxShadow: 2, p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary" mb={1}>No patients yet!</Typography>
            <Typography variant="body2" color="textSecondary">
              Patients will appear here after you accept their connection requests.
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredPatients.map(patient => (
              <Grid item xs={12} sm={6} lg={4} key={patient.id}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s',
                    '&:hover': { boxShadow: '0 8px 30px rgba(0,98,255,0.15)', transform: 'translateY(-3px)' }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>

                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Chip
                        label={patient.condition || 'Patient'}
                        size="small"
                        sx={{ bgcolor: '#e3f2fd', color: '#0062ff', fontWeight: 600 }}
                      />
                      <Chip
                        label={`${patient.bloodGroup || 'N/A'}`}
                        size="small"
                        sx={{ bgcolor: '#f8fafc', color: '#64748b', fontWeight: 600 }}
                      />
                    </Box>

                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Avatar
                        sx={{
                          bgcolor: '#0062ff', width: 56, height: 56,
                          fontSize: 22, fontWeight: 'bold',
                          boxShadow: '0 4px 12px rgba(0,98,255,0.3)'
                        }}
                      >
                        {patient.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography fontWeight="bold" sx={{ color: '#1e293b' }}>{patient.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {patient.age} yrs • {patient.gender}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ p: 2, borderRadius: 3, bgcolor: getAdherenceBg(patient.adherencePercentage || 0), mb: 2 }}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: getAdherenceColor(patient.adherencePercentage || 0) }}>
                          Medication Adherence
                        </Typography>
                        <Typography variant="body2" fontWeight={900} sx={{ color: getAdherenceColor(patient.adherencePercentage || 0) }}>
                          {patient.adherencePercentage || 0}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={patient.adherencePercentage || 0}
                        sx={{
                          height: 8, borderRadius: 4,
                          bgcolor: 'rgba(255,255,255,0.5)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getAdherenceColor(patient.adherencePercentage || 0),
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>

                    <Button
                      fullWidth variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => navigate(`/doctor/patient/${patient.id}`)}
                      sx={{ borderColor: '#0062ff', color: '#0062ff', fontWeight: 700, borderRadius: 2, '&:hover': { bgcolor: '#e3f2fd' } }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {filteredPatients.length === 0 && (
              <Grid item xs={12}>
                <Box textAlign="center" py={6}>
                  <Typography color="textSecondary" variant="h6">No patients found!</Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default MyPatients;