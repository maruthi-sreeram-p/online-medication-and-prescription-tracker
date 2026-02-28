import React, { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent,
  Grid, TextField, Button, Avatar
} from '@mui/material';
import { CameraAlt, AdminPanelSettings } from '@mui/icons-material';

const AdminProfile = () => {

  const [profile, setProfile] = useState({
    name: 'Super Admin',
    email: 'admin@medicare.com',
    phone: '9876543210',
    role: 'System Administrator'
  });

  const [profilePic, setProfilePic] = useState(null);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="md">

        <Box mb={4}>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>Admin Profile</Typography>
          <Typography color="textSecondary">Manage your admin account</Typography>
        </Box>

        <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0' }}>
          <CardContent sx={{ p: 4 }}>

            <Box textAlign="center" mb={4}>
              <Avatar
                src={profilePic}
                sx={{ width: 120, height: 120, margin: '0 auto', bgcolor: '#6a1b9a', fontSize: 40 }}
              >
                {!profilePic && <AdminPanelSettings sx={{ fontSize: 60 }} />}
              </Avatar>
              <Button component="label" startIcon={<CameraAlt />} sx={{ mt: 2, fontWeight: 700, color: '#6a1b9a' }}>
                Upload Picture
                <input type="file" hidden accept="image/*" onChange={handlePictureUpload} />
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Full Name" name="name" value={profile.name} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Email" name="email" value={profile.email} disabled helperText="Email cannot be changed" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Phone" name="phone" value={profile.phone} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Role" name="role" value={profile.role} disabled />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" size="large"
                  onClick={() => alert('Profile updated!')}
                  sx={{ bgcolor: '#6a1b9a', fontWeight: 800, py: 1.8, borderRadius: 3 }}>
                  💾 Save Changes
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminProfile;