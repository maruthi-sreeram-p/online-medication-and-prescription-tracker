// // import React, { useState } from 'react';
// // import {
// //   Box, Container, Typography, Card, CardContent,
// //   Grid, Avatar, Chip, Button, LinearProgress,
// //   Table, TableBody, TableCell, TableContainer,
// //   TableHead, TableRow, Paper, Divider
// // } from '@mui/material';
// // import {
// //   ArrowBack, Person, Medication,
// //   CheckCircle, Cancel, AccessTime,
// //   CalendarToday, LocalHospital
// // } from '@mui/icons-material';
// // import { useNavigate, useParams } from 'react-router-dom';
// // import {
// //   BarChart, Bar, XAxis, YAxis,
// //   CartesianGrid, Tooltip, Legend,
// //   ResponsiveContainer
// // } from 'recharts';

// // /**
// //  * PATIENT DETAIL PAGE
// //  * Purpose: Shows complete patient info + medication tracking
// //  * Features:
// //  * - Patient profile
// //  * - Current prescription
// //  * - 🟢🟡🔴 Medication tracking status
// //  * - Day-wise bar chart
// //  */
// // const PatientDetail = () => {
// //   const navigate = useNavigate();
// //   const { patientId } = useParams();

// //   // MOCK DATA (Replace with API later)
// //   const patient = {
// //     id: 1,
// //     name: 'Namitha Ganji',
// //     age: 25,
// //     gender: 'Female',
// //     condition: 'Diabetes',
// //     phone: '9876543210',
// //     email: 'namitha@gmail.com',
// //     bloodGroup: 'B+',
// //     adherence: 85,
// //     totalDays: 7,
// //     completedDays: 5,
// //     caretakerType: 'SELF',
// //     caretakerName: '-'
// //   };

// //   // Today's medication schedule with status
// //   const [todaySchedule] = useState([
// //     {
// //       id: 1,
// //       medicine: 'Dolo 650',
// //       dosage: '650mg',
// //       slot: 'Morning',
// //       time: '7:00 AM - 9:00 AM',
// //       meal: 'After Meal',
// //       status: 'ON_TIME', // ON_TIME, LATE, MISSED, PENDING
// //       markedAt: '8:15 AM'
// //     },
// //     {
// //       id: 2,
// //       medicine: 'Metformin',
// //       dosage: '500mg',
// //       slot: 'Morning',
// //       time: '7:00 AM - 9:00 AM',
// //       meal: 'After Meal',
// //       status: 'LATE',
// //       markedAt: '10:30 AM'
// //     },
// //     {
// //       id: 3,
// //       medicine: 'Dolo 650',
// //       dosage: '650mg',
// //       slot: 'Afternoon',
// //       time: '12:00 PM - 1:00 PM',
// //       meal: 'After Meal',
// //       status: 'MISSED',
// //       markedAt: '-'
// //     },
// //     {
// //       id: 4,
// //       medicine: 'Metformin',
// //       dosage: '500mg',
// //       slot: 'Afternoon',
// //       time: '12:00 PM - 1:00 PM',
// //       meal: 'After Meal',
// //       status: 'PENDING',
// //       markedAt: '-'
// //     },
// //     {
// //       id: 5,
// //       medicine: 'Dolo 650',
// //       dosage: '650mg',
// //       slot: 'Night',
// //       time: '9:00 PM - 10:00 PM',
// //       meal: 'After Meal',
// //       status: 'PENDING',
// //       markedAt: '-'
// //     }
// //   ]);

// //   // Day-wise chart data
// //   const dayWiseData = [
// //     { day: 'Day 1', onTime: 3, late: 0, missed: 0 },
// //     { day: 'Day 2', onTime: 2, late: 1, missed: 0 },
// //     { day: 'Day 3', onTime: 3, late: 0, missed: 0 },
// //     { day: 'Day 4', onTime: 1, late: 1, missed: 1 },
// //     { day: 'Day 5', onTime: 2, late: 0, missed: 1 },
// //     { day: 'Day 6', onTime: 0, late: 0, missed: 0 },
// //     { day: 'Day 7', onTime: 0, late: 0, missed: 0 },
// //   ];

// //   // Status styles
// //   const getStatusStyle = (status) => {
// //     switch (status) {
// //       case 'ON_TIME': return { bg: '#e8f5e9', color: '#2e7d32', label: '✅ On Time', icon: <CheckCircle sx={{ fontSize: 16 }} /> };
// //       case 'LATE': return { bg: '#fff8e1', color: '#f57f17', label: '⚠️ Late', icon: <AccessTime sx={{ fontSize: 16 }} /> };
// //       case 'MISSED': return { bg: '#ffebee', color: '#d32f2f', label: '❌ Missed', icon: <Cancel sx={{ fontSize: 16 }} /> };
// //       case 'PENDING': return { bg: '#f8fafc', color: '#64748b', label: '⏳ Pending', icon: <AccessTime sx={{ fontSize: 16 }} /> };
// //       default: return { bg: '#f8fafc', color: '#64748b', label: 'Unknown' };
// //     }
// //   };

