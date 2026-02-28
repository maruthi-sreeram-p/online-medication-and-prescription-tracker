// import React, { useState } from 'react';
// import {
//   Box, Container, Typography, Card, CardContent,
//   Grid, Avatar, Chip, TextField, InputAdornment,
//   Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Paper, Button
// } from '@mui/material';
// import {
//   Search, History, CalendarToday,
//   AccessTime, Person, Visibility
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';

// /**
//  * PATIENT HISTORY PAGE
//  * Purpose: Shows all patients who visited this doctor
//  * Features:
//  * - Visit history with date and time
//  * - Appointment status (Completed/Upcoming/Cancelled)
//  * - Search by patient name
//  * - Click to view patient details
//  */
// const PatientHistory = () => {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState('');

//   // MOCK DATA (Replace with API later)
//   const [history] = useState([
//     {
//       id: 1,
//       patientId: 1,
//       patientName: 'Namitha Ganji',
//       age: 25,
//       gender: 'Female',
//       condition: 'Diabetes',
//       visitDate: '2026-02-15',
//       visitTime: '10:30 AM',
//       status: 'COMPLETED',
//       prescription: 'Dolo 650, Metformin',
//       nextVisit: '2026-02-22'
//     },
//     {
//       id: 2,
//       patientId: 2,
//       patientName: 'Sree Ram',
//       age: 28,
//       gender: 'Male',
//       condition: 'Hypertension',
//       visitDate: '2026-02-14',
//       visitTime: '11:00 AM',
//       status: 'COMPLETED',
//       prescription: 'Amlodipine 5mg',
//       nextVisit: '2026-02-21'
//     },
//     {
//       id: 3,
//       patientId: 3,
//       patientName: 'Pramodini',
//       age: 24,
//       gender: 'Female',
//       condition: 'Fever',
//       visitDate: '2026-02-17',
//       visitTime: '02:00 PM',
//       status: 'UPCOMING',
//       prescription: '-',
//       nextVisit: '-'
//     },
//     {
//       id: 4,
//       patientId: 4,
//       patientName: 'Maruthi Sreeram',
//       age: 26,
//       gender: 'Male',
//       condition: 'Asthma',
//       visitDate: '2026-02-13',
//       visitTime: '09:00 AM',
//       status: 'COMPLETED',
//       prescription: 'Salbutamol, Budesonide',
//       nextVisit: '2026-02-27'
//     },
//     {
//       id: 5,
//       patientId: 5,
//       patientName: 'Suprabath Behera',
//       age: 25,
//       gender: 'Male',
//       condition: 'Migraine',
//       visitDate: '2026-02-10',
//       visitTime: '03:30 PM',
//       status: 'CANCELLED',
//       prescription: '-',
//       nextVisit: '2026-02-18'
//     }
//   ]);

//   // Status chip colors
//   const getStatusStyle = (status) => {
//     if (status === 'COMPLETED') return { bg: '#e8f5e9', color: '#2e7d32' };
//     if (status === 'UPCOMING') return { bg: '#e3f2fd', color: '#0062ff' };
//     return { bg: '#ffebee', color: '#d32f2f' };
//   };

//   // Filter by search
//   const filtered = history.filter(h =>
//     h.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     h.condition.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Box sx={{ py: 4, px: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
//       <Container maxWidth="xl">

//         {/* Header */}
//         <Box mb={4}>
//           <Box display="flex" alignItems="center" gap={1.5} mb={1}>
//             <History sx={{ color: '#0062ff', fontSize: 32 }} />
//             <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>
//               Patient History
//             </Typography>
//           </Box>
//           <Typography color="textSecondary">
//             All patient visits, appointments and prescriptions
//           </Typography>
//         </Box>

//         {/* Stats Row */}
//         <Grid container spacing={2} mb={4}>
//           <Grid item xs={6} md={3}>
//             <Card sx={{ borderRadius: 3, border: '1px solid #e8f5e9', bgcolor: '#f9fffe' }}>
//               <CardContent sx={{ p: 2 }}>
//                 <Typography variant="h4" fontWeight={900} sx={{ color: '#2e7d32' }}>
//                   {history.filter(h => h.status === 'COMPLETED').length}
//                 </Typography>
//                 <Typography variant="caption" color="textSecondary" fontWeight="bold">
//                   COMPLETED
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={6} md={3}>
//             <Card sx={{ borderRadius: 3, border: '1px solid #e3f2fd', bgcolor: '#f0f7ff' }}>
//               <CardContent sx={{ p: 2 }}>
//                 <Typography variant="h4" fontWeight={900} sx={{ color: '#0062ff' }}>
//                   {history.filter(h => h.status === 'UPCOMING').length}
//                 </Typography>
//                 <Typography variant="caption" color="textSecondary" fontWeight="bold">
//                   UPCOMING
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={6} md={3}>
//             <Card sx={{ borderRadius: 3, border: '1px solid #ffebee', bgcolor: '#fff5f5' }}>
//               <CardContent sx={{ p: 2 }}>
//                 <Typography variant="h4" fontWeight={900} sx={{ color: '#d32f2f' }}>
//                   {history.filter(h => h.status === 'CANCELLED').length}
//                 </Typography>
//                 <Typography variant="caption" color="textSecondary" fontWeight="bold">
//                   CANCELLED
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={6} md={3}>
//             <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
//               <CardContent sx={{ p: 2 }}>
//                 <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>
//                   {history.length}
//                 </Typography>
//                 <Typography variant="caption" color="textSecondary" fontWeight="bold">
//                   TOTAL VISITS
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>

