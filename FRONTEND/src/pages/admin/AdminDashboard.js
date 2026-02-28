import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Avatar, Chip, Button
} from '@mui/material';
import {
  LocalHospital, People, Person, AdminPanelSettings
} from '@mui/icons-material';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import AiChat from '../../components/common/AiChat';

const AdminDashboard = () => {

  const [showAI, setShowAI] = useState(false);

  const stats = [
    { title: 'Total Doctors', count: 12, icon: <LocalHospital />, color: '#0062ff', bg: '#e3f2fd' },
    { title: 'Total Patients', count: 48, icon: <People />, color: '#2e7d32', bg: '#e8f5e9' },
    { title: 'Total Staff', count: 8, icon: <Person />, color: '#f57f17', bg: '#fff8e1' },
    { title: 'Pending Approvals', count: 3, icon: <AdminPanelSettings />, color: '#6a1b9a', bg: '#f3e5f5' },
  ];

  const userGrowthData = [
    { month: 'Oct', doctors: 4, patients: 10, staff: 2 },
    { month: 'Nov', doctors: 6, patients: 20, staff: 4 },
    { month: 'Dec', doctors: 8, patients: 30, staff: 6 },
    { month: 'Jan', doctors: 10, patients: 40, staff: 7 },
    { month: 'Feb', doctors: 12, patients: 48, staff: 8 },
  ];

  const roleData = [
    { name: 'Doctors', value: 12 },
    { name: 'Patients', value: 48 },
    { name: 'Staff', value: 8 },
  ];

  const COLORS = ['#0062ff', '#2e7d32', '#f57f17'];

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="xl">

        <Box mb={4}>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>
            Admin Dashboard
          </Typography>
          <Typography color="textSecondary">
            Complete overview of the MediCare system
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <Card sx={{ borderRadius: 4, boxShadow: 2, border: `1px solid ${stat.bg}` }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="overline" color="textSecondary" fontWeight="bold">
                        {stat.title}
                      </Typography>
                      <Typography variant="h3" fontWeight={900} sx={{ color: stat.color }}>
                        {stat.count}
                      </Typography>
                    </Box>
                    <Box sx={{ bgcolor: stat.bg, p: 2, borderRadius: 3 }}>
                      <Avatar sx={{ bgcolor: stat.color }}>{stat.icon}</Avatar>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  📈 User Growth (Monthly)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="doctors" name="Doctors" fill="#0062ff" radius={[4,4,0,0]} />
                    <Bar dataKey="patients" name="Patients" fill="#2e7d32" radius={[4,4,0,0]} />
                    <Bar dataKey="staff" name="Staff" fill="#f57f17" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  👥 User Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={roleData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                      {roleData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* AI Chat Button - Fixed Position */}
      <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
        {showAI ? (
          <AiChat role="ADMIN" onClose={() => setShowAI(false)} />
        ) : (
          <Button
            variant="contained"
            onClick={() => setShowAI(true)}
            sx={{
              bgcolor: '#6a1b9a',
              borderRadius: 4,
              px: 3, py: 1.5,
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 8px 25px rgba(106,27,154,0.4)',
              '&:hover': { bgcolor: '#4a148c', transform: 'scale(1.05)' },
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

export default AdminDashboard;