// //   // Slot icon
// //   const getSlotIcon = (slot) => {
// //     if (slot === 'Morning') return '🌅';
// //     if (slot === 'Afternoon') return '☀️';
// //     return '🌙';
// //   };

// //   return (
// //     <Box sx={{ py: 4, px: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
// //       <Container maxWidth="xl">

// //         {/* Back Button */}
// //         <Button
// //           startIcon={<ArrowBack />}
// //           onClick={() => navigate('/doctor/patients')}
// //           sx={{ mb: 3, color: '#0062ff', fontWeight: 700 }}
// //         >
// //           Back to Patients
// //         </Button>

// //         {/* Patient Profile Card */}
// //         <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0', mb: 3, bgcolor: '#0062ff' }}>
// //           <CardContent sx={{ p: 3 }}>
// //             <Grid container spacing={3} alignItems="center">

// //               {/* Avatar + Name */}
// //               <Grid item xs={12} md={4}>
// //                 <Box display="flex" alignItems="center" gap={2}>
// //                   <Avatar sx={{ bgcolor: 'white', color: '#0062ff', width: 70, height: 70, fontSize: 28, fontWeight: 'bold' }}>
// //                     {patient.name.charAt(0)}
// //                   </Avatar>
// //                   <Box>
// //                     <Typography variant="h5" fontWeight={900} sx={{ color: 'white' }}>
// //                       {patient.name}
// //                     </Typography>
// //                     <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
// //                       {patient.age} yrs • {patient.gender}
// //                     </Typography>
// //                     <Chip
// //                       label={patient.condition}
// //                       size="small"
// //                       sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mt: 0.5, fontWeight: 700 }}
// //                     />
// //                   </Box>
// //                 </Box>
// //               </Grid>

// //               {/* Details */}
// //               <Grid item xs={12} md={4}>
// //                 <Box display="flex" flexDirection="column" gap={1}>
// //                   <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
// //                     📞 {patient.phone}
// //                   </Typography>
// //                   <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
// //                     📧 {patient.email}
// //                   </Typography>
// //                   <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
// //                     🩸 Blood Group: {patient.bloodGroup}
// //                   </Typography>
// //                   <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
// //                     👤 Caretaker: {patient.caretakerType === 'SELF' ? 'Self' : patient.caretakerName}
// //                   </Typography>
// //                 </Box>
// //               </Grid>

// //               {/* Adherence */}
// //               <Grid item xs={12} md={4}>
// //                 <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 3, p: 2 }}>
// //                   <Box display="flex" justifyContent="space-between" mb={1}>
// //                     <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
// //                       Medication Adherence
// //                     </Typography>
// //                     <Typography sx={{ color: 'white', fontWeight: 900 }}>
// //                       {patient.adherence}%
// //                     </Typography>
// //                   </Box>
// //                   <LinearProgress
// //                     variant="determinate"
// //                     value={patient.adherence}
// //                     sx={{
// //                       height: 10,
// //                       borderRadius: 5,
// //                       bgcolor: 'rgba(255,255,255,0.3)',
// //                       '& .MuiLinearProgress-bar': { bgcolor: 'white', borderRadius: 5 }
// //                     }}
// //                   />
// //                   <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', mt: 1 }}>
// //                     Day {patient.completedDays} of {patient.totalDays}
// //                   </Typography>
// //                 </Box>
// //               </Grid>
// //             </Grid>
// //           </CardContent>
// //         </Card>

// //         {/* Main Content */}
// //         <Grid container spacing={3}>

// //           {/* Today's Schedule */}
// //           <Grid item xs={12} lg={7}>
// //             <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0' }}>
// //               <CardContent sx={{ p: 3 }}>
// //                 <Box display="flex" alignItems="center" gap={1} mb={3}>
// //                   <Medication sx={{ color: '#0062ff' }} />
// //                   <Typography variant="h6" fontWeight="bold">
// //                     Today's Medication Schedule
// //                   </Typography>
// //                   <Chip
// //                     label="Feb 17, 2026"
// //                     size="small"
// //                     sx={{ bgcolor: '#e3f2fd', color: '#0062ff', fontWeight: 700, ml: 'auto' }}
// //                   />
// //                 </Box>

