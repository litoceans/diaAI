'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft,
  LayoutDashboard,
  Users,
  Settings,
  User,
  LogOut,
  Folder,
  FolderKanban,
} from 'lucide-react';

const drawerWidth = 280;

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const { admin, isLoading, logout } = useAdminAuth();

  useEffect(() => {
    if (!isLoading && !admin && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [admin, isLoading, router, pathname]);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => logout();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/admin/dashboard',
    },
    {
      text: 'Users',
      icon: <Users size={20} />,
      path: '/admin/users',
    },
    {
      text: 'Projects',
      icon: <FolderKanban size={20} />,
      path: '/admin/projects',
    },
    {
      text: 'Settings',
      icon: <Settings size={20} />,
      path: '/admin/settings',
    },
  ];

  // Show loading spinner during initial load
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'background.default'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show login page when not authenticated
  if (!admin && pathname === '/admin/login') {
    return children;
  }

  // Don't show anything if not authenticated and not on login page
  if (!admin) {
    return null;
  }

  // Show admin layout when authenticated
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              mr: 2,
              color: 'text.primary',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, color: 'text.primary' }}
          >
            Admin Dashboard
          </Typography>
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              p: 0,
              border: '2px solid',
              borderColor: 'primary.main',
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 35,
                height: 35,
              }}
            >
              {admin?.email?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              mt: 1,
              '& .MuiPaper-root': {
                borderRadius: 2,
                minWidth: 180,
                boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
              },
            }}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                router.push('/admin/settings');
              }}
              sx={{
                py: 1.5,
                px: 2.5,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <ListItemIcon>
                <User size={18} />
              </ListItemIcon>
              Profile
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                handleMenuClose();
                handleLogout();
              }}
              sx={{
                py: 1.5,
                px: 2.5,
                color: 'error.main',
                '&:hover': { bgcolor: 'error.lighter' },
              }}
            >
              <ListItemIcon>
                <LogOut size={18} color="error" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeft />
          </IconButton>
        </Toolbar>
        <Divider />
        <List sx={{ px: 2, py: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => router.push(item.path)}
                selected={pathname === item.path}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.lighter',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.lighter',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: pathname === item.path ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: pathname === item.path ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
