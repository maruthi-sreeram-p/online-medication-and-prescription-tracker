import React, { useState } from 'react';
import {
  Box, Card, TextField, Button, Typography, ToggleButton,
  ToggleButtonGroup, Grid, Container, InputAdornment, MenuItem, Alert
} from '@mui/material';
import {
  Person, ArrowForward, Phone,
  AccountCircle, Verified, MonitorHeart, SupervisedUserCircle,
  Business, History, LocalHospital
} from '@mui/icons-material';
import Navbar from '../components/layout/Navbar';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('doctor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', phoneNumber: '',
    specialization: '', licenseNumber: '', experienceYears: '',
    hospitalName: '', hospitalPhone: '', hospitalAddress: '',
    bloodGroup: '', emergencyContact: '', age: '', gender: '', address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    const requestData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      role: role.toUpperCase(),
      phone: formData.phoneNumber,
      specialization: formData.specialization,
      licenseNumber: formData.licenseNumber,
      hospitalName: formData.hospitalName,
      bloodGroup: formData.bloodGroup,
      age: formData.age ? parseInt(formData.age) : 0,
      gender: formData.gender || "Not Specified",
    };

    setLoading(true);
    try {
      const response = await api.post('/auth/register', requestData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('name', response.data.name);
      }

      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Email might already be in use.");
    } finally {
      setLoading(false);
    }
  };

  const sectionHeaderStyle = {
    mb: 2, mt: 3, display: 'flex', alignItems: 'center', gap: 1.5,
    color: '#0062ff', borderBottom: '1px solid #e2e8f0', pb: 1,
    textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.8rem', fontWeight: 800
  };

  return (
    <Box sx={{ minHeight: '100vh', pt: 10, pb: 8, background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)' }}>
      <Navbar />
      <Container maxWidth="md">
        <Card sx={{ p: { xs: 3, md: 5 }, borderRadius: 6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight={900} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
              <LocalHospital sx={{ fontSize: 40, color: '#0062ff' }} /> MediCare
            </Typography>
            <Typography color="text.secondary">Register your account</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <ToggleButtonGroup
              value={role}
              exclusive
              onChange={(e, r) => r && setRole(r)}
              color="primary"
              fullWidth
            >
              <ToggleButton value="doctor" sx={{ fontWeight: 700 }}>
                <Person sx={{ mr: 1 }} /> Doctor
              </ToggleButton>
              <ToggleButton value="patient" sx={{ fontWeight: 700 }}>
                <AccountCircle sx={{ mr: 1 }} /> Patient
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <form onSubmit={handleRegister}>

            {/* Core Identity */}
            <Typography variant="subtitle2" sx={sectionHeaderStyle}>
              <SupervisedUserCircle /> Core Identity
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="First Name" name="firstName" onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Last Name" name="lastName" onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Email" name="email" type="email" onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Password" name="password" type="password" onChange={handleChange} required placeholder="At least 6 characters" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Phone Number" name="phoneNumber" onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Phone fontSize="small" /></InputAdornment> }}
                />
              </Grid>
            </Grid>

            {/* Doctor Fields */}
            {role === 'doctor' && (
              <Box>
                <Typography variant="subtitle2" sx={sectionHeaderStyle}>
                  <Verified /> Professional Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Specialization" name="specialization" onChange={handleChange} required />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="License Number" name="licenseNumber" onChange={handleChange} required />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth label="Years of Experience" name="experienceYears" type="number" onChange={handleChange}
                      InputProps={{ startAdornment: <InputAdornment position="start"><History fontSize="small" /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth label="Hospital Name" name="hospitalName" onChange={handleChange}
                      InputProps={{ startAdornment: <InputAdornment position="start"><Business fontSize="small" /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Hospital Address" name="hospitalAddress" multiline rows={2} onChange={handleChange} />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Patient Fields */}
            {role === 'patient' && (
              <Box>
                <Typography variant="subtitle2" sx={sectionHeaderStyle}>
                  <MonitorHeart /> Health Profile
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Age" name="age" type="number" onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth select label="Gender" name="gender" value={formData.gender} onChange={handleChange}>
                      {['Male', 'Female', 'Other'].map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth select label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <MenuItem key={bg} value={bg}>{bg}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Address" name="address" onChange={handleChange} multiline rows={2} />
                  </Grid>
                </Grid>
              </Box>
            )}

            <Button
              fullWidth type="submit" variant="contained" size="large"
              endIcon={<ArrowForward />} disabled={loading}
              sx={{ mt: 5, py: 2, borderRadius: 3, fontWeight: 800, bgcolor: '#0062ff', '&:hover': { bgcolor: '#0051d5' } }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Box mt={2} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                Already have an account?{' '}
                <span
                  onClick={() => navigate('/login')}
                  style={{ color: '#0062ff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Login here
                </span>
              </Typography>
            </Box>

          </form>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;


























// import React, { useState } from 'react';
// import { Box, Card, TextField, Button, Typography, ToggleButton,
//   ToggleButtonGroup, Grid, Container, InputAdornment, MenuItem, Alert} from '@mui/material';
// import {
//    Person, ArrowForward, Phone,
//   AccountCircle, Verified, MonitorHeart, SupervisedUserCircle,
//   Business, History, LocalHospital
// } from '@mui/icons-material';
// import Navbar from '../components/layout/Navbar';
// import { useNavigate } from 'react-router-dom';
// import api from '../services/api';

// const Register = () => {
//   const navigate = useNavigate();
//   const [role, setRole] = useState('doctor');
//   const [error, setError] = useState('');

//   const [formData, setFormData] = useState({
//     firstName: '', lastName: '', email: '', password: '', phoneNumber: '',
//     specialization: '', licenseNumber: '', experienceYears: '',
//     hospitalName: '', hospitalPhone: '', hospitalAddress: '',
//     bloodGroup: '', emergencyContact: '', age: '', gender: '', address: ''
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError('');

//     // --- CLIENT SIDE VALIDATION ---
//     if (formData.password.length < 6) {
//       setError("Password must be at least 6 characters long.");
//       return;
//     }

//     // FIX: Mapping frontend fields to match your AuthServiceImpl.java logic exactly
//     const requestData = {
//       name: `${formData.firstName} ${formData.lastName}`, // Backend expects "name"
//       email: formData.email,
//       password: formData.password,
//       role: role.toUpperCase(),
//       phone: formData.phoneNumber, // Backend expects "phone"

//       // Doctor Fields
//       specialization: formData.specialization,
//       licenseNumber: formData.licenseNumber,
//       experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : 0,
//       hospitalName: formData.hospitalName,
//       hospitalPhone: formData.hospitalPhone,
//       hospitalAddress: formData.hospitalAddress,

//       // Patient/General Fields
//       bloodGroup: formData.bloodGroup,
//       emergencyContact: formData.emergencyContact,
//       age: formData.age ? parseInt(formData.age) : 0,
//       gender: formData.gender || "Not Specified",
//       address: formData.address || formData.hospitalAddress // Use address or hospitalAddress as fallback
//     };

//     try {
//       // Sending request to http://localhost:8321/api/auth/register
//       const response = await api.post('/auth/register', requestData);

//       // Success! Save token and role if returned, then go to login
//       if(response.data.token) {
//         localStorage.setItem('token', response.data.token);
//         localStorage.setItem('role', response.data.role);
//       }

//       console.log("Registration Successful:", response.data);
//       navigate('/login');
//     } catch (err) {
//      const backendError = err.response?.data?.error || "Registration failed. Email might already be in use.";
//       setError(backendError);
//       console.error("Registration Error:", err.response?.data);
//     }
//   };

//   const sectionHeaderStyle = { mb: 2, mt: 3, display: 'flex', alignItems: 'center', gap: 1.5, color: '#0062ff', borderBottom: '1px solid #e2e8f0', pb: 1, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.8rem', fontWeight: 800 };

//   return (
//     <Box sx={{ minHeight: '100vh', pt: 10, pb: 8, background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)' }}>
//       <Navbar />
//       <Container maxWidth="md">
//         <Card sx={{ p: { xs: 3, md: 5 }, borderRadius: 6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
//           <Box sx={{ textAlign: 'center', mb: 4 }}>
//             <Typography variant="h4" fontWeight={900} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
//               <LocalHospital sx={{ fontSize: 40, color: '#0062ff' }} /> MediCare
//             </Typography>
//             <Typography color="text.secondary">Register your account</Typography>
//           </Box>

//           {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

//           <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
//             <ToggleButtonGroup value={role} exclusive onChange={(e, r) => r && setRole(r)} color="primary" fullWidth>
//               <ToggleButton value="doctor" sx={{ fontWeight: 700 }}><Person sx={{ mr: 1 }} /> Doctor</ToggleButton>
//               <ToggleButton value="patient" sx={{ fontWeight: 700 }}><AccountCircle sx={{ mr: 1 }} /> Patient</ToggleButton>
//             </ToggleButtonGroup>
//           </Box>

//           <form onSubmit={handleRegister}>
//             <Typography variant="subtitle2" sx={sectionHeaderStyle}><SupervisedUserCircle /> Core Identity</Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={12} md={6}><TextField fullWidth label="First Name" name="firstName" onChange={handleChange} required /></Grid>
//               <Grid item xs={12} md={6}><TextField fullWidth label="Last Name" name="lastName" onChange={handleChange} required /></Grid>
//               <Grid item xs={12} md={6}><TextField fullWidth label="Email" name="email" type="email" onChange={handleChange} required /></Grid>
//               <Grid item xs={12} md={6}><TextField fullWidth label="Password" name="password" type="password" onChange={handleChange} required placeholder="At least 6 characters" /></Grid>
//               <Grid item xs={12}>
//                 <TextField fullWidth label="Phone Number" name="phoneNumber" onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start"><Phone fontSize="small" /></InputAdornment> }} />
//               </Grid>
//             </Grid>

//             {role === 'doctor' ? (
//               <Box>
//                 <Typography variant="subtitle2" sx={sectionHeaderStyle}><Verified /> Professional Details</Typography>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} md={6}><TextField fullWidth label="Specialization" name="specialization" onChange={handleChange} required /></Grid>
//                   <Grid item xs={12} md={6}><TextField fullWidth label="License Number" name="licenseNumber" onChange={handleChange} required /></Grid>
//                   <Grid item xs={12} md={4}>
//                     <TextField fullWidth label="Years of Experience" name="experienceYears" type="number" onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start"><History fontSize="small" /></InputAdornment> }} />
//                   </Grid>
//                   <Grid item xs={12} md={8}>
//                     <TextField fullWidth label="Hospital Name" name="hospitalName" onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start"><Business fontSize="small" /></InputAdornment> }} />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField fullWidth label="Hospital Address" name="hospitalAddress" multiline rows={2} onChange={handleChange} />
//                   </Grid>
//                 </Grid>
//               </Box>
//             ) : (
//               <Box>
//                 <Typography variant="subtitle2" sx={sectionHeaderStyle}><MonitorHeart /> Health Profile</Typography>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} md={4}>
//                     <TextField fullWidth label="Age" name="age" type="number" onChange={handleChange} />
//                   </Grid>
//                   <Grid item xs={12} md={4}>
//                     <TextField fullWidth select label="Gender" name="gender" value={formData.gender} onChange={handleChange}>
//                       {['Male', 'Female', 'Other'].map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
//                     </TextField>
//                   </Grid>
//                   <Grid item xs={12} md={4}>
//                     <TextField fullWidth select label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
//                       {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <MenuItem key={bg} value={bg}>{bg}</MenuItem>)}
//                     </TextField>
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField fullWidth label="Address" name="address" onChange={handleChange} multiline rows={2} />
//                   </Grid>
//                 </Grid>
//               </Box>
//             )}

//             <Button fullWidth type="submit" variant="contained" size="large" endIcon={<ArrowForward />} sx={{ mt: 5, py: 2, borderRadius: 3, fontWeight: 800 }}>
//               Create Account
//             </Button>
//           </form>
//         </Card>
//       </Container>
//     </Box>
//   );
// };

// export default Register;