//         {/* Search */}
//         <TextField
//           fullWidth
//           placeholder="Search by patient name or condition..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           sx={{ mb: 3, bgcolor: 'white', borderRadius: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Search sx={{ color: '#0062ff' }} />
//               </InputAdornment>
//             )
//           }}
//         />

//         {/* History Table */}
//         <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0' }}>
//           <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
//             <Table>
//               <TableHead sx={{ bgcolor: '#f8fafc' }}>
//                 <TableRow>
//                   <TableCell><strong>Patient</strong></TableCell>
//                   <TableCell><strong>Condition</strong></TableCell>
//                   <TableCell><strong>Visit Date & Time</strong></TableCell>
//                   <TableCell><strong>Prescription</strong></TableCell>
//                   <TableCell><strong>Next Visit</strong></TableCell>
//                   <TableCell><strong>Status</strong></TableCell>
//                   <TableCell><strong>Action</strong></TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filtered.map((visit) => {
//                   const statusStyle = getStatusStyle(visit.status);
//                   return (
//                     <TableRow
//                       key={visit.id}
//                       hover
//                       sx={{ '&:hover': { bgcolor: '#f0f7ff' } }}
//                     >
//                       {/* Patient */}
//                       <TableCell>
//                         <Box display="flex" alignItems="center" gap={1.5}>
//                           <Avatar sx={{ bgcolor: '#0062ff', width: 38, height: 38, fontSize: 15, fontWeight: 'bold' }}>
//                             {visit.patientName.charAt(0)}
//                           </Avatar>
//                           <Box>
//                             <Typography fontWeight="bold" sx={{ fontSize: '0.9rem' }}>
//                               {visit.patientName}
//                             </Typography>
//                             <Typography variant="caption" color="textSecondary">
//                               {visit.age} yrs • {visit.gender}
//                             </Typography>
//                           </Box>
//                         </Box>
//                       </TableCell>

//                       {/* Condition */}
//                       <TableCell>
//                         <Chip
//                           label={visit.condition}
//                           size="small"
//                           sx={{ bgcolor: '#fce4ec', color: '#c62828', fontWeight: 600 }}
//                         />
//                       </TableCell>

//                       {/* Visit Date */}
//                       <TableCell>
//                         <Box display="flex" flexDirection="column" gap={0.3}>
//                           <Box display="flex" alignItems="center" gap={0.5}>
//                             <CalendarToday sx={{ fontSize: 14, color: '#64748b' }} />
//                             <Typography variant="body2" fontWeight="bold">
//                               {visit.visitDate}
//                             </Typography>
//                           </Box>
//                           <Box display="flex" alignItems="center" gap={0.5}>
//                             <AccessTime sx={{ fontSize: 14, color: '#64748b' }} />
//                             <Typography variant="caption" color="textSecondary">
//                               {visit.visitTime}
//                             </Typography>
//                           </Box>
//                         </Box>
//                       </TableCell>

//                       {/* Prescription */}
//                       <TableCell>
//                         <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
//                           {visit.prescription}
//                         </Typography>
//                       </TableCell>

//                       {/* Next Visit */}
//                       <TableCell>
//                         <Typography variant="body2" fontWeight="bold" sx={{ color: '#0062ff' }}>
//                           {visit.nextVisit}
//                         </Typography>
//                       </TableCell>

//                       {/* Status */}
//                       <TableCell>
//                         <Chip
//                           label={visit.status}
//                           size="small"
//                           sx={{
//                             bgcolor: statusStyle.bg,
//                             color: statusStyle.color,
//                             fontWeight: 700,
//                             fontSize: '0.75rem'
//                           }}
//                         />
//                       </TableCell>

//                       {/* Action */}
//                       <TableCell>
//                         <Button
//                           size="small"
//                           variant="outlined"
//                           startIcon={<Visibility />}
//                           onClick={() => navigate(`/doctor/patient/${visit.patientId}`)}
//                           sx={{
//                             borderColor: '#0062ff',
//                             color: '#0062ff',
//                             fontWeight: 700,
//                             borderRadius: 2,
//                             '&:hover': { bgcolor: '#e3f2fd' }
//                           }}
//                         >
//                           View
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Card>
//       </Container>
//     </Box>
//   );
// };

// export default PatientHistory;