// //                 <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: 3 }}>
// //                   <Table>
// //                     <TableHead sx={{ bgcolor: '#f8fafc' }}>
// //                       <TableRow>
// //                         <TableCell><strong>Time Slot</strong></TableCell>
// //                         <TableCell><strong>Medicine</strong></TableCell>
// //                         <TableCell><strong>Instructions</strong></TableCell>
// //                         <TableCell><strong>Status</strong></TableCell>
// //                         <TableCell><strong>Marked At</strong></TableCell>
// //                       </TableRow>
// //                     </TableHead>
// //                     <TableBody>
// //                       {todaySchedule.map((item) => {
// //                         const style = getStatusStyle(item.status);
// //                         return (
// //                           <TableRow
// //                             key={item.id}
// //                             sx={{ bgcolor: item.status === 'MISSED' ? '#fff5f5' : 'white' }}
// //                           >
// //                             {/* Time Slot */}
// //                             <TableCell>
// //                               <Box display="flex" alignItems="center" gap={1}>
// //                                 <Typography>{getSlotIcon(item.slot)}</Typography>
// //                                 <Box>
// //                                   <Typography fontWeight="bold" sx={{ fontSize: '0.85rem' }}>
// //                                     {item.slot}
// //                                   </Typography>
// //                                   <Typography variant="caption" color="textSecondary">
// //                                     {item.time}
// //                                   </Typography>
// //                                 </Box>
// //                               </Box>
// //                             </TableCell>

// //                             {/* Medicine */}
// //                             <TableCell>
// //                               <Typography fontWeight="bold" sx={{ fontSize: '0.85rem' }}>
// //                                 {item.medicine}
// //                               </Typography>
// //                               <Chip
// //                                 label={item.dosage}
// //                                 size="small"
// //                                 sx={{ bgcolor: '#e3f2fd', color: '#0062ff', fontWeight: 600, mt: 0.3 }}
// //                               />
// //                             </TableCell>

// //                             {/* Instructions */}
// //                             <TableCell>
// //                               <Typography variant="caption" color="textSecondary">
// //                                 {item.meal}
// //                               </Typography>
// //                             </TableCell>

// //                             {/* Status */}
// //                             <TableCell>
// //                               <Chip
// //                                 label={style.label}
// //                                 size="small"
// //                                 sx={{
// //                                   bgcolor: style.bg,
// //                                   color: style.color,
// //                                   fontWeight: 700,
// //                                   fontSize: '0.75rem'
// //                                 }}
// //                               />
// //                             </TableCell>

// //                             {/* Marked At */}
// //                             <TableCell>
// //                               <Typography variant="caption" fontWeight="bold" sx={{ color: '#64748b' }}>
// //                                 {item.markedAt}</Typography>
// //                               </TableCell>
// //                           </TableRow>
// //                         );
// //                       })}
// //                     </TableBody>
// //                   </Table>
// //                 </TableContainer>

// //                 {/* Legend */}
// //                 <Box display="flex" gap={2} mt={2} flexWrap="wrap">
// //                   <Chip label="✅ On Time" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700 }} />
// //                   <Chip label="⚠️ Late" size="small" sx={{ bgcolor: '#fff8e1', color: '#f57f17', fontWeight: 700 }} />
// //                   <Chip label="❌ Missed" size="small" sx={{ bgcolor: '#ffebee', color: '#d32f2f', fontWeight: 700 }} />
// //                   <Chip label="⏳ Pending" size="small" sx={{ bgcolor: '#f8fafc', color: '#64748b', fontWeight: 700 }} />
// //                 </Box>
// //               </CardContent>
// //             </Card>
// //           </Grid>

// //           {/* Day-wise Chart */}
// //           <Grid item xs={12} lg={5}>
// //             <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0' }}>
// //               <CardContent sx={{ p: 3 }}>
// //                 <Typography variant="h6" fontWeight="bold" mb={3}>
// //                   📊 Day-wise Tracking
// //                 </Typography>
// //                 <ResponsiveContainer width="100%" height={250}>
// //                   <BarChart data={dayWiseData}>
// //                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
// //                     <XAxis dataKey="day" tick={{ fontSize: 11 }} />
// //                     <YAxis tick={{ fontSize: 11 }} />
// //                     <Tooltip />
// //                     <Legend />
// //                     <Bar dataKey="onTime" name="On Time" fill="#2e7d32" radius={[4, 4, 0, 0]} />
// //                     <Bar dataKey="late" name="Late" fill="#f57f17" radius={[4, 4, 0, 0]} />
// //                     <Bar dataKey="missed" name="Missed" fill="#d32f2f" radius={[4, 4, 0, 0]} />
// //                   </BarChart>
// //                 </ResponsiveContainer>

