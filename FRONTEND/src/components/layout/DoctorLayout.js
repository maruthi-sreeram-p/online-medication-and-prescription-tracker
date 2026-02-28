import React, { useState } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Avatar, Divider, IconButton
} from '@mui/material';
import {
  Dashboard, People, Assignment, PersonAdd,
  Settings, Menu, Logout, LocalHospital, History
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const drawerWidth = 280;

const DoctorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ ALWAYS read from localStorage — never hardcode names
  const doctorName = localStorage.getItem('name') || 'Doctor';
  const initials = doctorName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0].toUpperCase())
    .join('')
    .slice(0, 2);

  const menuItems = [
    { text: 'Dashboard',        icon: <Dashboard />,  path: '/doctor/dashboard' },
    { text: 'My Patients',      icon: <People />,     path: '/doctor/patients' },
    { text: 'Patient Requests', icon: <PersonAdd />,  path: '/doctor/requests' },
    { text: 'Prescriptions',    icon: <Assignment />, path: '/doctor/prescriptions' },
    { text: 'Patient History',  icon: <History />,    path: '/doctor/history' },
    { text: 'Settings',         icon: <Settings />,   path: '/doctor/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>

      {/* Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <LocalHospital sx={{ fontSize: 36, color: '#0062ff' }} />
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#0062ff' }}>
          MediCare
        </Typography>
      </Box>

      <Divider />

      {/* ✅ Doctor Profile — 100% dynamic from localStorage */}
      <Box sx={{ p: 3, bgcolor: '#f0f7ff', m: 2, borderRadius: 3, border: '1px solid #bfdbfe' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: '#0062ff', width: 50, height: 50, fontWeight: 'bold', fontSize: 18 }}>
            {initials}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1e293b' }}>
              {doctorName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#0062ff', fontWeight: 600 }}>
              Doctor
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                bgcolor: isActive(item.path) ? '#e3f2fd' : 'transparent',
                border: isActive(item.path) ? '1px solid #bfdbfe' : '1px solid transparent',
                '&:hover': { bgcolor: '#f0f4ff' },
                py: 1.5
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? '#0062ff' : '#64748b', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 700 : 500,
                  color: isActive(item.path) ? '#0062ff' : '#1e293b'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Logout */}
      <Box sx={{ position: 'absolute', bottom: 20, left: 0, right: 0, px: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            border: '1px solid #e2e8f0',
            '&:hover': { bgcolor: '#ffebee', borderColor: '#d32f2f' }
          }}
        >
          <ListItemIcon sx={{ color: '#d32f2f', minWidth: 40 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontWeight: 600, color: '#d32f2f' }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>

      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white', boxShadow: 1,
          display: { sm: 'none' }
        }}
      >
        <Toolbar>
          <IconButton color="primary" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2 }}>
            <Menu />
          </IconButton>
          <Typography variant="h6" color="primary" fontWeight="bold">MediCare Doctor</Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        >{drawer}</Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
          open
        >{drawer}</Drawer>
      </Box>

      <Box
        component="main"
        sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` }, bgcolor: '#f8fafc', minHeight: '100vh' }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DoctorLayout;