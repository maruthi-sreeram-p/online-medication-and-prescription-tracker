import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Avatar, Chip, LinearProgress, Button, CircularProgress,
  Alert, Snackbar
} from '@mui/material';
import { Medication, LocalHospital, TrendingUp, FamilyRestroom, Person } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import AiChat from '../../components/common/AiChat';
import api from '../../services/api';

const PatientDashboard = () => {

  const patientId = localStorage.getItem('userId');
  const patientName = localStorage.getItem('name');

  const [loading, setLoading] = useState(true);
  const [todayMeds, setTodayMeds] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [showAI, setShowAI] = useState(false);

  // ✅ FIX: Proper error/success state — no silent catch
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [markingId, setMarkingId] = useState(null);

  const COLORS = ['#2e7d32', '#f57f17', '#d32f2f'];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    fetchTodaySchedule();
    fetchPrescriptions();
  }, []);

  const fetchTodaySchedule = async () => {
    try {
      const res = await api.get(`/tracking/${patientId}/today`);
      const mapped = (res.data || []).map(t => ({
        id: t.id,
        medicine: t.medicineName,
        dosage: t.dosage,
        slot: t.slot,
        time: `${t.timeStart || '07:00'} - ${t.timeEnd || '09:00'}`,
        meal: t.meal === 'before' ? 'Before Meal' : t.meal === 'after' ? 'After Meal' : 'After Meal',
        status: t.status,
        markedAt: t.markedAt
          ? new Date(t.markedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : '-',
        icon: t.slot === 'MORNING' ? '🌅' : t.slot === 'AFTERNOON' ? '☀️' : '🌙',
        prescriptionMedicineId: t.prescriptionMedicineId,
        timeStart: t.timeStart,
        timeEnd: t.timeEnd
      }));
      setTodayMeds(mapped);
    } catch (err) {
      setErrorMsg('Failed to load today\'s medicines. Please refresh.');
      setTodayMeds([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const res = await api.get(`/patients/${patientId}/prescriptions`);
      setPrescriptions(res.data || []);
    } catch (err) {
      setPrescriptions([]);
    }
  };

  // ✅ FIX: Only update UI after confirmed API success
  // Backend decides ON_TIME vs LATE — refresh to get real status
  const handleMarkTaken = async (med) => {
    if (markingId === med.id) return;
    setMarkingId(med.id);
    setErrorMsg('');
    try {
      await api.post(`/tracking/${patientId}/mark`, {
        prescriptionMedicineId: med.prescriptionMedicineId,
        slot: med.slot,
        status: 'ON_TIME'
      });
      await fetchTodaySchedule();
      setSuccessMsg(`✅ ${med.medicine} marked!`);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || '';
      setErrorMsg(msg || `Failed to mark ${med.medicine}. Please try again.`);
    } finally {
      setMarkingId(null);
    }
  };

  // ✅ FIX: Added UPCOMING — slot hasn't opened yet
  const getStatusStyle = (status) => {
    switch (status) {
      case 'ON_TIME':  return { bg: '#e8f5e9', color: '#2e7d32', label: '✅ On Time' };
      case 'LATE':     return { bg: '#fff8e1', color: '#f57f17', label: '⚠️ Late' };
      case 'MISSED':   return { bg: '#ffebee', color: '#d32f2f', label: '❌ Missed' };
      case 'PENDING':  return { bg: '#f0f7ff', color: '#0062ff', label: '⏳ Pending' };
      case 'UPCOMING': return { bg: '#f1f5f9', color: '#94a3b8', label: '🔒 Upcoming' };
      default:         return { bg: '#f8fafc', color: '#64748b', label: 'Unknown' };
    }
  };

  const totalMeds    = todayMeds.length;
  const takenMeds    = todayMeds.filter(m => m.status === 'ON_TIME' || m.status === 'LATE').length;
  const adherencePct = totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 0;
  const onTimeCount  = todayMeds.filter(m => m.status === 'ON_TIME').length;
  const lateCount    = todayMeds.filter(m => m.status === 'LATE').length;
  const missedCount  = todayMeds.filter(m => m.status === 'MISSED').length;

  const adherenceData = [
    { name: 'On Time', value: onTimeCount || 1 },
    { name: 'Late',    value: lateCount },
    { name: 'Missed',  value: missedCount }
  ];

  const latestPrescription = prescriptions.length > 0 ? prescriptions[0] : null;
  const myDoctor = latestPrescription ? { name: latestPrescription.doctorName } : null;

  const getCaretakerDisplay = () => {
    if (!latestPrescription) return {
      icon: <Person sx={{ color: '#0062ff', fontSize: 28 }} />,
      title: 'Self Monitoring',
      desc: 'You are managing your own medicines'
    };
    const type = latestPrescription.caretakerType;
    const name = latestPrescription.caretakerName;
    if (type === 'FAMILY') {
      return {
        icon: <FamilyRestroom sx={{ color: '#0062ff', fontSize: 28 }} />,
        title: `Family: ${name || 'Member'}`,
        desc: latestPrescription.caretakerPhone || 'Monitoring your medicines'
      };
    }
    if (type === 'STAFF') {
      let shifts = {};
      try { shifts = JSON.parse(name || '{}'); } catch (e) {}
      const shiftText = Object.entries(shifts)
        .map(([k, v]) => v.name ? `${k}: ${v.name}` : null)
        .filter(Boolean).join(', ');
      return {
        icon: <LocalHospital sx={{ color: '#d32f2f', fontSize: 28 }} />,
        title: 'Medical Staff',
        desc: shiftText || 'Professional staff monitoring'
      };
    }
    return {
      icon: <Person sx={{ color: '#0062ff', fontSize: 28 }} />,
      title: 'Self Monitoring',
      desc: 'You are managing your own medicines'
    };
  };

  const caretaker = getCaretakerDisplay();

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

        {/* Error & Success feedback */}
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg('')}>{errorMsg}</Alert>
        )}
        <Snackbar
          open={!!successMsg}
          autoHideDuration={3000}
          onClose={() => setSuccessMsg('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setSuccessMsg('')} sx={{ fontWeight: 600 }}>
            {successMsg}
          </Alert>
        </Snackbar>

        {/* HEADER */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>
            {greeting()}, {patientName}! 👋
          </Typography>
          <Typography color="textSecondary">
            Here's your medication schedule for today — {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Typography>
        </Box>

        {/* INFO CARDS */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, border: '1px solid #e3f2fd', boxShadow: '0 4px 20px rgba(0,98,255,0.08)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="overline" fontWeight="bold" color="textSecondary">YOUR CARETAKER</Typography>
                <Box display="flex" alignItems="center" gap={2} mt={1.5}>
                  <Avatar sx={{ bgcolor: '#e3f2fd', width: 50, height: 50 }}>{caretaker.icon}</Avatar>
                  <Box>
                    <Typography fontWeight="bold">{caretaker.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{caretaker.desc}</Typography>
                    <Chip label="✅ Active" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700, mt: 0.5 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, border: '1px solid #e8f5e9', boxShadow: '0 4px 20px rgba(46,125,50,0.08)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="overline" fontWeight="bold" color="textSecondary">MY DOCTOR</Typography>
                {myDoctor ? (
                  <Box display="flex" alignItems="center" gap={2} mt={1.5}>
                    <Avatar sx={{ bgcolor: '#0062ff', width: 50, height: 50, fontWeight: 'bold' }}>
                      {myDoctor.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </Avatar>
                    <Box>
                      <Typography fontWeight="bold">{myDoctor.name}</Typography>
                      <Typography variant="body2" color="textSecondary">🏥 Your Doctor</Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box display="flex" alignItems="center" gap={2} mt={1.5}>
                    <Avatar sx={{ bgcolor: '#e3f2fd', width: 50, height: 50 }}>
                      <LocalHospital sx={{ color: '#0062ff' }} />
                    </Avatar>
                    <Box>
                      <Typography fontWeight="bold" color="textSecondary">No doctor assigned yet</Typography>
                      <Typography variant="body2" color="textSecondary">Send a request to a doctor</Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* STATS ROW */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(46,125,50,0.1)', border: '1px solid #e8f5e9' }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="overline" color="textSecondary" fontWeight="bold">Today's Progress</Typography>
                    <Typography variant="h3" fontWeight={900} sx={{ color: '#2e7d32' }}>
                      {takenMeds}/{totalMeds}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">Medicines taken</Typography>
                  </Box>
                  <Box sx={{ bgcolor: '#e8f5e9', p: 2, borderRadius: 3 }}>
                    <Medication sx={{ fontSize: 40, color: '#2e7d32' }} />
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={adherencePct}
                  sx={{
                    mt: 2, height: 8, borderRadius: 4,
                    bgcolor: '#e8f5e9',
                    '& .MuiLinearProgress-bar': { bgcolor: '#2e7d32', borderRadius: 4 }
                  }}
                />
                <Typography variant="caption" color="textSecondary" mt={0.5} display="block">
                  {adherencePct}% completed today
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,98,255,0.1)', border: '1px solid #e3f2fd' }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="overline" color="textSecondary" fontWeight="bold">Overall Adherence</Typography>
                    <Typography variant="h3" fontWeight={900} sx={{ color: '#0062ff' }}>
                      {adherencePct}%
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {prescriptions.length} prescription(s)
                    </Typography>
                  </Box>
                  <Box sx={{ bgcolor: '#e3f2fd', p: 2, borderRadius: 3 }}>
                    <TrendingUp sx={{ fontSize: 40, color: '#0062ff' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* MAIN CONTENT */}
        <Grid container spacing={3}>

          {/* Today's Schedule */}
          <Grid item xs={12} lg={7}>
            <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>💊 Today's Medication Schedule</Typography>

                {todayMeds.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <Medication sx={{ fontSize: 60, color: '#e2e8f0', mb: 1 }} />
                    <Typography color="textSecondary" fontWeight="bold">No medicines scheduled today</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Medicines will appear here after your doctor creates a prescription
                    </Typography>
                  </Box>
                ) : (
                  <Box display="flex" flexDirection="column" gap={2}>
                    {todayMeds.map((med) => {
                      const style = getStatusStyle(med.status);
                      const isMarking = markingId === med.id;
                      const isMarkable = med.status === 'PENDING';
                      const isUpcoming = med.status === 'UPCOMING';
                      return (
                        <Box
                          key={med.id}
                          sx={{
                            p: 2.5, borderRadius: 3,
                            border: `1px solid ${med.status === 'PENDING' ? '#e2e8f0' : style.bg}`,
                            bgcolor: style.bg,
                            transition: 'all 0.2s',
                            opacity: isUpcoming ? 0.55 : 1
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography fontSize={28}>{med.icon}</Typography>
                            <Box flex={1}>
                              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                <Typography fontWeight="bold" sx={{ color: '#1e293b' }}>{med.medicine}</Typography>
                                <Chip label={med.dosage} size="small" sx={{ bgcolor: '#e3f2fd', color: '#0062ff', fontWeight: 700 }} />
                              </Box>
                              <Typography variant="caption" color="textSecondary">
                                {med.slot} • {med.time} • {med.meal}
                              </Typography>
                            </Box>
                            <Box textAlign="right">
                              <Chip
                                label={style.label}
                                size="small"
                                sx={{ bgcolor: 'white', color: style.color, fontWeight: 700, border: `1px solid ${style.color}`, mb: 1 }}
                              />
                              {/* ✅ Only PENDING shows Mark Taken button */}
                              {isMarkable && (
                                <Box>
                                  <Button
                                    size="small" variant="contained"
                                    onClick={() => handleMarkTaken(med)}
                                    disabled={isMarking}
                                    sx={{ bgcolor: '#2e7d32', fontWeight: 700, borderRadius: 2, fontSize: '0.7rem', '&:hover': { bgcolor: '#1b5e20' } }}
                                  >
                                    {isMarking ? '...' : '✅ Mark Taken'}
                                  </Button>
                                </Box>
                              )}
                              {/* ✅ UPCOMING shows when it opens */}
                              {isUpcoming && (
                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                                  Opens at {med.timeStart}
                                </Typography>
                              )}
                              {!isMarkable && !isUpcoming && (
                                <Typography variant="caption" color="textSecondary" display="block">
                                  Marked: {med.markedAt}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Side */}
          <Grid item xs={12} lg={5}>
            <Box display="flex" flexDirection="column" gap={3}>

              {/* Pie Chart */}
              <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>📊 Adherence Overview</Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={adherenceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                        {adherenceData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Next Reminder */}
              <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #fff3e0', bgcolor: '#fffbf0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" mb={2} sx={{ color: '#f57f17' }}>⏰ Next Reminder</Typography>
                  {todayMeds.filter(m => m.status === 'PENDING').length > 0 ? (
                    <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 3, border: '1px solid #ffe082' }}>
                      <Typography fontWeight="bold">
                        {todayMeds.find(m => m.status === 'PENDING')?.icon}{' '}
                        {todayMeds.find(m => m.status === 'PENDING')?.slot} Medicines
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {todayMeds.find(m => m.status === 'PENDING')?.medicine}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#f57f17', fontWeight: 700 }}>
                        {todayMeds.find(m => m.status === 'PENDING')?.time}
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 3, border: '1px solid #ffe082' }}>
                      <Typography fontWeight="bold" color="textSecondary">All medicines taken! ✅</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>

            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* ✅ RESTORED: Floating AI Assistant button */}
      <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
        {showAI ? (
          <AiChat role="PATIENT" onClose={() => setShowAI(false)} />
        ) : (
          <Button
            variant="contained"
            onClick={() => setShowAI(true)}
            sx={{
              bgcolor: '#2e7d32', borderRadius: 4, px: 3, py: 1.5, fontWeight: 700,
              boxShadow: '0 8px 25px rgba(46,125,50,0.4)',
              '&:hover': { bgcolor: '#1b5e20', transform: 'scale(1.05)' },
              transition: 'all 0.2s'
            }}
          >
            🤖 Ask AI Assistant
          </Button>
        )}
      </Box>

    </Box>
  );
};

export default PatientDashboard;