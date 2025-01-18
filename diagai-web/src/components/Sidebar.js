'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCredits } from '@/context/CreditsContext';
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
  Skeleton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LayoutDashboard,
  FolderKanban,
  CreditCard,
  UserCircle,
  Settings,
  LogOut,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {userApi} from '@/services/api';

const menuItems = [
  { text: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { text: 'Projects', icon: FolderKanban, path: '/projects' },
  { text: 'Pricing', icon: CreditCard, path: '/pricing' },
  { text: 'Profile', icon: UserCircle, path: '/profile' },
  { text: 'Settings', icon: Settings, path: '/settings' },
];

const drawerWidth = 240;

// Animation variants
const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const CreditsDisplay = ({ isCompact }) => {
  const { credits, loading } = useCredits();
  const [userCredits, setUserCredits] = useState(0);
  const theme = useTheme();

  const getCredits = async () => {
    const credits = await userApi.getCredits();
    setUserCredits(credits.credits);
    return credits.credits;
  }

  useEffect(() => {
    getCredits();
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        p: isCompact ? 1 : 2,
        width: '90%',
        boxSizing: 'border-box',
        padding: isCompact ? '8px 12px' : '16px 24px',
        borderRadius: 1
      }}>
        <Skeleton variant="text" width="60%" height={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: isCompact ? 1 : 2,
      borderRadius: 1,
      boxSizing: 'border-box'
    }}>
      <Typography 
        variant={isCompact ? "caption" : "body2"}
        color="text.secondary"
        sx={{ 
          mb: isCompact ? 0.5 : 1,
          fontSize: isCompact ? '0.7rem' : 'inherit',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        Credits: {userCredits || 0}
      </Typography>
    </Box>
  );
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const sidebarWidth = {
    xs: theme.spacing(10),
    sm: drawerWidth,
  };

  if (!user) return null;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        '& .MuiDrawer-paper': {
          position: 'relative',
          width: sidebarWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
          overflowX: 'hidden',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Box sx={{ 
        p: isMobile ? 1 : 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: isMobile ? 'center' : 'flex-start'
      }}>
        <Typography 
          variant={isMobile ? "subtitle1" : "h6"}
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ 
            flexGrow: 1,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            textAlign: isMobile ? 'center' : 'left',
            fontSize: {
              xs: '1.2rem',
              sm: '1.5rem',
              md: '1.8rem'
            }
          }}
        >
          {isMobile ? 'D' : 'DiaAI'}
        </Typography>
      </Box>
      <CreditsDisplay isCompact={isMobile} />
      <Divider sx={{ my: 1 }} />
      <List sx={{ px: isMobile ? 0.5 : 1 }}>
        {menuItems.map((item, index) => (
          <motion.div
            key={item.text}
            variants={listItemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
          >
            <ListItem
              component={Link}
              href={item.path}
              sx={{
                minHeight: { xs: 40, sm: 48 },
                my: { xs: 0.3, sm: 0.5 },
                borderRadius: 1,
                mx: { xs: 0.5, sm: 1 },
                px: isMobile ? 1.5 : 2,
                backgroundColor: pathname === item.path ? 'action.selected' : 'transparent',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  transform: 'translateX(5px)',
                  transition: 'all 0.3s ease'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: { xs: 36, sm: 40 },
                color: pathname === item.path ? 'primary.main' : 'inherit'
              }}>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon size={isMobile ? 16 : 20} />
                </motion.div>
              </ListItemIcon>
              {!isMobile && (
                <ListItemText 
                  primary={item.text} 
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: {
                        sm: '0.9rem',
                        md: '1rem'
                      }
                    }
                  }}
                />
              )}
            </ListItem>
          </motion.div>
        ))}
      </List>
      <Box sx={{ 
        mt: 'auto', 
        p: isMobile ? 1 : 2,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Button
          component={motion.button}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          fullWidth={!isMobile}
          variant="outlined"
          color="error"
          onClick={logout}
          startIcon={!isMobile && <LogOut size={20} />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            minWidth: isMobile ? '40px' : 'auto',
            p: isMobile ? '8px' : '8px 16px',
            width: isMobile ? '40px' : '100%'
          }}
        >
          {isMobile ? <LogOut size={16} /> : 'Logout'}
        </Button>
      </Box>
    </Drawer>
  );
}
