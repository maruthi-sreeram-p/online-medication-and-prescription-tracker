import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent,
  Grid, TextField, Button, Avatar, MenuItem,
  Divider, CircularProgress, Alert
} from '@mui/material';
import { CameraAlt, Person, Save } from '@mui/icons-material';
import api from '../../services/api';

const PatientProfile = () => {

  const patientId = localStorage.getItem('userId');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    bloodGroup: '',
    status: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/patients/${patientId}/profile`);
      setProfile({
        name: res.data.name || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        age: res.data.age || '',
        gender: res.data.gender || '',
        bloodGroup: res.data.bloodGroup || '',
        status: res.data.status || ''
      });
    } catch (err) {
      setError('Failed to load profile. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ✅ BUG FIX: Real API call to PUT /patients/{patientId}/profile
  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.put(`/patients/${patientId}/profile`, {
        name: profile.name,
        phone: profile.phone,
        age: profile.age ? parseInt(profile.age) : null,
        gender: profile.gender,
        bloodGroup: profile.bloodGroup
      });

      // Update name in localStorage so sidebar reflects change
      localStorage.setItem('name', profile.name);

      setSuccess('✅ Profile updated successfully!');
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || '';
      setError(msg || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
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
      <Container maxWidth="md">

        <Box mb={4}>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>Profile Settings</Typography>
          <Typography color="textSecondary">Update your personal information</Typography>
        </Box>

        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

        <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0' }}>
          <CardContent sx={{ p: 4 }}>

            {/* Profile Picture */}
            <Box textAlign="center" mb={4}>
              <Avatar
                src={profilePic}
                sx={{ width: 120, height: 120, margin: '0 auto', bgcolor: '#2e7d32', fontSize: 40 }}
              >
                {!profilePic && <Person sx={{ fontSize: 60 }} />}
              </Avatar>
              <Button
                component="label"
                startIcon={<CameraAlt />}
                sx={{ mt: 2, fontWeight: 700, color: '#2e7d32' }}
              >
                Upload Picture
                <input type="file" hidden accept="image/*" onChange={handlePictureUpload} />
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Full Name" name="name" value={profile.name} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Email" name="email" value={profile.email} disabled helperText="Email cannot be changed" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Phone" name="phone" value={profile.phone} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Age" name="age" type="number" value={profile.age} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth select label="Gender" name="gender"
                  value={profile.gender} onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth select label="Blood Group" name="bloodGroup"
                  value={profile.bloodGroup} onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                    <MenuItem key={bg} value={bg}>{bg}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Account Status" value={profile.status}
                  disabled helperText="Status managed by system"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth variant="contained" size="large"
                  startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />}
                  onClick={handleSave}
                  disabled={saving}
                  sx={{ bgcolor: '#2e7d32', fontWeight: 800, py: 1.8, borderRadius: 3, '&:hover': { bgcolor: '#1b5e20' } }}
                >
                  {saving ? 'Saving...' : '💾 Save Changes'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default PatientProfile;