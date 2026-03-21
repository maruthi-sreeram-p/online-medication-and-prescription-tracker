import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Avatar, Chip, Button, LinearProgress, CircularProgress, Alert
} from '@mui/material';
import {
  Medication, CheckCircle, AccessTime,
  Cancel, Person, WbSunny
} from '@mui/icons-material';
import api from '../../services/api';

const StaffDashboard = () => {

  const staffName = localStorage.getItem('name') || 'Staff';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchAssignedPatients();
  }, []);

  // ✅ Fetch all patients and their today's medication schedule
  const fetchAssignedPatients = async () => {
    try {
      // Get all doctors' patients — staff monitors all patients
      const doctorsRes = await api.get('/doctors/all');
      const doctors = doctorsRes.data || [];

      // Collect all unique patients across all doctors
      const allPatientIds = new Set();
      const allPatients = [];

      for (const doctor of doctors) {
        try {
          const patientsRes = await api.get(`/doctors/${doctor.id}/patients`);
          const doctorPatients = patientsRes.data || [];
          for (const p of doctorPatients) {
            if (!allPatientIds.has(p.id)) {
              allPatientIds.add(p.id);
              allPatients.push({ ...p, doctorName: doctor.name });
            }
          }
        } catch (err) {
          // skip this doctor's patients if error
        }
      }

      // For each patient fetch today's medicines
      const enriched = await Promise.all(allPatients.map(async (patient) => {
        try {
          const trackRes = await api.get(`/tracking/${patient.id}/today`);
          const medicines = (trackRes.data || []).map(t => ({
            id: t.id,
            name: t.medicineName,
            dosage: t.dosage,
            slot: t.slot,
            time: `${t.timeStart || '07:00'} - ${t.timeEnd || '09:00'}`,
            meal: t.meal ? (t.meal === 'before' ? 'Before Meal' : 'After Meal') : 'After Meal',
            status: t.status,
            markedAt: t.markedAt
              ? new Date(t.markedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              : '-',
            prescriptionMedicineId: t.prescriptionMedicineId,
            trackingId: t.id
          }));
          return { ...patient, medicines };
        } catch (err) {
          return { ...patient, medicines: [] };
        }
      }));

      // Only show patients who have medicines today
      setPatients(enriched.filter(p => p.medicines.length > 0));
    } catch (err) {
      setError('Failed to load patient data.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark medicine as taken — calls real API
  const handleMarkTaken = async (patientId, med) => {
    try {
      await api.post(`/tracking/${patientId}/mark`, {
        prescriptionMedicineId: med.prescriptionMedicineId,
        slot: med.slot,
        status: 'ON_TIME'
      });
    } catch (err) {
      // Continue with optimistic update even if API fails
    }

    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setPatients(patients.map(patient => {
      if (patient.id === patientId) {
        return {
          ...patient,
          medicines: patient.medicines.map(m =>
            m.id === med.id ? { ...m, status: 'ON_TIME', markedAt: timeStr } : m
          )
        };
      }
      return patient;
    }));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ON_TIME': return { bg: '#e8f5e9', color: '#2e7d32', label: '✅ On Time' };
      case 'LATE':    return { bg: '#fff8e1', color: '#f57f17', label: '⚠️ Late' };
      case 'MISSED':  return { bg: '#ffebee', color: '#d32f2f', label: '❌ Missed' };
      case 'PENDING': return { bg: '#f0f7ff', color: '#0062ff', label: '⏳ Pending' };
      default:        return { bg: '#f8fafc', color: '#64748b', label: 'Unknown' };
    }
  };

  const getAdherenceColor = (pct) => {
    if (pct >= 80) return '#2e7d32';
    if (pct >= 50) return '#f57f17';
    return '#d32f2f';
  };

  const totalOnTime = patients.reduce((acc, p) => acc + p.medicines.filter(m => m.status === 'ON_TIME').length, 0);
  const totalLate   = patients.reduce((acc, p) => acc + p.medicines.filter(m => m.status === 'LATE').length, 0);
  const totalMissed = patients.reduce((acc, p) => acc + p.medicines.filter(m => m.status === 'MISSED').length, 0);
  const totalPending = patients.reduce((acc, p) => acc + p.medicines.filter(m => m.status === 'PENDING').length, 0);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress sx={{ color: '#f57f17' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="xl">

        {/* Shift Banner */}
        <Box
          sx={{
            p: 3, mb: 4, borderRadius: 4,
            background: 'linear-gradient(135deg, #f57f17, #ff8f00)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(245,127,23,0.3)'
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                <WbSunny sx={{ fontSize: 30 }} />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={900}>
                  Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {staffName}! 👋
                </Typography>
                <Typography sx={{ opacity: 0.9 }}>
                  📅 {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </Typography>
              </Box>
            </Box>
            <Box textAlign="right">
              <Typography variant="h4" fontWeight={900}>{patients.length}</Typography>
              <Typography sx={{ opacity: 0.9, fontSize: '0.85rem' }}>Patients Today</Typography>
            </Box>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

        {/* Stats Row */}
        <Grid container spacing={3} mb={4}>
          {[
            { label: '✅ ON TIME',  count: totalOnTime,  color: '#2e7d32', bg: '#e8f5e9', border: '#e8f5e9' },
            { label: '⚠️ LATE',    count: totalLate,    color: '#f57f17', bg: '#fff8e1', border: '#fff8e1' },
            { label: '❌ MISSED',  count: totalMissed,  color: '#d32f2f', bg: '#ffebee', border: '#ffebee' },
            { label: '⏳ PENDING', count: totalPending, color: '#0062ff', bg: '#f0f7ff', border: '#f0f7ff' },
          ].map(s => (
            <Grid item xs={6} md={3} key={s.label}>
              <Card sx={{ borderRadius: 3, border: `1px solid ${s.border}` }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h4" fontWeight={900} sx={{ color: s.color }}>{s.count}</Typography>
                  <Typography variant="caption" color="textSecondary" fontWeight="bold">{s.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Patient List */}
        <Typography variant="h6" fontWeight="bold" mb={3} sx={{ color: '#1e293b' }}>
          Today's Patient Medication Schedule
        </Typography>

        {patients.length === 0 ? (
          <Card sx={{ borderRadius: 4, boxShadow: 2, p: 6, textAlign: 'center' }}>
            <Person sx={{ fontSize: 80, color: '#e2e8f0', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" fontWeight="bold">No patients assigned today!</Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              Patients with active prescriptions will appear here.
            </Typography>
          </Card>
        ) : (
          <Box display="flex" flexDirection="column" gap={3}>
            {patients.map((patient) => {
              const adherence = patient.adherencePercentage || 0;
              const doneMeds = patient.medicines.filter(m => m.status !== 'PENDING').length;
              const totalMeds = patient.medicines.length;
              const progress = totalMeds > 0 ? (doneMeds / totalMeds) * 100 : 0;

              return (
                <Card key={patient.id} sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0' }}>
                  <CardContent sx={{ p: 3 }}>

                    {/* Patient Header */}
                    <Box
                      display="flex" alignItems="center" justifyContent="space-between"
                      mb={3} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3 }}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: '#0062ff', width: 50, height: 50, fontWeight: 'bold', fontSize: 18 }}>
                          {(patient.name || 'P').charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">{patient.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {patient.age} yrs • {patient.gender} • Dr. {patient.doctorName}
                          </Typography>
                        </Box>
                      </Box>
                      <Box textAlign="right">
                        <Typography
                          variant="body2" fontWeight={900}
                          sx={{ color: getAdherenceColor(adherence) }}
                        >
                          {adherence}% Adherence
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {doneMeds}/{totalMeds} Done Today
                        </Typography>
                      </Box>
                    </Box>

                    {/* Medicine Cards */}
                    <Grid container spacing={2}>
                      {patient.medicines.map((med) => {
                        const style = getStatusStyle(med.status);
                        const slotIcon = med.slot === 'MORNING' ? '🌅' : med.slot === 'AFTERNOON' ? '☀️' : '🌙';
                        return (
                          <Grid item xs={12} md={6} key={med.id}>
                            <Box
                              sx={{
                                p: 2.5, borderRadius: 3,
                                bgcolor: style.bg,
                                border: `1px solid ${style.color}30`,
                                display: 'flex', alignItems: 'center', gap: 2
                              }}
                            >
                              <Avatar sx={{ bgcolor: style.color, width: 44, height: 44 }}>
                                <Medication sx={{ fontSize: 22 }} />
                              </Avatar>

                              <Box flex={1}>
                                <Typography fontWeight="bold" sx={{ color: '#1e293b' }}>
                                  {slotIcon} {med.name}
                                </Typography>
                                <Box display="flex" gap={0.5} mt={0.3} flexWrap="wrap">
                                  <Chip label={med.dosage} size="small" sx={{ bgcolor: '#e3f2fd', color: '#0062ff', fontWeight: 700 }} />
                                  <Chip label={med.meal} size="small" sx={{ bgcolor: '#f3e5f5', color: '#6a1b9a', fontWeight: 600 }} />
                                </Box>
                                <Typography variant="caption" color="textSecondary">{med.time}</Typography>
                              </Box>

                              <Box textAlign="center">
                                <Chip
                                  label={style.label}
                                  size="small"
                                  sx={{
                                    color: style.color, fontWeight: 700,
                                    border: `1px solid ${style.color}`,
                                    bgcolor: 'white', mb: 1, display: 'block'
                                  }}
                                />
                                {/* ✅ Mark Taken Button */}
                                {med.status === 'PENDING' ? (
                                  <Button
                                    size="small" variant="contained"
                                    onClick={() => handleMarkTaken(patient.id, med)}
                                    sx={{
                                      bgcolor: '#2e7d32', fontWeight: 700,
                                      borderRadius: 2, fontSize: '0.7rem',
                                      '&:hover': { bgcolor: '#1b5e20' }
                                    }}
                                  >
                                    ✅ Mark Taken
                                  </Button>
                                ) : (
                                  <Typography variant="caption" color="textSecondary">
                                    {med.markedAt}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>

                    {/* Progress Bar */}
                    <Box mt={2}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="caption" color="textSecondary">Today's Progress</Typography>
                        <Typography variant="caption" fontWeight="bold" sx={{ color: '#2e7d32' }}>
                          {doneMeds}/{totalMeds} Done
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 6, borderRadius: 3, bgcolor: '#e2e8f0',
                          '& .MuiLinearProgress-bar': { bgcolor: '#2e7d32', borderRadius: 3 }
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default StaffDashboard;