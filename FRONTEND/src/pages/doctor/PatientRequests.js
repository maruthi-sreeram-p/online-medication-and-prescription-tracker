// import React, { useState } from 'react';
// import {
//   Box, Container, Typography, Grid, Card, CardContent,
//   Avatar, Button, Chip
// } from '@mui/material';
// import { CheckCircle, Cancel, PersonAdd } from '@mui/icons-material';

// /**
//  * PATIENT REQUESTS PAGE - REDESIGNED
//  * Professional, eye-catching UI
//  * Like Instagram friend requests but medical themed
//  */
// const PatientRequests = () => {

//   const [requests, setRequests] = useState([
//     { id: 1, name: 'Maruthi Sreeram', age: 26, gender: 'Male', condition: 'Diabetes', since: '2 hours ago' },
//     { id: 2, name: 'Suprabath Behera', age: 25, gender: 'Male', condition: 'Hypertension', since: '5 hours ago' },
//     { id: 3, name: 'Vinay Kumar', age: 30, gender: 'Male', condition: 'Fever', since: '1 day ago' }
//   ]);

//   const [accepted, setAccepted] = useState([]);

//   const handleAccept = (id) => {
//     const req = requests.find(r => r.id === id);
//     setAccepted([...accepted, req]);
//     setRequests(requests.filter(r => r.id !== id));
//   };

//   const handleReject = (id) => {
//     setRequests(requests.filter(r => r.id !== id));
//   };

//   return (
//     <Box sx={{ py: 4, px: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
//       <Container maxWidth="lg">

//         {/* Header */}
//         <Box mb={4}>
//           <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>
//             Patient Requests
//           </Typography>
//           <Typography color="textSecondary">
//             Patients who want to connect with you
//           </Typography>
//         </Box>

//         {/* Pending Requests */}
//         {requests.length === 0 ? (
//           <Card sx={{ borderRadius: 4, boxShadow: 2, p: 6, textAlign: 'center' }}>
//             <PersonAdd sx={{ fontSize: 80, color: '#e2e8f0', mb: 2 }} />
//             <Typography variant="h6" color="textSecondary">
//               No pending requests!
//             </Typography>
//           </Card>
//         ) : (
//           <Grid container spacing={3}>
//             {requests.map(request => (
//               <Grid item xs={12} md={6} lg={4} key={request.id}>
//                 <Card
//                   sx={{
//                     borderRadius: 4,
//                     boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
//                     border: '1px solid #e2e8f0',
//                     transition: 'all 0.3s',
//                     '&:hover': { boxShadow: '0 8px 30px rgba(0,98,255,0.15)', transform: 'translateY(-2px)' }
//                   }}
//                 >
//                   <CardContent sx={{ p: 3 }}>
//                     {/* Top Badge */}
//                     <Box display="flex" justifyContent="flex-end" mb={2}>
//                       <Chip
//                         label="New Request"
//                         size="small"
//                         sx={{ bgcolor: '#e3f2fd', color: '#0062ff', fontWeight: 700 }}
//                       />
//                     </Box>

//                     {/* Patient Info */}
//                     <Box textAlign="center" mb={3}>
//                       <Avatar
//                         sx={{
//                           bgcolor: '#0062ff',
//                           width: 80,
//                           height: 80,
//                           margin: '0 auto',
//                           fontSize: 32,
//                           fontWeight: 'bold',
//                           mb: 2,
//                           boxShadow: '0 4px 12px rgba(0,98,255,0.3)'
//                         }}
//                       >
//                         {request.name.charAt(0)}
//                       </Avatar>

//                       <Typography variant="h6" fontWeight="bold" sx={{ color: '#1e293b' }}>
//                         {request.name}
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary">
//                         {request.age} years • {request.gender}
//                       </Typography>
//                       <Chip
//                         label={request.condition}
//                         size="small"
//                         sx={{ mt: 1, bgcolor: '#fce4ec', color: '#c62828', fontWeight: 600 }}
//                       />
//                       <Typography variant="caption" display="block" color="textSecondary" mt={1}>
//                         Requested {request.since}
//                       </Typography>
//                     </Box>

//                     {/* Action Buttons */}
//                     <Box display="flex" gap={1}>
//                       <Button
//                         fullWidth
//                         variant="contained"
//                         startIcon={<CheckCircle />}
//                         onClick={() => handleAccept(request.id)}
//                         sx={{
//                           bgcolor: '#0062ff',
//                           fontWeight: 700,
//                           borderRadius: 2,
//                           py: 1.2,
//                           '&:hover': { bgcolor: '#0051d5' }
//                         }}
//                       >
//                         Accept
//                       </Button>
//                       <Button
//                         fullWidth
//                         variant="outlined"
//                         startIcon={<Cancel />}
//                         onClick={() => handleReject(request.id)}
//                         color="error"
//                         sx={{
//                           fontWeight: 700,
//                           borderRadius: 2,
//                           py: 1.2
//                         }}
//                       >
//                         Decline
//                       </Button>
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         )}

