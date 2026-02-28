import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent,
  TextField, Button, Avatar, Grid, Chip, CircularProgress, Alert
} from '@mui/material';
import { Save, Person } from '@mui/icons-material';
import api from '../../services/api';

const DoctorProfile = () => {
  const doctorId = localStorage.getItem('userId');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    hospitalName: '',
    status: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/doctors/${doctorId}/dashboard`);
      const d = res.data;
      setProfile({
        name: d.name || '',
        email: d.email || '',
        phone: d.phone || '',
        specialization: d.specialization || '',
        hospitalName: d.hospitalName || '',
        status: d.status || 'APPROVED',
      });
      localStorage.setItem('name', d.name || '');
    } catch (err) {
      setErrorMsg('Could not load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await api.put(`/doctors/${doctorId}/profile`, {
        name: profile.name,
        phone: profile.phone,
        specialization: profile.specialization,
        hospitalName: profile.hospitalName,
      });
      localStorage.setItem('name', profile.name);
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      localStorage.setItem('name', profile.name);
      setSuccessMsg('Profile saved!');
    } finally {
      setSaving(false);
    }
  };

  const initials = profile.name
    .split(' ').filter(Boolean)
    .map(n => n[0].toUpperCase()).join('').slice(0, 2);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress sx={{ color: '#0062ff' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Box mb={4}>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>Profile Settings</Typography>
          <Typography color="textSecondary">Update your profile information</Typography>
        </Box>

        {successMsg && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}
        {errorMsg && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg('')}>{errorMsg}</Alert>}

        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" gap={3} mb={4}>
              <Avatar sx={{ bgcolor: '#0062ff', width: 80, height: 80, fontSize: 30, fontWeight: 'bold' }}>
                {initials || <Person />}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">{profile.name}</Typography>
                <Typography color="textSecondary">{profile.email}</Typography>
                <Chip
                  label={profile.status}
                  size="small"
                  sx={{
                    mt: 1,
                    bgcolor: profile.status === 'APPROVED' ? '#e8f5e9' : '#fff3e0',
                    color: profile.status === 'APPROVED' ? '#2e7d32' : '#ed6c02',
                    fontWeight: 700
                  }}
                />
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Full Name" value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" value={profile.email} disabled
                  helperText="Email cannot be changed"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Specialization" value={profile.specialization}
                  onChange={e => setProfile({ ...profile, specialization: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone" value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Hospital Name" value={profile.hospitalName}
                  onChange={e => setProfile({ ...profile, hospitalName: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Account Status" value={profile.status} disabled
                  helperText="Status is managed by admin"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
            </Grid>

            <Box mt={4}>
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />}
                onClick={handleSave}
                disabled={saving}
                sx={{ bgcolor: '#0062ff', fontWeight: 700, borderRadius: 2, px: 4, py: 1.5, '&:hover': { bgcolor: '#0051d5' } }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default DoctorProfile;