import React, { useState } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography,
  ListItem, ListItemButton, ListItemIcon, ListItemText,
  Avatar, Divider, IconButton, Chip
} from '@mui/material';
import {
  Dashboard, Menu, Logout, LocalHospital
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

/**
 * STAFF LAYOUT
 * Purpose: Sidebar for staff pages
 * Theme: Orange (different from Doctor blue and Patient green)
 */

const drawerWidth = 280;

const StaffLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/staff/dashboard' },
  ];

  const isActive = (path) => location.pathname === path;

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

      {/* Staff Profile Card */}
      <Box sx={{ p: 3, bgcolor: '#fff8e1', m: 2, borderRadius: 3, border: '1px solid #ffe082' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: '#f57f17', width: 50, height: 50, fontWeight: 'bold' }}>
            NP
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Nurse Priya
            </Typography>
            <Chip
              label="🌅 Morning Shift"
              size="small"
              sx={{ bgcolor: '#ff8f00', color: 'white', fontWeight: 700, mt: 0.3 }}
            />
          </Box>
        </Box>
      </Box>

      {/* Menu */}
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                bgcolor: isActive(item.path) ? '#fff8e1' : 'transparent',
                '&:hover': { bgcolor: '#fff8e1' },
                py: 1.5
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? '#f57f17' : '#64748b', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 700 : 500,
                  color: isActive(item.path) ? '#f57f17' : '#1e293b'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Logout */}
      <Box sx={{ position: 'absolute', bottom: 20, left: 0, right: 0, px: 2 }}>
        <ListItemButton
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
          sx={{
            borderRadius: 2,
            border: '1px solid #e2e8f0',
            '&:hover': { bgcolor: '#fee', borderColor: '#d32f2f' }
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
          bgcolor: 'white',
          boxShadow: 1,
          display: { sm: 'none' }
        }}
      >
        <Toolbar>
          <IconButton color="primary" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2 }}>
            <Menu />
          </IconButton>
          <Typography variant="h6" color="primary" fontWeight="bold">
            MediCare Staff
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: '#f8fafc',
          minHeight: '100vh'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default StaffLayout;