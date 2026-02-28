import React from 'react';
import { Card, CardContent, Typography, Box, Button, Avatar } from '@mui/material';
import { Person } from '@mui/icons-material';

/**
 * REQUEST CARD COMPONENT
 * Purpose: Shows a patient's request to connect with doctor (like Instagram friend request)
 * Used in: PatientRequests page
 *
 * Props:
 * - request: Object with patient data (name, age, gender)
 * - onAccept: Function to call when "Accept" is clicked
 * - onReject: Function to call when "Reject" is clicked
 */
const RequestCard = ({ request, onAccept, onReject }) => {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          {/* Patient Avatar */}
          <Avatar sx={{ bgcolor: '#0062ff', width: 50, height: 50 }}>
            <Person />
          </Avatar>

          {/* Patient Info */}
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold">
              {request.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {request.age} years • {request.gender}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Wants to connect with you
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box display="flex" gap={2}>
          <Button
            fullWidth
            variant="contained"
            sx={{ bgcolor: '#0062ff', fontWeight: 700 }}
            onClick={() => onAccept(request.id)}
          >
            Accept
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            sx={{ fontWeight: 700 }}
            onClick={() => onReject(request.id)}
          >
            Reject
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RequestCard;