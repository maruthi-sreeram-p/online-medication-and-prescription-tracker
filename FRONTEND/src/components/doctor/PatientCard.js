import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { Person } from '@mui/icons-material';

/**
 * PATIENT CARD COMPONENT
 * Purpose: Shows a single patient's basic info in a card
 * Used in: DoctorDashboard, MyPatients page
 *
 * Props:
 * - patient: Object with patient data (name, age, gender, adherence %)
 * - onClick: Function to call when card is clicked
 */
const PatientCard = ({ patient, onClick }) => {

  // Determine adherence color (Green = good, Yellow = okay, Red = poor)
  const getAdherenceColor = (percentage) => {
    if (percentage >= 80) return '#2e7d32'; // Green
    if (percentage >= 50) return '#ed6c02'; // Orange
    return '#d32f2f'; // Red
  };

  return (
    <Card
      sx={{
        cursor: 'pointer',
        '&:hover': { boxShadow: 4 },
        borderRadius: 3,
        transition: 'all 0.3s'
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          {/* Patient Avatar */}
          <Avatar sx={{ bgcolor: '#0062ff', width: 50, height: 50 }}>
            <Person />
          </Avatar>

          {/* Patient Info */}
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold">
              {patient.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {patient.age} years • {patient.gender}
            </Typography>
          </Box>

          {/* Adherence Percentage */}
          <Box textAlign="center">
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: getAdherenceColor(patient.adherence) }}
            >
              {patient.adherence}%
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Adherence
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PatientCard;