import React, { useState } from 'react';
import { Box, Card, TextField, Button, Typography, Container, Alert } from '@mui/material';
import Navbar from '../components/layout/Navbar';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('name', response.data.name);

      const role = response.data.role;
      if (role === 'DOCTOR') navigate('/doctor/dashboard');
      else if (role === 'PATIENT') navigate('/patient/dashboard');
      else if (role === 'STAFF') navigate('/staff/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: '#f8fafc' }}>
      <Navbar />
      <Container maxWidth="xs">
        <Card sx={{ p: 4, borderRadius: 4, boxShadow: 3 }}>

          <Typography variant="h5" fontWeight={800} textAlign="center" mb={1}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="textSecondary" textAlign="center" mb={3}>
            Login to your MediCare account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              onChange={handleChange}
              margin="normal"
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              onChange={handleChange}
              margin="normal"
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                bgcolor: '#0062ff',
                fontWeight: 700,
                borderRadius: 2,
                '&:hover': { bgcolor: '#0051d5' }
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <Box mt={3} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              Don't have an account?{' '}
              <span
                onClick={() => navigate('/register')}
                style={{ color: '#0062ff', fontWeight: 700, cursor: 'pointer' }}
              >
                Register here
              </span>
            </Typography>
          </Box>

        </Card>
      </Container>
    </Box>
  );
};

export default Login;



// import React, { useState } from 'react';
// import { Box, Card, TextField, Button, Typography, Container, Alert } from '@mui/material';
// import Navbar from '../components/layout/Navbar';
// import { useNavigate } from 'react-router-dom';
// import api from '../services/api';

// const Login = () => {
//   const navigate = useNavigate();
//   const [error, setError] = useState('');
//   const [credentials, setCredentials] = useState({ email: '', password: '' });

//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   // MOCK LOGIN FOR TESTING (Remove when backend is ready)
//   const handleMockLogin = (role) => {
//     localStorage.setItem('token', 'mock-token-123');
//     localStorage.setItem('role', role);
//     if (role === 'DOCTOR') navigate('/doctor/dashboard');
//     else if (role === 'PATIENT') navigate('/patient/dashboard');
//     else if (role === 'STAFF') navigate('/staff/dashboard');
//     else if (role === 'ADMIN') navigate('/admin/dashboard');
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       const response = await api.post('/auth/login', {
//         email: credentials.email,
//         password: credentials.password
//       });

//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('role', response.data.role);

//       const role = response.data.role;
//       if (role === 'DOCTOR') {
//         navigate('/doctor/dashboard');
//       } else if (role === 'PATIENT') {
//         navigate('/patient/dashboard');
//       } else if (role === 'STAFF') {
//         navigate('/staff/dashboard');
//       } else if (role === 'ADMIN') {
//         navigate('/admin/dashboard');
//       } else {
//         navigate('/dashboard');
//       }

//     } catch (err) {
//       setError("Invalid email or password. Please try again.");
//     }
//   };

//   return (
//     <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: '#f8fafc' }}>
//       <Navbar />
//       <Container maxWidth="xs">
//         <Card sx={{ p: 4, borderRadius: 4, boxShadow: 3 }}>

//           {/* Title */}
//           <Typography variant="h5" fontWeight={800} textAlign="center" mb={1}>
//             Welcome Back
//           </Typography>
//           <Typography variant="body2" color="textSecondary" textAlign="center" mb={3}>
//             Login to your MediCare account
//           </Typography>

//           {/* Error */}
//           {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//           {/* Login Form */}
//           <form onSubmit={handleLogin}>
//             <TextField
//               fullWidth
//               label="Email Address"
//               name="email"
//               onChange={handleChange}
//               margin="normal"
//               required
//               sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//             />
//             <TextField
//               fullWidth
//               label="Password"
//               name="password"
//               type="password"
//               onChange={handleChange}
//               margin="normal"
//               required
//               sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//             />
//             <Button
//               fullWidth
//               type="submit"
//               variant="contained"
//               size="large"
//               sx={{
//                 mt: 3,
//                 py: 1.5,
//                 bgcolor: '#0062ff',
//                 fontWeight: 700,
//                 borderRadius: 2,
//                 '&:hover': { bgcolor: '#0051d5' }
//               }}
//             >
//               Login
//             </Button>
//           </form>

//           {/* Mock Login Buttons */}
//           <Box mt={3}>
//             <Typography
//               variant="caption"
//               color="textSecondary"
//               textAlign="center"
//               display="block"
//               mb={1.5}
//               fontWeight="bold"
//             >
//               — Quick Test Login —
//             </Typography>
//             <Box display="flex" flexDirection="column" gap={1}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 onClick={() => handleMockLogin('DOCTOR')}
//                 sx={{ borderColor: '#0062ff', color: '#0062ff', fontWeight: 700, borderRadius: 2 }}
//               >
//                 🩺 Login as Doctor
//               </Button>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 onClick={() => handleMockLogin('PATIENT')}
//                 sx={{ borderColor: '#2e7d32', color: '#2e7d32', fontWeight: 700, borderRadius: 2 }}
//               >
//                 🧑‍⚕️ Login as Patient
//               </Button>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 onClick={() => handleMockLogin('STAFF')}
//                 sx={{ borderColor: '#f57f17', color: '#f57f17', fontWeight: 700, borderRadius: 2 }}
//               >
//                 👨‍⚕️ Login as Staff
//               </Button>

//               {/* NEW - Admin Button */}
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 onClick={() => handleMockLogin('ADMIN')}
//                 sx={{ borderColor: '#6a1b9a', color: '#6a1b9a', fontWeight: 700, borderRadius: 2 }}
//               >
//                 🛡️ Login as Admin
//               </Button>
//             </Box>
//           </Box>

//         </Card>
//       </Container>
//     </Box>
//   );
// };

// export default Login;