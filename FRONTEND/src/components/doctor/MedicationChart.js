import React from 'react';
import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

/**
 * MEDICATION ADHERENCE CHART
 * Purpose: Shows pie chart of medication adherence (On-time, Late, Missed)
 * Used in: DoctorDashboard
 *
 * Props:
 * - data: Array of adherence data [{name: 'On Time', value: 70}, ...]
 */
const MedicationChart = ({ data }) => {

  // Colors matching our theme (Green, Yellow, Red)
  const COLORS = ['#2e7d32', '#ed6c02', '#d32f2f'];

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2} textAlign="center">
        Overall Medication Adherence
      </Typography>

      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MedicationChart;