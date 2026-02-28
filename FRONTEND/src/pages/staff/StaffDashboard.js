import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Avatar, Chip, Button, LinearProgress, Divider, Alert
} from '@mui/material';
import {
  Medication, CheckCircle, AccessTime,
  Cancel, Person, WbSunny
} from '@mui/icons-material';
import AiChat from '../../components/common/AiChat';

/**
 * STAFF DASHBOARD
 * Purpose: Staff (Nurse/Assistant) monitors assigned patients
 * Features:
 * - Shift info banner
 * - List of assigned patients
 * - Each patient's medicine schedule
 * - Mark taken button for each medicine
 * - Color coded status (Green/Yellow/Red)
 */
const StaffDashboard = () => {

  const [showAI, setShowAI] = useState(false);

  // Staff info (Replace with API later)
  const staff = {
    name: 'Nurse Priya',
    role: 'Nurse',
    shift: 'MORNING',
    shiftTime: '6:00 AM - 2:00 PM',
    ward: 'Ward A'
  };

  // Assigned patients with their medicines
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Namitha Ganji',
      age: 25,
      gender: 'Female',
      condition: 'Diabetes',
      ward: 'Ward A - Bed 1',
      adherence: 85,
      medicines: [
        {
          id: 1,
          name: 'Dolo 650',
          dosage: '650mg',
          slot: 'Morning',
          time: '7:00 AM - 9:00 AM',
          meal: 'After Meal',
          status: 'ON_TIME',
          markedAt: '8:15 AM'
        },
        {
          id: 2,
          name: 'Metformin',
          dosage: '500mg',
          slot: 'Morning',
          time: '7:00 AM - 9:00 AM',
          meal: 'After Meal',
          status: 'PENDING',
          markedAt: '-'
        }
      ]
    },
    {
      id: 2,
      name: 'Maruthi Sreeram',
      age: 26,
      gender: 'Male',
      condition: 'Asthma',
      ward: 'Ward A - Bed 2',
      adherence: 65,
      medicines: [
        {
          id: 3,
          name: 'Salbutamol',
          dosage: '2mg',
          slot: 'Morning',
          time: '7:00 AM - 9:00 AM',
          meal: 'Before Meal',
          status: 'MISSED',
          markedAt: '-'
        },
        {
          id: 4,
          name: 'Budesonide',
          dosage: '200mcg',
          slot: 'Morning',
          time: '7:00 AM - 9:00 AM',
          meal: 'After Meal',
          status: 'PENDING',
          markedAt: '-'
        }
      ]
    }
  ]);

  // Mark medicine as taken for a patient
  const handleMarkTaken = (patientId, medicineId) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setPatients(patients.map(patient => {
      if (patient.id === patientId) {
        return {
          ...patient,
          medicines: patient.medicines.map(med => {
            if (med.id === medicineId) {
              return { ...med, status: 'ON_TIME', markedAt: timeStr };
            }
            return med;
          })
        };
      }
      return patient;
    }));
  };

  // Status styles
  const getStatusStyle = (status) => {
    switch (status) {
      case 'ON_TIME': return { bg: '#e8f5e9', color: '#2e7d32', label: '✅ On Time' };
      case 'LATE': return { bg: '#fff8e1', color: '#f57f17', label: '⚠️ Late' };
      case 'MISSED': return { bg: '#ffebee', color: '#d32f2f', label: '❌ Missed' };
      case 'PENDING': return { bg: '#f0f7ff', color: '#0062ff', label: '⏳ Pending' };
      default: return { bg: '#f8fafc', color: '#64748b', label: 'Unknown' };
    }
  };

  // Adherence color
  const getAdherenceColor = (pct) => {
    if (pct >= 80) return '#2e7d32';
    if (pct >= 50) return '#f57f17';
    return '#d32f2f';
  };

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="xl">

        {/* Shift Banner */}
        <Box
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 4,
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
                  Good Morning, {staff.name}! 👋
                </Typography>
                <Typography sx={{ opacity: 0.9 }}>
                  🌅 Morning Shift • {staff.shiftTime} • {staff.ward}
                </Typography>
              </Box>
            </Box>
            <Box textAlign="right">
              <Typography variant="h4" fontWeight={900}>
                {patients.length}
              </Typography>
              <Typography sx={{ opacity: 0.9, fontSize: '0.85rem' }}>
                Patients Assigned
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Stats Row */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={6} md={3}>
            <Card sx={{ borderRadius: 3, border: '1px solid #e8f5e9' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h4" fontWeight={900} sx={{ color: '#2e7d32' }}>
                  {patients.reduce((acc, p) => acc + p.medicines.filter(m => m.status === 'ON_TIME').length, 0)}
                </Typography>
                <Typography variant="caption" color="textSecondary" fontWeight="bold">
                  ✅ ON TIME
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ borderRadius: 3, border: '1px solid #fff8e1' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h4" fontWeight={900} sx={{ color: '#f57f17' }}>
                  {patients.reduce((acc, p) => acc + p.medicines.filter(m => m.status === 'LATE').length, 0)}
                </Typography>
                <Typography variant="caption" color="textSecondary" fontWeight="bold">
                  ⚠️ LATE
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ borderRadius: 3, border: '1px solid #ffebee' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h4" fontWeight={900} sx={{ color: '#d32f2f' }}>
                  {patients.reduce((acc, p) => acc + p.medicines.filter(m => m.status === 'MISSED').length, 0)}
                </Typography>
                <Typography variant="caption" color="textSecondary" fontWeight="bold">
                  ❌ MISSED
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ borderRadius: 3, border: '1px solid #f0f7ff' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h4" fontWeight={900} sx={{ color: '#0062ff' }}>
                  {patients.reduce((acc, p) => acc + p.medicines.filter(m => m.status === 'PENDING').length, 0)}
                </Typography>
                <Typography variant="caption" color="textSecondary" fontWeight="bold">
                  ⏳ PENDING
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Patient Cards */}
        <Typography variant="h6" fontWeight="bold" mb={3} sx={{ color: '#1e293b' }}>
          Assigned Patients - Morning Medicines
        </Typography>

        <Box display="flex" flexDirection="column" gap={3}>
          {patients.map((patient) => (
            <Card
              key={patient.id}
              sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0' }}
            >
              <CardContent sx={{ p: 3 }}>

                {/* Patient Header */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={3}
                  sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3 }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: '#0062ff', width: 50, height: 50, fontWeight: 'bold', fontSize: 18 }}>
                      {patient.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {patient.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {patient.age} yrs • {patient.gender} • {patient.ward}
                      </Typography>
                    </Box>
                  </Box>

                  <Box textAlign="right">
                    <Chip
                      label={patient.condition}
                      size="small"
                      sx={{ bgcolor: '#fce4ec', color: '#c62828', fontWeight: 600, mb: 0.5 }}
                    />
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={900}
                        sx={{ color: getAdherenceColor(patient.adherence) }}
                      >
                        {patient.adherence}% Adherence
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Medicine Cards */}
                <Grid container spacing={2}>
                  {patient.medicines.map((med) => {
                    const style = getStatusStyle(med.status);
                    return (
                      <Grid item xs={12} md={6} key={med.id}>
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: 3,
                            bgcolor: style.bg,
                            border: `1px solid ${style.color}30`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                          }}
                        >
                          {/* Medicine Icon */}
                          <Avatar sx={{ bgcolor: style.color, width: 44, height: 44 }}>
                            <Medication sx={{ fontSize: 22 }} />
                          </Avatar>

                          {/* Medicine Info */}
                          <Box flex={1}>
                            <Typography fontWeight="bold" sx={{ color: '#1e293b' }}>
                              {med.name}
                            </Typography>
                            <Box display="flex" gap={0.5} mt={0.3} flexWrap="wrap">
                              <Chip
                                label={med.dosage}
                                size="small"
                                sx={{ bgcolor: '#e3f2fd', color: '#0062ff', fontWeight: 700 }}
                              />
                              <Chip
                                label={med.meal}
                                size="small"
                                sx={{ bgcolor: '#f3e5f5', color: '#6a1b9a', fontWeight: 600 }}
                              />
                            </Box>
                            <Typography variant="caption" color="textSecondary">
                              {med.time}
                            </Typography>
                          </Box>

                          {/* Status + Action */}
                          <Box textAlign="center">
                            <Chip
                              label={style.label}
                              size="small"
                              sx={{
                                color: style.color,
                                fontWeight: 700,
                                border: `1px solid ${style.color}`,
                                bgcolor: 'white',
                                mb: 1,
                                display: 'block'
                              }}
                            />
                            {med.status === 'PENDING' ? (
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleMarkTaken(patient.id, med.id)}
                                sx={{
                                  bgcolor: '#2e7d32',
                                  fontWeight: 700,
                                  borderRadius: 2,
                                  fontSize: '0.7rem',
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

                {/* Progress */}
                <Box mt={2}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="caption" color="textSecondary">
                      Today's Progress
                    </Typography>
                    <Typography variant="caption" fontWeight="bold" sx={{ color: '#2e7d32' }}>
                      {patient.medicines.filter(m => m.status !== 'PENDING').length}/{patient.medicines.length} Done
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(patient.medicines.filter(m => m.status !== 'PENDING').length / patient.medicines.length) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': { bgcolor: '#2e7d32', borderRadius: 3 }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* AI Chat Button - Fixed Position */}
      <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
        {showAI ? (
          <AiChat role="STAFF" onClose={() => setShowAI(false)} />
        ) : (
          <Button
            variant="contained"
            onClick={() => setShowAI(true)}
            sx={{
              bgcolor: '#f57f17',
              borderRadius: 4,
              px: 3, py: 1.5,
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 8px 25px rgba(245,127,23,0.4)',
              '&:hover': { bgcolor: '#e65100', transform: 'scale(1.05)' },
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

export default StaffDashboard;