//         {/* Accepted Requests */}
//         {accepted.length > 0 && (
//           <Box mt={6}>
//             <Typography variant="h6" fontWeight="bold" mb={3} sx={{ color: '#2e7d32' }}>
//               ✅ Recently Accepted ({accepted.length})
//             </Typography>
//             <Grid container spacing={2}>
//               {accepted.map(patient => (
//                 <Grid item xs={12} md={4} key={patient.id}>
//                   <Card sx={{ borderRadius: 3, border: '1px solid #e8f5e9', bgcolor: '#f9fffe' }}>
//                     <CardContent sx={{ p: 2 }}>
//                       <Box display="flex" alignItems="center" gap={2}>
//                         <Avatar sx={{ bgcolor: '#2e7d32' }}>
//                           {patient.name.charAt(0)}
//                         </Avatar>
//                         <Box>
//                           <Typography fontWeight="bold">{patient.name}</Typography>
//                           <Typography variant="caption" color="textSecondary">
//                             Now your patient ✓
//                           </Typography>
//                         </Box>
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>
//         )}
//       </Container>
//     </Box>
//   );
// };

// export default PatientRequests;
import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Avatar, Button, Chip, CircularProgress, Alert
} from '@mui/material';
import { CheckCircle, Cancel, PersonAdd } from '@mui/icons-material';
import api from '../../services/api';

const PatientRequests = () => {

  const doctorId = localStorage.getItem('userId');
  const [requests, setRequests] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // Get pending requests for this doctor
      const res = await api.get(`/doctors/${doctorId}/requests`);
      setRequests(res.data || []);
    } catch (err) {
      // If API not ready yet, show empty state
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId, request) => {
    try {
      await api.put(`/doctors/${doctorId}/requests/${requestId}/accept`);
      setAccepted([...accepted, request]);
      setRequests(requests.filter(r => r.id !== requestId));
    } catch (err) {
      // Optimistic UI update even if API not connected yet
      setAccepted([...accepted, request]);
      setRequests(requests.filter(r => r.id !== requestId));
    }
  };

  const handleReject = async (requestId) => {
    try {
      await api.put(`/doctors/${doctorId}/requests/${requestId}/reject`);
      setRequests(requests.filter(r => r.id !== requestId));
    } catch (err) {
      setRequests(requests.filter(r => r.id !== requestId));
    }
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
      <Container maxWidth="lg">

        <Box mb={4}>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>Patient Requests</Typography>
          <Typography color="textSecondary">Patients who want to connect with you</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {requests.length === 0 ? (
          <Card sx={{ borderRadius: 4, boxShadow: 2, p: 6, textAlign: 'center' }}>
            <PersonAdd sx={{ fontSize: 80, color: '#e2e8f0', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">No pending requests!</Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              When patients send you a connection request, they will appear here.
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {requests.map(request => (
              <Grid item xs={12} md={6} lg={4} key={request.id}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s',
                    '&:hover': { boxShadow: '0 8px 30px rgba(0,98,255,0.15)', transform: 'translateY(-2px)' }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="flex-end" mb={2}>
                      <Chip label="New Request" size="small" sx={{ bgcolor: '#e3f2fd', color: '#0062ff', fontWeight: 700 }} />
                    </Box>

                    <Box textAlign="center" mb={3}>
                      <Avatar
                        sx={{
                          bgcolor: '#0062ff', width: 80, height: 80,
                          margin: '0 auto', fontSize: 32, fontWeight: 'bold', mb: 2,
                          boxShadow: '0 4px 12px rgba(0,98,255,0.3)'
                        }}
                      >
                        {request.patientName ? request.patientName.charAt(0) : 'P'}
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: '#1e293b' }}>
                        {request.patientName || 'Patient'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {request.age} years • {request.gender}
                      </Typography>
                      <Typography variant="caption" display="block" color="textSecondary" mt={1}>
                        Requested recently
                      </Typography>
                    </Box>

                    <Box display="flex" gap={1}>
                      <Button
                        fullWidth variant="contained"
                        startIcon={<CheckCircle />}
                        onClick={() => handleAccept(request.id, request)}
                        sx={{ bgcolor: '#0062ff', fontWeight: 700, borderRadius: 2, py: 1.2, '&:hover': { bgcolor: '#0051d5' } }}
                      >
                        Accept
                      </Button>
                      <Button
                        fullWidth variant="outlined"
                        startIcon={<Cancel />}
                        onClick={() => handleReject(request.id)}
                        color="error"
                        sx={{ fontWeight: 700, borderRadius: 2, py: 1.2 }}
                      >
                        Decline
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {accepted.length > 0 && (
          <Box mt={6}>
            <Typography variant="h6" fontWeight="bold" mb={3} sx={{ color: '#2e7d32' }}>
              ✅ Recently Accepted ({accepted.length})
            </Typography>
            <Grid container spacing={2}>
              {accepted.map((patient, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ borderRadius: 3, border: '1px solid #e8f5e9', bgcolor: '#f9fffe' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: '#2e7d32' }}>
                          {patient.patientName ? patient.patientName.charAt(0) : 'P'}
                        </Avatar>
                        <Box>
                          <Typography fontWeight="bold">{patient.patientName || 'Patient'}</Typography>
                          <Typography variant="caption" color="textSecondary">Now your patient ✓</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PatientRequests;