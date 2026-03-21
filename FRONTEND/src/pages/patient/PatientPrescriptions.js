import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent,
  Grid, Chip, Avatar, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress
} from '@mui/material';
import { Assignment, CalendarToday, Person } from '@mui/icons-material';
import api from '../../services/api';

// ✅ FIX: Helper to show per-slot timing clearly
const slotConfig = {
  MORNING:   { label: '🌅 Morning',   color: '#f57f17', bg: '#fff8e1' },
  AFTERNOON: { label: '☀️ Afternoon', color: '#1565c0', bg: '#e3f2fd' },
  NIGHT:     { label: '🌙 Night',     color: '#4527a0', bg: '#ede7f6' }
};

// ✅ FIX: Build per-slot detail rows from the full medicine DTO
const getSlotDetails = (med) => {
  const details = [];
  const freq = med.frequency ? med.frequency.toUpperCase() : '';

  if (freq.includes('MORNING')) {
    details.push({
      slot: 'MORNING',
      meal: med.morningMeal === 'before' ? 'Before Meal' : med.morningMeal === 'after' ? 'After Meal' : '—',
      timeStart: med.morningTimeStart || '07:00',
      timeEnd: med.morningTimeEnd || '09:00'
    });
  }
  if (freq.includes('AFTERNOON')) {
    details.push({
      slot: 'AFTERNOON',
      meal: med.afternoonMeal === 'before' ? 'Before Meal' : med.afternoonMeal === 'after' ? 'After Meal' : '—',
      timeStart: med.afternoonTimeStart || '12:00',
      timeEnd: med.afternoonTimeEnd || '13:00'
    });
  }
  if (freq.includes('NIGHT')) {
    details.push({
      slot: 'NIGHT',
      meal: med.nightMeal === 'before' ? 'Before Meal' : med.nightMeal === 'after' ? 'After Meal' : '—',
      timeStart: med.nightTimeStart || '21:00',
      timeEnd: med.nightTimeEnd || '22:00'
    });
  }
  return details;
};

const PatientPrescriptions = () => {

  const patientId = localStorage.getItem('userId');
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await api.get(`/patients/${patientId}/prescriptions`);
      setPrescriptions(res.data);
    } catch (err) {
      setPrescriptions([]);
    } finally {
      setLoading(false);
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
      <Container maxWidth="xl">

        <Box mb={4}>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>My Prescriptions</Typography>
          <Typography color="textSecondary">All prescriptions from your doctor</Typography>
        </Box>

        {prescriptions.length === 0 ? (
          <Card sx={{ borderRadius: 4, boxShadow: 2, p: 6, textAlign: 'center' }}>
            <Assignment sx={{ fontSize: 80, color: '#e2e8f0', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" fontWeight="bold">No prescriptions yet!</Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              Prescriptions will appear here after your doctor writes one for you.
            </Typography>
          </Card>
        ) : (
          <Box display="flex" flexDirection="column" gap={3}>
            {prescriptions.map((prescription) => (
              <Card key={prescription.id} sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 3 }}>

                  {/* Prescription Header */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: '#0062ff', width: 50, height: 50 }}>
                        <Assignment />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          Prescription #{prescription.id}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <CalendarToday sx={{ fontSize: 14, color: '#64748b' }} />
                          <Typography variant="caption" color="textSecondary">
                            {prescription.createdAt
                              ? new Date(prescription.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                              : 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Chip label="ACTIVE" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700 }} />
                  </Box>

                  {/* Doctor Info */}
                  <Box sx={{ p: 2, bgcolor: '#f0f7ff', borderRadius: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Person sx={{ color: '#0062ff' }} />
                    <Box>
                      <Typography fontWeight="bold" sx={{ color: '#0062ff' }}>{prescription.doctorName}</Typography>
                      <Typography variant="caption" color="textSecondary">Your Doctor</Typography>
                    </Box>
                  </Box>

                  {/* Remarks */}
                  {prescription.remarks && (
                    <Box sx={{ p: 2, bgcolor: '#fffbf0', borderRadius: 3, mb: 3, border: '1px solid #ffe082' }}>
                      <Typography variant="caption" fontWeight="bold" color="textSecondary">DOCTOR'S REMARKS</Typography>
                      <Typography variant="body2" mt={0.5}>{prescription.remarks}</Typography>
                    </Box>
                  )}

                  {/* ✅ FIX: Medicines with full per-slot detail */}
                  {prescription.medicines && prescription.medicines.length > 0 ? (
                    <Box display="flex" flexDirection="column" gap={2}>
                      {prescription.medicines.map((med, index) => {
                        const slotDetails = getSlotDetails(med);
                        return (
                          <Box
                            key={index}
                            sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fafafa' }}
                          >
                            {/* Medicine header */}
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                              <Typography fontWeight="bold" variant="h6" sx={{ color: '#1e293b', flex: 1 }}>
                                💊 {med.medicineName}
                              </Typography>
                              <Chip
                                label={med.dosage}
                                size="small"
                                sx={{ bgcolor: '#e3f2fd', color: '#0062ff', fontWeight: 700 }}
                              />
                              <Chip
                                label={`${med.durationDays} days`}
                                size="small"
                                sx={{ bgcolor: '#f3e5f5', color: '#6a1b9a', fontWeight: 700 }}
                              />
                            </Box>

                            {/* ✅ Per-slot timing details */}
                            <Grid container spacing={1.5}>
                              {slotDetails.map((detail) => {
                                const cfg = slotConfig[detail.slot];
                                return (
                                  <Grid item xs={12} sm={4} key={detail.slot}>
                                    <Box
                                      sx={{
                                        p: 1.5, borderRadius: 2,
                                        bgcolor: cfg.bg,
                                        border: `1px solid ${cfg.color}30`
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        fontWeight="bold"
                                        sx={{ color: cfg.color, mb: 0.5 }}
                                      >
                                        {cfg.label}
                                      </Typography>
                                      <Typography variant="caption" display="block" color="textSecondary">
                                        🍽️ {detail.meal}
                                      </Typography>
                                      <Typography variant="caption" display="block" color="textSecondary">
                                        ⏰ {detail.timeStart} – {detail.timeEnd}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                );
                              })}
                            </Grid>
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    <Typography color="textSecondary" variant="body2">No medicines listed.</Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PatientPrescriptions;