import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Avatar, CircularProgress
} from '@mui/material';
import { LocalHospital, People, Person, AdminPanelSettings } from '@mui/icons-material';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import api from '../../services/api';

const AdminDashboard = () => {

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalStaff: 0,
    pendingDoctors: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats({
        totalDoctors: res.data.totalDoctors || 0,
        totalPatients: res.data.totalPatients || 0,
        totalStaff: res.data.totalStaff || 0,
        pendingDoctors: res.data.pendingDoctors || 0
      });
    } catch (err) {
      console.error('Admin dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Doctors',     count: stats.totalDoctors,   icon: <LocalHospital />, color: '#0062ff', bg: '#e3f2fd' },
    { title: 'Total Patients',    count: stats.totalPatients,  icon: <People />,        color: '#2e7d32', bg: '#e8f5e9' },
    { title: 'Total Staff',       count: stats.totalStaff,     icon: <Person />,        color: '#f57f17', bg: '#fff8e1' },
    { title: 'Pending Approvals', count: stats.pendingDoctors, icon: <AdminPanelSettings />, color: '#6a1b9a', bg: '#f3e5f5' },
  ];

  const roleData = [
    { name: 'Doctors',  value: stats.totalDoctors  },
    { name: 'Patients', value: stats.totalPatients },
    { name: 'Staff',    value: stats.totalStaff    },
  ];

  const COLORS = ['#0062ff', '#2e7d32', '#f57f17'];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress sx={{ color: '#6a1b9a' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="xl">

        <Box mb={4}>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>Admin Dashboard</Typography>
          <Typography color="textSecondary">Complete overview of the MediCare system</Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          {statCards.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <Card sx={{ borderRadius: 4, boxShadow: 2, border: `1px solid ${stat.bg}` }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="overline" color="textSecondary" fontWeight="bold">{stat.title}</Typography>
                      <Typography variant="h3" fontWeight={900} sx={{ color: stat.color }}>{stat.count}</Typography>
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
                <Typography variant="h6" fontWeight="bold" mb={3}>📊 User Distribution</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={roleData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                      {roleData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>👥 User Breakdown</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={roleData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
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
    </Box>
  );
};

export default AdminDashboard;