// //                 {/* Summary */}
// //                 <Divider sx={{ my: 2 }} />
// //                 <Grid container spacing={1}>
// //                   <Grid item xs={4}>
// //                     <Box textAlign="center" sx={{ p: 1.5, bgcolor: '#e8f5e9', borderRadius: 2 }}>
// //                       <Typography fontWeight={900} sx={{ color: '#2e7d32' }}>11</Typography>
// //                       <Typography variant="caption" sx={{ color: '#2e7d32' }}>On Time</Typography>
// //                     </Box>
// //                   </Grid>
// //                   <Grid item xs={4}>
// //                     <Box textAlign="center" sx={{ p: 1.5, bgcolor: '#fff8e1', borderRadius: 2 }}>
// //                       <Typography fontWeight={900} sx={{ color: '#f57f17' }}>2</Typography>
// //                       <Typography variant="caption" sx={{ color: '#f57f17' }}>Late</Typography>
// //                     </Box>
// //                   </Grid>
// //                   <Grid item xs={4}>
// //                     <Box textAlign="center" sx={{ p: 1.5, bgcolor: '#ffebee', borderRadius: 2 }}>
// //                       <Typography fontWeight={900} sx={{ color: '#d32f2f' }}>2</Typography>
// //                       <Typography variant="caption" sx={{ color: '#d32f2f' }}>Missed</Typography>
// //                     </Box>
// //                   </Grid>
// //                 </Grid>
// //               </CardContent>
// //             </Card>
// //           </Grid>
// //         </Grid>
// //       </Container>
// //     </Box>
// //   );
// // };

// // export default PatientDetail;
// import React, { useState, useEffect } from 'react';
// import {
//   Box, Container, Typography, Card, CardContent,
//   Grid, Avatar, Chip, Button, LinearProgress,
//   Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Paper, Divider, CircularProgress
// } from '@mui/material';
// import {
//   ArrowBack, Medication, CheckCircle,
//   Cancel, AccessTime, CalendarToday
// } from '@mui/icons-material';
// import { useNavigate, useParams } from 'react-router-dom';
// import {
//   BarChart, Bar, XAxis, YAxis,
//   CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from 'recharts';
// import api from '../../services/api';

// const PatientDetail = () => {
//   const navigate = useNavigate();
//   const { patientId } = useParams();
//   const doctorId = localStorage.getItem('userId');

//   const [loading, setLoading] = useState(true);
//   const [patient, setPatient] = useState(null);
//   const [todaySchedule, setTodaySchedule] = useState([]);
//   const [dayWiseData, setDayWiseData] = useState([]);

//   useEffect(() => {
//     fetchPatientDetail();
//     fetchTodaySchedule();
//     fetchHistory();
//   }, [patientId]);

//   const fetchPatientDetail = async () => {
//     try {
//       const res = await api.get(`/doctors/${doctorId}/patients/${patientId}`);
//       setPatient(res.data);
//     } catch (err) {
//       console.error('Patient detail error:', err);
//     }
//   };

//   const fetchTodaySchedule = async () => {
//     try {
//       const res = await api.get(`/tracking/${patientId}/today`);
//       const mapped = res.data.map(t => ({
//         id: t.id,
//         medicine: t.medicineName,
//         dosage: t.dosage,
//         slot: t.slot === 'MORNING' ? 'Morning' : t.slot === 'AFTERNOON' ? 'Afternoon' : 'Night',
//         time: `${t.timeStart || '07:00'} - ${t.timeEnd || '09:00'}`,
//         meal: t.meal || 'After Meal',
//         status: t.status,
//         markedAt: t.markedAt
//           ? new Date(t.markedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
//           : '-'
//       }));
//       setTodaySchedule(mapped);
//     } catch (err) {
//       setTodaySchedule([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchHistory = async () => {
//     try {
//       const res = await api.get(`/tracking/${patientId}/history`);
//       // Group by date and count statuses
//       const grouped = {};
//       res.data.forEach(t => {
//         const day = t.trackingDate || 'Day 1';
//         if (!grouped[day]) grouped[day] = { day, onTime: 0, late: 0, missed: 0 };
//         if (t.status === 'ON_TIME') grouped[day].onTime++;
//         else if (t.status === 'LATE') grouped[day].late++;
//         else if (t.status === 'MISSED') grouped[day].missed++;
//       });
//       const chartData = Object.values(grouped).slice(0, 7).map((d, i) => ({
//         ...d,
//         day: `Day ${i + 1}`
//       }));
//       setDayWiseData(chartData.length > 0 ? chartData : [
//         { day: 'Day 1', onTime: 0, late: 0, missed: 0 },
//         { day: 'Day 2', onTime: 0, late: 0, missed: 0 },
//         { day: 'Day 3', onTime: 0, late: 0, missed: 0 },
//         { day: 'Day 4', onTime: 0, late: 0, missed: 0 },
//         { day: 'Day 5', onTime: 0, late: 0, missed: 0 },
//         { day: 'Day 6', onTime: 0, late: 0, missed: 0 },
//         { day: 'Day 7', onTime: 0, late: 0, missed: 0 },
//       ]);
//     } catch (err) {
//       setDayWiseData([
//         { day: 'Day 1', onTime: 0, late: 0, missed: 0 },
//         { day: 'Day 2', onTime: 0, late: 0, missed: 0 },
//         { day: 'Day 3', onTime: 0, late: 0, missed: 0 },
//         { day: 'Day 4', onTime: 0, late: 0, missed: 0 },
//         { day: 'Day 5', onTime: 0, late: 0, missed: 0 },
//         { day: 'Day 6', onTime: 0, late: 0, missed: 0 },
//         { day: 'Day 7', onTime: 0, late: 0, missed: 0 },
//       ]);
//     }
//   };

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case 'ON_TIME': return { bg: '#e8f5e9', color: '#2e7d32', label: '✅ On Time' };
//       case 'LATE': return { bg: '#fff8e1', color: '#f57f17', label: '⚠️ Late' };
//       case 'MISSED': return { bg: '#ffebee', color: '#d32f2f', label: '❌ Missed' };
//       case 'PENDING': return { bg: '#f8fafc', color: '#64748b', label: '⏳ Pending' };
//       default: return { bg: '#f8fafc', color: '#64748b', label: 'Unknown' };
//     }
//   };