import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent,
  Grid, Avatar, Chip, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, CircularProgress
} from '@mui/material';
import { Search, History, CalendarToday, AccessTime, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PatientHistory = () => {
  const navigate = useNavigate();
  const doctorId = localStorage.getItem('userId');
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/doctors/${doctorId}/patients`);
      // Map connected patients as history entries
      const historyData = res.data.map((p, index) => ({
        id: index + 1,
        patientId: p.id,
        patientName: p.name,
        age: p.age,
        gender: p.gender,
        condition: p.condition || 'General',
        visitDate: new Date().toISOString().split('T')[0],
        visitTime: '10:00 AM',
        status: 'COMPLETED',
        prescription: 'View prescriptions',
        nextVisit: '-'
      }));
      setHistory(historyData);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    if (status === 'COMPLETED') return { bg: '#e8f5e9', color: '#2e7d32' };
    if (status === 'UPCOMING') return { bg: '#e3f2fd', color: '#0062ff' };
    return { bg: '#ffebee', color: '#d32f2f' };
  };

  const filtered = history.filter(h =>
    h.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.condition && h.condition.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <Box display="flex" alignItems="center" gap={1.5} mb={1}>
            <History sx={{ color: '#0062ff', fontSize: 32 }} />
            <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>Patient History</Typography>
          </Box>
          <Typography color="textSecondary">All patient visits and prescriptions</Typography>
        </Box>

        {/* Stats Row */}
        <Grid container spacing={2} mb={4}>
          <Grid item xs={6} md={3}>
            <Card sx={{ borderRadius: 3, border: '1px solid #e8f5e9', bgcolor: '#f9fffe' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h4" fontWeight={900} sx={{ color: '#2e7d32' }}>
                  {history.filter(h => h.status === 'COMPLETED').length}
                </Typography>
                <Typography variant="caption" color="textSecondary" fontWeight="bold">COMPLETED</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ borderRadius: 3, border: '1px solid #e3f2fd', bgcolor: '#f0f7ff' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h4" fontWeight={900} sx={{ color: '#0062ff' }}>
                  {history.filter(h => h.status === 'UPCOMING').length}
                </Typography>
                <Typography variant="caption" color="textSecondary" fontWeight="bold">UPCOMING</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ borderRadius: 3, border: '1px solid #ffebee', bgcolor: '#fff5f5' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h4" fontWeight={900} sx={{ color: '#d32f2f' }}>
                  {history.filter(h => h.status === 'CANCELLED').length}
                </Typography>
                <Typography variant="caption" color="textSecondary" fontWeight="bold">CANCELLED</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>{history.length}</Typography>
                <Typography variant="caption" color="textSecondary" fontWeight="bold">TOTAL VISITS</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <TextField
          fullWidth
          placeholder="Search by patient name or condition..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3, bgcolor: 'white', borderRadius: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#0062ff' }} />
              </InputAdornment>
            )
          }}
        />

        {history.length === 0 ? (
          <Card sx={{ borderRadius: 4, boxShadow: 2, p: 6, textAlign: 'center' }}>
            <History sx={{ fontSize: 80, color: '#e2e8f0', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">No patient history yet!</Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              History will appear here after patients connect with you.
            </Typography>
          </Card>
        ) : (
          <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0' }}>
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell><strong>Patient</strong></TableCell>
                    <TableCell><strong>Condition</strong></TableCell>
                    <TableCell><strong>Visit Date & Time</strong></TableCell>
                    <TableCell><strong>Prescription</strong></TableCell>
                    <TableCell><strong>Next Visit</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((visit) => {
                    const statusStyle = getStatusStyle(visit.status);
                    return (
                      <TableRow key={visit.id} hover sx={{ '&:hover': { bgcolor: '#f0f7ff' } }}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar sx={{ bgcolor: '#0062ff', width: 38, height: 38, fontSize: 15, fontWeight: 'bold' }}>
                              {visit.patientName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography fontWeight="bold" sx={{ fontSize: '0.9rem' }}>{visit.patientName}</Typography>
                              <Typography variant="caption" color="textSecondary">{visit.age} yrs • {visit.gender}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={visit.condition} size="small" sx={{ bgcolor: '#fce4ec', color: '#c62828', fontWeight: 600 }} />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" flexDirection="column" gap={0.3}>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <CalendarToday sx={{ fontSize: 14, color: '#64748b' }} />
                              <Typography variant="body2" fontWeight="bold">{visit.visitDate}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <AccessTime sx={{ fontSize: 14, color: '#64748b' }} />
                              <Typography variant="caption" color="textSecondary">{visit.visitTime}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>{visit.prescription}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" sx={{ color: '#0062ff' }}>{visit.nextVisit}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={visit.status} size="small" sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 700 }} />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small" variant="outlined"
                            startIcon={<Visibility />}
                            onClick={() => navigate(`/doctor/patient/${visit.patientId}`)}
                            sx={{ borderColor: '#0062ff', color: '#0062ff', fontWeight: 700, borderRadius: 2, '&:hover': { bgcolor: '#e3f2fd' } }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default PatientHistory;