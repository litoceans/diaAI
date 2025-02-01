'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Checkbox,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signInWithGoogle, isAuthenticated, loading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Only redirect if we've finished loading and user is authenticated
    if (!loading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.default'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleGoogleSignIn = async () => {
    if (!agreedToTerms) {
      setError('Please agree to the Terms & Conditions and Privacy Policy to continue.');
      return;
    }
    
    if (isLoading) return; // Prevent multiple clicks
    
    setError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
      }}
    >
      {/* Left Side - Illustration */}
      {!isMobile && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2rem',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Image
                src="/logo.png"
                alt="DiaAI Logo"
                width={48}
                height={48}
                style={{ objectFit: 'contain' }}
              />
              <Typography variant="h3" fontWeight="bold">
                DiaAI
              </Typography>
            </Box>
            <Image
              src="/login-illustration.svg"
              alt="Login Illustration"
              width={400}
              height={400}
              style={{ objectFit: 'contain' }}
              priority
            />
            <Typography variant="h4" component="h1" align="center" gutterBottom fontWeight="bold">
              Welcome Back!
            </Typography>
            <Typography variant="h6" align="center" sx={{ maxWidth: 400 }}>
              Create beautiful diagrams and flowcharts with the power of AI
            </Typography>
          </motion.div>
        </Box>
      )}

      {/* Right Side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
        }}
      >
        <Container maxWidth="sm">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ width: '100%' }}
          >
            <Paper
              elevation={2}
              sx={{
                p: 4,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <Typography
                variant="h4"
                align="center"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  background: 'linear-gradient(45deg, #1976D2, #42A5F5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Sign In
              </Typography>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Image 
                      src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                      alt="Google"
                      width={20}
                      height={20}
                    />
                  )
                }
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'background.paper',
                  },
                }}
              >
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </Button>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    color="primary"
                    disabled={isLoading}
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    I agree to the Terms & Conditions and Privacy Policy
                  </Typography>
                }
              />
            </Paper>
          </motion.div>
        </Container>
      </Box>
      {/* Add Snackbar for error messages */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
