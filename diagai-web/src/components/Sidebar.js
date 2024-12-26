'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  LayoutDashboard,
  FolderKanban,
  CreditCard,
  UserCircle,
  Settings,
  LogOut,
} from 'lucide-react';

const menuItems = [
  { text: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { text: 'Projects', icon: FolderKanban, path: '/projects' },
  { text: 'Pricing', icon: CreditCard, path: '/pricing' },
  { text: 'Profile', icon: UserCircle, path: '/profile' },
  { text: 'Settings', icon: Settings, path: '/settings' },
];

const drawerWidth = 240;

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [credits, setCredits] = useState(10); // TODO: Fetch from API

  if (!user) return null;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          DiaAI
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Credits remaining: {credits}
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            href={item.path}
            sx={{
              backgroundColor: pathname === item.path ? 'action.selected' : 'transparent',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemIcon>
              <item.icon size={20} />
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={logout}
          startIcon={<LogOut size={20} />}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}
