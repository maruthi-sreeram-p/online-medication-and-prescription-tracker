import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent,
  Grid, Chip, Button, Divider, Avatar, CircularProgress,
  Alert, Snackbar
} from '@mui/material';
import { Medication, LockClock } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const PatientMedications = () => {

  const patientId = localStorage.getItem('userId');
  const [loading, setLoading] = useState(true);
  const [medications, setMedications] = useState({ morning: [], afternoon: [], night: [] });
  const [history, setHistory] = useState([]);
  const [rawTracking, setRawTracking] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [markingId, setMarkingId] = useState(null);

  useEffect(() => {
    fetchTodayMeds();
    fetchHistory();
  }, []);

  const fetchTodayMeds = async () => {
    try {
      const res = await api.get(`/tracking/${patientId}/today`);
      const grouped = { morning: [], afternoon: [], night: [] };
      (res.data || []).forEach(t => {
        const entry = {
          id: t.id,
          medicine: t.medicineName,
          dosage: t.dosage,
          meal: t.meal === 'before' ? 'Before Meal' : t.meal === 'after' ? 'After Meal' : 'After Meal',
          status: t.status,
          markedAt: t.markedAt
            ? new Date(t.markedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            : '-',
          prescriptionMedicineId: t.prescriptionMedicineId,
          slot: t.slot,
          timeStart: t.timeStart,
          timeEnd: t.timeEnd
        };
        if (t.slot === 'MORNING') grouped.morning.push(entry);
        else if (t.slot === 'AFTERNOON') grouped.afternoon.push(entry);
        else if (t.slot === 'NIGHT') grouped.night.push(entry);
      });
      setMedications(grouped);
      setRawTracking(res.data || []);
    } catch (err) {
      setErrorMsg('Failed to load today\'s medications. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/tracking/${patientId}/history`);
      const data = res.data || [];
      if (data.length === 0) { setHistory([]); return; }
      const grouped = {};
      data.forEach(t => {
        const day = t.trackingDate || 'today';
        if (!grouped[day]) grouped[day] = { onTime: 0, late: 0, missed: 0 };
        if (t.status === 'ON_TIME') grouped[day].onTime++;
        else if (t.status === 'LATE') grouped[day].late++;
        else if (t.status === 'MISSED') grouped[day].missed++;
      });
      const chartData = Object.keys(grouped).sort().slice(-7).map((date, i) => ({
        ...grouped[date], day: `Day ${i + 1}`
      }));
      setHistory(chartData);
    } catch (err) {
      setHistory([]);
    }
  };

  const handleMarkTaken = async (slot, med) => {
    if (markingId === med.id) return;
    setMarkingId(med.id);
    setErrorMsg('');
    try {
      await api.post(`/tracking/${patientId}/mark`, {
        prescriptionMedicineId: med.prescriptionMedicineId,
        slot: med.slot,
        status: 'ON_TIME'
      });
      // ✅ Refresh from backend — it decides ON_TIME vs LATE based on clock
      await fetchTodayMeds();
      setSuccessMsg(`✅ ${med.medicine} marked!`);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || '';
      setErrorMsg(msg || `Failed to mark ${med.medicine}. Please try again.`);
    } finally {
      setMarkingId(null);
    }
  };

  // ✅ FIX: UPCOMING = slot hasn't opened yet (greyed, no button)
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

  const slotConfig = {
    morning:   { label: '🌅 Morning',   color: '#f57f17', bg: '#fff8e1', border: '#ffe082' },
    afternoon: { label: '☀️ Afternoon', color: '#1565c0', bg: '#e3f2fd', border: '#90caf9' },
    night:     { label: '🌙 Night',     color: '#4527a0', bg: '#ede7f6', border: '#b39ddb' }
  };

  const totalOnTime = rawTracking.filter(t => t.status === 'ON_TIME').length;
  const totalLate   = rawTracking.filter(t => t.status === 'LATE').length;
  const totalMissed = rawTracking.filter(t => t.status === 'MISSED').length;
  const hasAnyMeds  = medications.morning.length > 0 || medications.afternoon.length > 0 || medications.night.length > 0;

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
        <Box mb={4}>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>My Medications</Typography>
          <Typography color="textSecondary">Track and mark your daily medicines</Typography>
        </Box>

        {errorMsg && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg('')}>{errorMsg}</Alert>}
        <Snackbar open={!!successMsg} autoHideDuration={3000} onClose={() => setSuccessMsg('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="success" onClose={() => setSuccessMsg('')} sx={{ fontWeight: 600 }}>{successMsg}</Alert>
        </Snackbar>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={7}>
            {!hasAnyMeds ? (
              <Card sx={{ borderRadius: 4, boxShadow: 2, p: 6, textAlign: 'center' }}>
                <Medication sx={{ fontSize: 80, color: '#e2e8f0', mb: 2 }} />
                <Typography variant="h6" color="textSecondary" fontWeight="bold">No medications for today!</Typography>
                <Typography variant="body2" color="textSecondary" mt={1}>
                  Medications will appear here after your doctor creates a prescription.
                </Typography>
              </Card>
            ) : (
              <Box display="flex" flexDirection="column" gap={3}>
                {Object.entries(medications).map(([slot, meds]) => {
                  if (meds.length === 0) return null;
                  const config = slotConfig[slot];
                  const doneCount = meds.filter(m => !['PENDING','UPCOMING'].includes(m.status)).length;
                  return (
                    <Card key={slot} sx={{ borderRadius: 4, boxShadow: 2, border: `1px solid ${config.border}` }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          display="flex" justifyContent="space-between" alignItems="center" mb={3}
                          sx={{ p: 2, bgcolor: config.bg, borderRadius: 3, border: `1px solid ${config.border}` }}
                        >
                          <Box>
                            <Typography fontWeight="bold" sx={{ color: config.color, fontSize: '1.1rem' }}>{config.label}</Typography>
                            <Typography variant="caption" sx={{ color: config.color }}>
                              {meds[0]?.timeStart} – {meds[0]?.timeEnd}
                            </Typography>
                          </Box>
                          <Chip
                            label={`${doneCount}/${meds.length} Done`}
                            size="small"
                            sx={{ bgcolor: 'white', color: config.color, fontWeight: 700, border: `1px solid ${config.color}` }}
                          />
                        </Box>

                        <Box display="flex" flexDirection="column" gap={2}>
                          {meds.map((med) => {
                            const style = getStatusStyle(med.status);
                            const isMarking = markingId === med.id;
                            const isMarkable = med.status === 'PENDING';
                            const isUpcoming = med.status === 'UPCOMING';

                            return (
                              <Box
                                key={med.id}
                                sx={{
                                  p: 2, borderRadius: 3, bgcolor: style.bg,
                                  border: `1px solid ${style.color}20`,
                                  display: 'flex', alignItems: 'center', gap: 2,
                                  opacity: isUpcoming ? 0.55 : 1
                                }}
                              >
                                <Avatar sx={{ bgcolor: style.color, width: 40, height: 40 }}>
                                  {isUpcoming
                                    ? <LockClock sx={{ fontSize: 20 }} />
                                    : <Medication sx={{ fontSize: 20 }} />
                                  }
                                </Avatar>
                                <Box flex={1}>
                                  <Typography fontWeight="bold">{med.medicine}</Typography>
                                  <Box display="flex" gap={1} mt={0.3} flexWrap="wrap">
                                    <Chip label={med.dosage} size="small" sx={{ bgcolor: '#e3f2fd', color: '#0062ff', fontWeight: 700 }} />
                                    <Chip label={med.meal} size="small" sx={{ bgcolor: '#f3e5f5', color: '#6a1b9a', fontWeight: 600 }} />
                                  </Box>
                                </Box>
                                <Box textAlign="right">
                                  <Chip label={style.label} size="small" sx={{ color: style.color, fontWeight: 700, mb: 0.5, display: 'block' }} />

                                  {/* ✅ PENDING only → Mark Taken button visible */}
                                  {isMarkable && (
                                    <Button
                                      size="small" variant="contained"
                                      onClick={() => handleMarkTaken(slot, med)}
                                      disabled={isMarking}
                                      sx={{ bgcolor: '#2e7d32', fontWeight: 700, borderRadius: 2, fontSize: '0.7rem', '&:hover': { bgcolor: '#1b5e20' } }}
                                    >
                                      {isMarking ? '...' : 'Mark Taken'}
                                    </Button>
                                  )}

                                  {/* ✅ UPCOMING → show when it opens, no button */}
                                  {isUpcoming && (
                                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                                      Opens at {med.timeStart}
                                    </Typography>
                                  )}

                                  {/* ON_TIME / LATE / MISSED → show marked time */}
                                  {!isMarkable && !isUpcoming && (
                                    <Typography variant="caption" color="textSecondary">{med.markedAt}</Typography>
                                  )}
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            )}
          </Grid>

          <Grid item xs={12} lg={5}>
            <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>📊 Weekly Tracking</Typography>
                {history.length === 0 ? (
                  <Box textAlign="center" py={5}>
                    <Typography color="textSecondary" fontWeight="bold">No tracking history yet</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Chart will appear once you start marking medicines as taken
                    </Typography>
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={history}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="onTime" name="On Time" fill="#2e7d32" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="late"   name="Late"    fill="#f57f17" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="missed" name="Missed"  fill="#d32f2f" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={1}>
                  {[
                    { count: totalOnTime, label: 'On Time', bg: '#e8f5e9', color: '#2e7d32' },
                    { count: totalLate,   label: 'Late',    bg: '#fff8e1', color: '#f57f17' },
                    { count: totalMissed, label: 'Missed',  bg: '#ffebee', color: '#d32f2f' }
                  ].map(s => (
                    <Grid item xs={4} key={s.label}>
                      <Box textAlign="center" sx={{ p: 1.5, bgcolor: s.bg, borderRadius: 2 }}>
                        <Typography fontWeight={900} sx={{ color: s.color }}>{s.count}</Typography>
                        <Typography variant="caption" sx={{ color: s.color }}>{s.label}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PatientMedications;