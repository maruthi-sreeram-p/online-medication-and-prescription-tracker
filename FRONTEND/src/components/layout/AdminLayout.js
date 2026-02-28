import React, { useState } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography,
  ListItem, ListItemButton, ListItemIcon, ListItemText,
  Avatar, Divider, IconButton
} from '@mui/material';
import {
  Dashboard, People, LocalHospital,
  Menu, Logout, AdminPanelSettings, Person
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const drawerWidth = 280;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Manage Doctors', icon: <LocalHospital />, path: '/admin/doctors' },
    { text: 'Manage Patients', icon: <People />, path: '/admin/patients' },
    { text: 'Manage Staff', icon: <Person />, path: '/admin/staff' },
    { text: 'Profile', icon: <AdminPanelSettings />, path: '/admin/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <AdminPanelSettings sx={{ fontSize: 36, color: '#6a1b9a' }} />
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#6a1b9a' }}>
          Admin Panel
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ p: 3, bgcolor: '#f3e5f5', m: 2, borderRadius: 3, border: '1px solid #ce93d8' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: '#6a1b9a', width: 50, height: 50, fontWeight: 'bold' }}>
            AD
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">Super Admin</Typography>
            <Typography variant="caption" sx={{ color: '#6a1b9a', fontWeight: 600 }}>
              Administrator
            </Typography>
          </Box>
        </Box>
      </Box>

      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                bgcolor: isActive(item.path) ? '#f3e5f5' : 'transparent',
                '&:hover': { bgcolor: '#f3e5f5' },
                py: 1.5
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? '#6a1b9a' : '#64748b', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 700 : 500,
                  color: isActive(item.path) ? '#6a1b9a' : '#1e293b'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ position: 'absolute', bottom: 20, left: 0, right: 0, px: 2 }}>
        <ListItemButton
          onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
          sx={{ borderRadius: 2, border: '1px solid #e2e8f0', '&:hover': { bgcolor: '#fee', borderColor: '#d32f2f' } }}
        >
          <ListItemIcon sx={{ color: '#d32f2f', minWidth: 40 }}><Logout /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, color: '#d32f2f' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` }, bgcolor: 'white', boxShadow: 1, display: { sm: 'none' } }}>
        <Toolbar>
          <IconButton color="primary" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2 }}>
            <Menu />
          </IconButton>
          <Typography variant="h6" sx={{ color: '#6a1b9a' }} fontWeight="bold">Admin Panel</Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}>
          {drawer}
        </Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth } }} open>
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;