//   const getSlotIcon = (slot) => {
//     if (slot === 'Morning') return '🌅';
//     if (slot === 'Afternoon') return '☀️';
//     return '🌙';
//   };

//   const onTime = todaySchedule.filter(t => t.status === 'ON_TIME').length;
//   const late = todaySchedule.filter(t => t.status === 'LATE').length;
//   const missed = todaySchedule.filter(t => t.status === 'MISSED').length;

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//         <CircularProgress sx={{ color: '#0062ff' }} />
//       </Box>
//     );
//   }

//   if (!patient) {
//     return (
//       <Box textAlign="center" pt={8}>
//         <Typography variant="h6" color="textSecondary">Patient not found.</Typography>
//         <Button onClick={() => navigate('/doctor/patients')} sx={{ mt: 2 }}>← Back to Patients</Button>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ py: 4, px: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
//       <Container maxWidth="xl">

//         <Button
//           startIcon={<ArrowBack />}
//           onClick={() => navigate('/doctor/patients')}
//           sx={{ mb: 3, color: '#0062ff', fontWeight: 700 }}
//         >
//           Back to Patients
//         </Button>

//         {/* Patient Profile Card */}
//         <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0', mb: 3, bgcolor: '#0062ff' }}>
//           <CardContent sx={{ p: 3 }}>
//             <Grid container spacing={3} alignItems="center">
//               <Grid item xs={12} md={4}>
//                 <Box display="flex" alignItems="center" gap={2}>
//                   <Avatar sx={{ bgcolor: 'white', color: '#0062ff', width: 70, height: 70, fontSize: 28, fontWeight: 'bold' }}>
//                     {patient.name.charAt(0)}
//                   </Avatar>
//                   <Box>
//                     <Typography variant="h5" fontWeight={900} sx={{ color: 'white' }}>{patient.name}</Typography>
//                     <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>{patient.age} yrs • {patient.gender}</Typography>
//                     <Chip
//                       label={patient.condition || 'Patient'}
//                       size="small"
//                       sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mt: 0.5, fontWeight: 700 }}
//                     />
//                   </Box>
//                 </Box>
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <Box display="flex" flexDirection="column" gap={1}>
//                   <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>📞 {patient.phone || 'N/A'}</Typography>
//                   <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>📧 {patient.email}</Typography>
//                   <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>🩸 Blood Group: {patient.bloodGroup || 'N/A'}</Typography>
//                   <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
//                     👤 Caretaker: {patient.caretakerType === 'SELF' || !patient.caretakerType ? 'Self' : patient.caretakerName || 'N/A'}
//                   </Typography>
//                 </Box>
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 3, p: 2 }}>
//                   <Box display="flex" justifyContent="space-between" mb={1}>
//                     <Typography sx={{ color: 'white', fontWeight: 'bold' }}>Medication Adherence</Typography>
//                     <Typography sx={{ color: 'white', fontWeight: 900 }}>{patient.adherencePercentage || 0}%</Typography>
//                   </Box>
//                   <LinearProgress
//                     variant="determinate"
//                     value={patient.adherencePercentage || 0}
//                     sx={{
//                       height: 10, borderRadius: 5,
//                       bgcolor: 'rgba(255,255,255,0.3)',
//                       '& .MuiLinearProgress-bar': { bgcolor: 'white', borderRadius: 5 }
//                     }}
//                   />
//                   <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', mt: 1 }}>
//                     Day {patient.completedDays || 0} of {patient.totalDays || 7}
//                   </Typography>
//                 </Box>
//               </Grid>
//             </Grid>
//           </CardContent>
//         </Card>

//         <Grid container spacing={3}>
//           {/* Today's Schedule */}
//           <Grid item xs={12} lg={7}>
//             <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0' }}>
//               <CardContent sx={{ p: 3 }}>
//                 <Box display="flex" alignItems="center" gap={1} mb={3}>
//                   <Medication sx={{ color: '#0062ff' }} />
//                   <Typography variant="h6" fontWeight="bold">Today's Medication Schedule</Typography>
//                   <Chip
//                     label={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
//                     size="small"
//                     sx={{ bgcolor: '#e3f2fd', color: '#0062ff', fontWeight: 700, ml: 'auto' }}
//                   />
//                 </Box>

