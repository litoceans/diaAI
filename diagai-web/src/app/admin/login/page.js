'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

const getErrorMessage = (error) => {
  switch (error?.code) {
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled. Please contact the administrator.';
    case 'auth/user-not-found':
      return 'No user found with this email address.';
    case 'auth/wrong-password':
      return 'Invalid password.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign in was cancelled. Please try again.';
    case 'auth/cancelled-popup-request':
      return 'Only one sign in window can be open at a time.';
    case 'auth/popup-blocked':
      return 'Sign in popup was blocked by the browser. Please allow popups and try again.';
    default:
      return error?.message || 'An error occurred during login.';
  }
};

export default function AdminLogin() {
  const router = useRouter();
  const { user, login, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(credentials.email, credentials.password);
      router.push('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      router.push('/admin/dashboard');
    } catch (err) {
      console.error('Google sign in error:', err);
      setError(getErrorMessage(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            sx={{
              mb: 3,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              borderRadius: 2,
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'background.paper',
              },
            }}
          >
            {googleLoading ? (
              <CircularProgress size={24} />
            ) : (
              <Image
                src="/google.svg"
                alt="Google"
                width={24}
                height={24}
                style={{ objectFit: 'contain' }}
              />
            )}
            <span>Continue with Google</span>
          </Button>

          <Box sx={{ position: 'relative', my: 3 }}>
            <Divider>
              <Typography
                variant="body2"
                sx={{
                  px: 2,
                  color: 'text.secondary',
                  bgcolor: 'background.paper',
                }}
              >
                Or sign in with email
              </Typography>
            </Divider>
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
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <LogIn size={20} />}
            sx={{
              borderRadius: 2,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #1976D2 30%, #42A5F5 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565C0 30%, #1976D2 90%)',
              },
              '&.Mui-disabled': {
                background: 'rgba(0, 0, 0, 0.12)',
              },
            }}
          >
            {loading ? 'Signing in...' : 'Sign In with Email'}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
