'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';

const getErrorMessage = (error) => {
  if (error?.response?.status === 401) {
    return 'Invalid email or password';
  }
  return error?.message || 'An error occurred during login';
};

export default function AdminLogin() {
  const router = useRouter();
  const { admin, isLoading, login } = useAdminAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      await login(credentials.email, credentials.password);
      // router.push('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Don't show anything until we've initialized auth
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Don't show login form if already authenticated
  if (admin) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          component={motion.form}
          onSubmit={handleLogin}
          elevation={2}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 1,
                fontWeight: 600,
                background: 'linear-gradient(45deg, #1976D2, #42A5F5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Admin Login
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to access the admin dashboard
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleInputChange}
              error={!!error}
              disabled={isSubmitting}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleInputChange}
              error={!!error}
              disabled={isSubmitting}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
              required
            />
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                borderRadius: 2,
                '& .MuiAlert-message': {
                  width: '100%',
                },
              }}
            >
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <LogIn />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