//                 {todaySchedule.length === 0 ? (
//                   <Box textAlign="center" py={4}>
//                     <Medication sx={{ fontSize: 60, color: '#e2e8f0', mb: 1 }} />
//                     <Typography color="textSecondary">No medications tracked today yet</Typography>
//                   </Box>
//                 ) : (
//                   <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: 3 }}>
//                     <Table>
//                       <TableHead sx={{ bgcolor: '#f8fafc' }}>
//                         <TableRow>
//                           <TableCell><strong>Time Slot</strong></TableCell>
//                           <TableCell><strong>Medicine</strong></TableCell>
//                           <TableCell><strong>Instructions</strong></TableCell>
//                           <TableCell><strong>Status</strong></TableCell>
//                           <TableCell><strong>Marked At</strong></TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {todaySchedule.map((item) => {
//                           const style = getStatusStyle(item.status);
//                           return (
//                             <TableRow key={item.id} sx={{ bgcolor: item.status === 'MISSED' ? '#fff5f5' : 'white' }}>
//                               <TableCell>
//                                 <Box display="flex" alignItems="center" gap={1}>
//                                   <Typography>{getSlotIcon(item.slot)}</Typography>
//                                   <Box>
//                                     <Typography fontWeight="bold" sx={{ fontSize: '0.85rem' }}>{item.slot}</Typography>
//                                     <Typography variant="caption" color="textSecondary">{item.time}</Typography>
//                                   </Box>
//                                 </Box>
//                               </TableCell>
//                               <TableCell>
//                                 <Typography fontWeight="bold" sx={{ fontSize: '0.85rem' }}>{item.medicine}</Typography>
//                                 <Chip label={item.dosage} size="small" sx={{ bgcolor: '#e3f2fd', color: '#0062ff', fontWeight: 600, mt: 0.3 }} />
//                               </TableCell>
//                               <TableCell>
//                                 <Typography variant="caption" color="textSecondary">{item.meal}</Typography>
//                               </TableCell>
//                               <TableCell>
//                                 <Chip
//                                   label={style.label}
//                                   size="small"
//                                   sx={{ bgcolor: style.bg, color: style.color, fontWeight: 700, fontSize: '0.75rem' }}
//                                 />
//                               </TableCell>
//                               <TableCell>
//                                 <Typography variant="caption" fontWeight="bold" sx={{ color: '#64748b' }}>{item.markedAt}</Typography>
//                               </TableCell>
//                             </TableRow>
//                           );
//                         })}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 )}

//                 <Box display="flex" gap={2} mt={2} flexWrap="wrap">
//                   <Chip label="✅ On Time" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700 }} />
//                   <Chip label="⚠️ Late" size="small" sx={{ bgcolor: '#fff8e1', color: '#f57f17', fontWeight: 700 }} />
//                   <Chip label="❌ Missed" size="small" sx={{ bgcolor: '#ffebee', color: '#d32f2f', fontWeight: 700 }} />
//                   <Chip label="⏳ Pending" size="small" sx={{ bgcolor: '#f8fafc', color: '#64748b', fontWeight: 700 }} />
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>

//           {/* Day-wise Chart */}
//           <Grid item xs={12} lg={5}>
//             <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0' }}>
//               <CardContent sx={{ p: 3 }}>
//                 <Typography variant="h6" fontWeight="bold" mb={3}>📊 Day-wise Tracking</Typography>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <BarChart data={dayWiseData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                     <XAxis dataKey="day" tick={{ fontSize: 11 }} />
//                     <YAxis tick={{ fontSize: 11 }} />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="onTime" name="On Time" fill="#2e7d32" radius={[4, 4, 0, 0]} />
//                     <Bar dataKey="late" name="Late" fill="#f57f17" radius={[4, 4, 0, 0]} />
//                     <Bar dataKey="missed" name="Missed" fill="#d32f2f" radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//                 <Divider sx={{ my: 2 }} />
//                 <Grid container spacing={1}>
//                   <Grid item xs={4}>
//                     <Box textAlign="center" sx={{ p: 1.5, bgcolor: '#e8f5e9', borderRadius: 2 }}>
//                       <Typography fontWeight={900} sx={{ color: '#2e7d32' }}>{onTime}</Typography>
//                       <Typography variant="caption" sx={{ color: '#2e7d32' }}>On Time</Typography>
//                     </Box>
//                   </Grid>
//                   <Grid item xs={4}>
//                     <Box textAlign="center" sx={{ p: 1.5, bgcolor: '#fff8e1', borderRadius: 2 }}>
//                       <Typography fontWeight={900} sx={{ color: '#f57f17' }}>{late}</Typography>
//                       <Typography variant="caption" sx={{ color: '#f57f17' }}>Late</Typography>
//                     </Box>
//                   </Grid>
//                   <Grid item xs={4}>
//                     <Box textAlign="center" sx={{ p: 1.5, bgcolor: '#ffebee', borderRadius: 2 }}>
//                       <Typography fontWeight={900} sx={{ color: '#d32f2f' }}>{missed}</Typography>
//                       <Typography variant="caption" sx={{ color: '#d32f2f' }}>Missed</Typography>
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default PatientDetail;

import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent,
  Grid, Avatar, Chip, Button, LinearProgress,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Divider, CircularProgress
} from '@mui/material';
import {
  ArrowBack, Medication, CheckCircle,
  Cancel, AccessTime, CalendarToday
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../../services/api';

const PatientDetail = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const doctorId = localStorage.getItem('userId');

  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [dayWiseData, setDayWiseData] = useState([]); // ✅ empty by default — no fake data

  useEffect(() => {
    fetchPatientDetail();
    fetchTodaySchedule();
    fetchHistory();
  }, [patientId]);

  const fetchPatientDetail = async () => {
    try {
      const res = await api.get(`/doctors/${doctorId}/patients/${patientId}`);
      setPatient(res.data);
    } catch (err) {
      console.error('Patient detail error:', err);
    }
  };

  const fetchTodaySchedule = async () => {
    try {
      const res = await api.get(`/tracking/${patientId}/today`);
      const mapped = (res.data || []).map(t => ({
        id: t.id,
        medicine: t.medicineName,
        dosage: t.dosage,
        slot: t.slot === 'MORNING' ? 'Morning' : t.slot === 'AFTERNOON' ? 'Afternoon' : 'Night',
        time: `${t.timeStart || '07:00'} - ${t.timeEnd || '09:00'}`,
        meal: t.meal ? (t.meal === 'before' ? 'Before Meal' : 'After Meal') : 'After Meal',
        status: t.status,
        markedAt: t.markedAt
          ? new Date(t.markedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : '-'
      }));
      setTodaySchedule(mapped);
    } catch (err) {
      setTodaySchedule([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/tracking/${patientId}/history`);
      const data = res.data || [];

      if (data.length === 0) {
        setDayWiseData([]); // ✅ no fake data
        return;
      }

      // Group by date, last 7 days
      const grouped = {};
      data.forEach(t => {
        const day = t.trackingDate || 'today';
        if (!grouped[day]) grouped[day] = { onTime: 0, late: 0, missed: 0 };
        if (t.status === 'ON_TIME') grouped[day].onTime++;
        else if (t.status === 'LATE') grouped[day].late++;
        else if (t.status === 'MISSED') grouped[day].missed++;
      });

      const chartData = Object.keys(grouped).sort().slice(-7).map((date, i) => ({
        day: `Day ${i + 1}`,
        onTime: grouped[date].onTime,
        late: grouped[date].late,
        missed: grouped[date].missed
      }));

      setDayWiseData(chartData);
    } catch (err) {
      setDayWiseData([]); // ✅ no fake data on error
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ON_TIME': return { bg: '#e8f5e9', color: '#2e7d32', label: '✅ On Time' };
      case 'LATE':    return { bg: '#fff8e1', color: '#f57f17', label: '⚠️ Late' };
      case 'MISSED':  return { bg: '#ffebee', color: '#d32f2f', label: '❌ Missed' };
      case 'PENDING': return { bg: '#f8fafc', color: '#64748b', label: '⏳ Pending' };
      default:        return { bg: '#f8fafc', color: '#64748b', label: 'Unknown' };
    }
  };

  const getSlotIcon = (slot) => {
    if (slot === 'Morning') return '🌅';
    if (slot === 'Afternoon') return '☀️';
    return '🌙';
  };

  const onTime  = todaySchedule.filter(t => t.status === 'ON_TIME').length;
  const late    = todaySchedule.filter(t => t.status === 'LATE').length;
  const missed  = todaySchedule.filter(t => t.status === 'MISSED').length;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress sx={{ color: '#0062ff' }} />
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box textAlign="center" pt={8}>
        <Typography variant="h6" color="textSecondary">Patient not found.</Typography>
        <Button onClick={() => navigate('/doctor/patients')} sx={{ mt: 2 }}>← Back to Patients</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="xl">

        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/doctor/patients')}
          sx={{ mb: 3, color: '#0062ff', fontWeight: 700 }}
        >
          Back to Patients
        </Button>

        {/* Patient Profile Card */}
        <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0', mb: 3, bgcolor: '#0062ff' }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'white', color: '#0062ff', width: 70, height: 70, fontSize: 28, fontWeight: 'bold' }}>
                    {patient.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={900} sx={{ color: 'white' }}>{patient.name}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>{patient.age} yrs • {patient.gender}</Typography>
                    <Chip
                      label={patient.condition || 'Patient'}
                      size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mt: 0.5, fontWeight: 700 }}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>📞 {patient.phone || 'N/A'}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>📧 {patient.email}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>🩸 Blood Group: {patient.bloodGroup || 'N/A'}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                    👤 Caretaker: {patient.caretakerType === 'SELF' || !patient.caretakerType ? 'Self' : patient.caretakerName || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 3, p: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography sx={{ color: 'white', fontWeight: 'bold' }}>Medication Adherence</Typography>
                    <Typography sx={{ color: 'white', fontWeight: 900 }}>{patient.adherencePercentage || 0}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={patient.adherencePercentage || 0}
                    sx={{
                      height: 10, borderRadius: 5,
                      bgcolor: 'rgba(255,255,255,0.3)',
                      '& .MuiLinearProgress-bar': { bgcolor: 'white', borderRadius: 5 }
                    }}
                  />
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', mt: 1 }}>
                    Day {patient.completedDays || 0} of {patient.totalDays || 0}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={3}>

          {/* Today's Schedule */}
          <Grid item xs={12} lg={7}>
            <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <Medication sx={{ color: '#0062ff' }} />
                  <Typography variant="h6" fontWeight="bold">Today's Medication Schedule</Typography>
                  <Chip
                    label={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    size="small"
                    sx={{ bgcolor: '#e3f2fd', color: '#0062ff', fontWeight: 700, ml: 'auto' }}
                  />
                </Box>

                {todaySchedule.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <Medication sx={{ fontSize: 60, color: '#e2e8f0', mb: 1 }} />
                    <Typography color="textSecondary" fontWeight="bold">No medications tracked today yet</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Medicines will appear here after the patient's prescription is active
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: 3 }}>
                    <Table>
                      <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                          <TableCell><strong>Time Slot</strong></TableCell>
                          <TableCell><strong>Medicine</strong></TableCell>
                          <TableCell><strong>Instructions</strong></TableCell>
                          <TableCell><strong>Status</strong></TableCell>
                          <TableCell><strong>Marked At</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {todaySchedule.map((item) => {
                          const style = getStatusStyle(item.status);
                          return (
                            <TableRow key={item.id} sx={{ bgcolor: item.status === 'MISSED' ? '#fff5f5' : 'white' }}>
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Typography>{getSlotIcon(item.slot)}</Typography>
                                  <Box>
                                    <Typography fontWeight="bold" sx={{ fontSize: '0.85rem' }}>{item.slot}</Typography>
                                    <Typography variant="caption" color="textSecondary">{item.time}</Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography fontWeight="bold" sx={{ fontSize: '0.85rem' }}>{item.medicine}</Typography>
                                <Chip label={item.dosage} size="small" sx={{ bgcolor: '#e3f2fd', color: '#0062ff', fontWeight: 600, mt: 0.3 }} />
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption" color="textSecondary">{item.meal}</Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={style.label}
                                  size="small"
                                  sx={{ bgcolor: style.bg, color: style.color, fontWeight: 700, fontSize: '0.75rem' }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption" fontWeight="bold" sx={{ color: '#64748b' }}>{item.markedAt}</Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                <Box display="flex" gap={2} mt={2} flexWrap="wrap">
                  <Chip label="✅ On Time" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700 }} />
                  <Chip label="⚠️ Late" size="small" sx={{ bgcolor: '#fff8e1', color: '#f57f17', fontWeight: 700 }} />
                  <Chip label="❌ Missed" size="small" sx={{ bgcolor: '#ffebee', color: '#d32f2f', fontWeight: 700 }} />
                  <Chip label="⏳ Pending" size="small" sx={{ bgcolor: '#f8fafc', color: '#64748b', fontWeight: 700 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Day-wise Chart */}
          <Grid item xs={12} lg={5}>
            <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>📊 Day-wise Tracking</Typography>

                {/* ✅ Show empty state if no real data yet */}
                {dayWiseData.length === 0 ? (
                  <Box textAlign="center" py={5}>
                    <Typography color="textSecondary" fontWeight="bold">No tracking history yet</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Chart will appear once the patient starts marking medicines
                    </Typography>
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={dayWiseData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="onTime" name="On Time" fill="#2e7d32" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="late" name="Late" fill="#f57f17" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="missed" name="Missed" fill="#d32f2f" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}

                <Divider sx={{ my: 2 }} />
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Box textAlign="center" sx={{ p: 1.5, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                      <Typography fontWeight={900} sx={{ color: '#2e7d32' }}>{onTime}</Typography>
                      <Typography variant="caption" sx={{ color: '#2e7d32' }}>On Time</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box textAlign="center" sx={{ p: 1.5, bgcolor: '#fff8e1', borderRadius: 2 }}>
                      <Typography fontWeight={900} sx={{ color: '#f57f17' }}>{late}</Typography>
                      <Typography variant="caption" sx={{ color: '#f57f17' }}>Late</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box textAlign="center" sx={{ p: 1.5, bgcolor: '#ffebee', borderRadius: 2 }}>
                      <Typography fontWeight={900} sx={{ color: '#d32f2f' }}>{missed}</Typography>
                      <Typography variant="caption" sx={{ color: '#d32f2f' }}>Missed</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PatientDetail;